import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://sarcke1.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

async function paypalAccessToken() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!clientId || !secret) throw new Error("Configuration PayPal absente.");
  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(clientId + ":" + secret), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("Authentification PayPal impossible.");
  return data.access_token as string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Méthode non autorisée." }, 405);
  if (req.headers.get("origin") !== "https://sarcke1.github.io") return reply({ error: "Origine non autorisée." }, 403);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return reply({ error: "Configuration serveur absente." }, 500);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    const body = await req.json();
    const provider = String(body.provider || "");
    const orderId = String(body.order_id || "");
    if (!orderId || !["stripe", "paypal"].includes(provider)) return reply({ error: "Référence de paiement invalide." }, 400);
    const { data: order, error: orderError } = await admin.from("orders")
      .select("id,order_number,total,payment_provider,payment_reference,payment_status")
      .eq("id", orderId).eq("payment_provider", provider).single();
    if (orderError || !order) return reply({ error: "Commande introuvable." }, 404);
    if (order.payment_status === "paid") return reply({ paid: true, order_number: order.order_number });

    if (provider === "stripe") {
      const secret = Deno.env.get("STRIPE_SECRET_KEY");
      const sessionId = String(body.session_id || "");
      if (!secret || !sessionId || sessionId !== order.payment_reference) return reply({ error: "Session Stripe invalide." }, 400);
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId), { headers: { Authorization: "Bearer " + secret } });
      const session = await response.json();
      if (!response.ok || session.metadata?.order_id !== order.id || session.payment_status !== "paid" || session.status !== "complete") {
        return reply({ paid: false, error: "Stripe n’a pas encore confirmé le paiement." }, 409);
      }
    } else {
      const paypalOrderId = String(body.paypal_order_id || "");
      if (!paypalOrderId || paypalOrderId !== order.payment_reference) return reply({ error: "Référence PayPal invalide." }, 400);
      const token = await paypalAccessToken();
      let response = await fetch("https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(paypalOrderId) + "/capture", {
        method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: "{}"
      });
      let paypalData = await response.json();
      if (!response.ok) {
        const verifyResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders/" + encodeURIComponent(paypalOrderId), { headers: { Authorization: "Bearer " + token } });
        paypalData = await verifyResponse.json();
        if (!verifyResponse.ok || paypalData.status !== "COMPLETED") return reply({ paid: false, error: "PayPal n’a pas confirmé le paiement." }, 409);
      }
      const unit = paypalData.purchase_units?.[0];
      if (paypalData.status !== "COMPLETED" || unit?.custom_id !== order.id || Number(unit?.payments?.captures?.[0]?.amount?.value) !== Number(order.total)) {
        return reply({ paid: false, error: "Les informations du paiement PayPal ne correspondent pas à la commande." }, 409);
      }
    }

    const { error: updateError } = await admin.from("orders").update({
      payment_status: "paid", status: "paid", updated_at: new Date().toISOString()
    }).eq("id", order.id).eq("payment_provider", provider);
    if (updateError) return reply({ error: "Paiement confirmé par le prestataire, mais mise à jour de la commande impossible." }, 500);
    return reply({ paid: true, order_number: order.order_number });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Confirmation impossible." }, 500);
  }
});
