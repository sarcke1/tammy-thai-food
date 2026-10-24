import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PAYPAL_API = Deno.env.get("PAYPAL_ENV") === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}
function hex(bytes: Uint8Array) { return [...bytes].map(value => value.toString(16).padStart(2, "0")).join(""); }

async function validStripeSignature(rawBody: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map(part => part.split("=", 2) as [string, string]));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = new TextEncoder().encode(timestamp + "." + rawBody);
  const expected = hex(new Uint8Array(await crypto.subtle.sign("HMAC", key, signed)));
  return constantTimeEqual(expected, signature);
}
async function paypalAccessToken() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!clientId || !secret) throw new Error("Configuration PayPal absente.");
  const response = await fetch(PAYPAL_API + "/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(clientId + ":" + secret), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("Authentification PayPal impossible.");
  return data.access_token as string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return reply({ error: "Méthode non autorisée." }, 405);
  const url = Deno.env.get("SUPABASE_URL"), serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return reply({ error: "Configuration serveur absente." }, 500);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const rawBody = await req.text();
  try {
    const stripeSignature = req.headers.get("stripe-signature");
    if (stripeSignature) {
      const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (!secret || !await validStripeSignature(rawBody, stripeSignature, secret)) return reply({ error: "Signature Stripe invalide." }, 401);
      const event = JSON.parse(rawBody);
      const session = event.data?.object;
      if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
        if (session?.id && session.metadata?.order_id) {
          const { error } = await admin.from("orders").update({
            status: "cancelled",
            payment_status: "failed",
            updated_at: new Date().toISOString()
          })
            .eq("id", session.metadata.order_id)
            .eq("payment_provider", "stripe")
            .eq("payment_reference", session.id)
            .eq("payment_status", "pending")
            .eq("status", "pending_payment");
          if (error) return reply({ error: "Annulation de commande impossible." }, 500);
        }
      } else if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
        if (session?.payment_status === "paid" && session.id && session.metadata?.order_id && session.currency === "eur") {
          const { data: order, error: lookupError } = await admin.from("orders").select("id,total")
            .eq("id", session.metadata.order_id).eq("payment_provider", "stripe").eq("payment_reference", session.id).maybeSingle();
          if (lookupError) return reply({ error: "Recherche de commande impossible." }, 500);
          if (order && Number(session.amount_total) === Math.round(Number(order.total) * 100)) {
            const { error } = await admin.from("orders").update({ payment_status: "paid", status: "paid", updated_at: new Date().toISOString() })
              .eq("id", order.id).eq("payment_provider", "stripe").eq("payment_reference", session.id);
            if (error) return reply({ error: "Mise à jour commande impossible." }, 500);
          }
        }
      }
      return reply({ received: true });
    }

    const paypalWebhookId = Deno.env.get("PAYPAL_WEBHOOK_ID");
    if (!paypalWebhookId) return reply({ error: "Webhook PayPal non configuré." }, 500);
    const token = await paypalAccessToken();
    const verifyResponse = await fetch(PAYPAL_API + "/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: req.headers.get("paypal-auth-algo"),
        cert_url: req.headers.get("paypal-cert-url"),
        transmission_id: req.headers.get("paypal-transmission-id"),
        transmission_sig: req.headers.get("paypal-transmission-sig"),
        transmission_time: req.headers.get("paypal-transmission-time"),
        webhook_id: paypalWebhookId,
        webhook_event: JSON.parse(rawBody)
      })
    });
    const verification = await verifyResponse.json();
    if (!verifyResponse.ok || verification.verification_status !== "SUCCESS") return reply({ error: "Signature PayPal invalide." }, 401);
    const event = JSON.parse(rawBody);
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const paypalOrderId = resource?.supplementary_data?.related_ids?.order_id;
      if (paypalOrderId) {
        const { data: order, error: lookupError } = await admin.from("orders").select("id,total")
          .eq("payment_provider", "paypal").eq("payment_reference", paypalOrderId).maybeSingle();
        if (lookupError) return reply({ error: "Recherche de commande impossible." }, 500);
        if (order && resource.amount?.currency_code === "EUR" && Number(resource.amount?.value) === Number(order.total)) {
          const { error } = await admin.from("orders").update({ payment_status: "paid", status: "paid", updated_at: new Date().toISOString() })
            .eq("id", order.id).eq("payment_provider", "paypal").eq("payment_reference", paypalOrderId);
          if (error) return reply({ error: "Mise à jour commande impossible." }, 500);
        }
      }
    }
    return reply({ received: true });
  } catch {
    return reply({ error: "Traitement du webhook impossible." }, 400);
  }
});
