import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://tammythaifood.fr",
  "https://www.tammythaifood.fr",
  "https://sarcke1.github.io"
]);

function siteBaseFor(origin: string) {
  if (origin === "https://sarcke1.github.io") return origin + "/tammy-thai-food/v3/";
  if (origin === "https://www.tammythaifood.fr") return origin + "/";
  return "https://tammythaifood.fr/";
}
const PAYPAL_API = Deno.env.get("PAYPAL_ENV") === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Méthode non autorisée." }, 405);
  const origin = req.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.has(origin)) return reply({ error: "Origine non autorisée." }, 403);
  const siteBase = siteBaseFor(origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return reply({ error: "Configuration serveur Supabase absente." }, 500);
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  let orderId: string | null = null;
  try {
    const body = await req.json();
    const provider = String(body.provider || "");
    if (!["stripe", "paypal"].includes(provider)) return reply({ error: "Moyen de paiement invalide." }, 400);
    const customer = body.customer || {};
    const items = body.items;
    const slotId = String(body.service_slot_id || "");
    if (!Array.isArray(items) || !items.length || items.length > 100 || !slotId) return reply({ error: "Commande incomplète." }, 400);
    if (String(customer.first_name || "").trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(customer.email || "")) || String(customer.phone || "").replace(/\s/g, "").length < 10) {
      return reply({ error: "Informations client invalides." }, 400);
    }

    const { data: rpcData, error: rpcError } = await admin.rpc("create_public_order_in_slot", {
      p_first_name: String(customer.first_name).trim(),
      p_last_name: String(customer.last_name || "").trim(),
      p_email: String(customer.email).trim().toLowerCase(),
      p_phone: String(customer.phone).trim(),
      p_service_slot_id: slotId,
      p_items: items,
      p_customer_note: String(body.customer_note || "").trim() || null,
      p_payment_provider: provider
    });
    if (rpcError) return reply({ error: rpcError.message || "Commande refusée." }, 400);
    const created = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    if (!created?.order_number || !created?.total || Number(created.total) <= 0) return reply({ error: "Montant de commande invalide." }, 400);

    const { data: order, error: orderError } = await admin.from("orders")
      .select("id,order_number,total")
      .eq("order_number", created.order_number)
      .eq("sales_channel", "public")
      .single();
    if (orderError || !order) return reply({ error: "Commande créée mais impossible de préparer le paiement." }, 500);
    orderId = order.id;
    const cents = Math.round(Number(order.total) * 100);
    if (!Number.isSafeInteger(cents) || cents < 1) throw new Error("Montant invalide.");

    let checkoutUrl = "";
    let reference = "";
    if (provider === "stripe") {
      const secret = Deno.env.get("STRIPE_SECRET_KEY");
      if (!secret) throw new Error("Configuration Stripe absente.");
      const form = new URLSearchParams({
        mode: "payment",
        customer_email: String(customer.email).trim(),
        "phone_number_collection[enabled]": "true",
        success_url: siteBase + "?payment=success&provider=stripe&order_id=" + encodeURIComponent(order.id) + "&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: siteBase + "?payment=cancelled&provider=stripe&order_id=" + encodeURIComponent(order.id),
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": String(cents),
        "line_items[0][price_data][product_data][name]": "Commande Tammy Thai Food #" + order.order_number,
        "line_items[0][quantity]": "1",
        "metadata[order_id]": order.id,
        "metadata[order_number]": String(order.order_number)
      });
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: "Bearer " + secret, "Content-Type": "application/x-www-form-urlencoded" },
        body: form
      });
      const data = await response.json();
      if (!response.ok || !data.url || !data.id) throw new Error("Stripe n’a pas pu créer la session de paiement.");
      checkoutUrl = data.url;
      reference = data.id;
    } else {
      const token = await paypalAccessToken();
      const response = await fetch(PAYPAL_API + "/v2/checkout/orders", {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{ reference_id: String(order.order_number), custom_id: order.id, invoice_id: "TTF-" + order.order_number, amount: { currency_code: "EUR", value: Number(order.total).toFixed(2) }, description: "Commande Tammy Thai Food #" + order.order_number }],
          application_context: { brand_name: "Tammy Thai Food", user_action: "PAY_NOW", return_url: siteBase + "?payment=return&provider=paypal&order_id=" + encodeURIComponent(order.id), cancel_url: siteBase + "?payment=cancelled&provider=paypal&order_id=" + encodeURIComponent(order.id) }
        })
      });
      const data = await response.json();
      if (!response.ok || !data.id || !Array.isArray(data.links)) throw new Error("PayPal n’a pas pu créer la commande de paiement.");
      checkoutUrl = data.links.find((link: { rel: string; href: string }) => ["approve", "payer-action"].includes(link.rel))?.href || "";
      reference = data.id;
      if (!checkoutUrl) throw new Error("Lien de validation PayPal introuvable.");
    }

    const { error: updateError } = await admin.from("orders").update({
      payment_provider: provider,
      payment_reference: reference,
      payment_status: "pending",
      status: "pending_payment",
      updated_at: new Date().toISOString()
    }).eq("id", order.id);
    if (updateError) throw new Error("Paiement créé mais statut impossible à enregistrer.");
    return reply({ checkout_url: checkoutUrl, order_number: order.order_number });
  } catch (error) {
    if (orderId) {
      await admin.from("orders").update({ status: "cancelled", payment_status: "failed" }).eq("id", orderId).in("payment_status", ["unpaid", "pending"]);
    }
    return reply({ error: error instanceof Error ? error.message : "Erreur de préparation du paiement." }, 500);
  }
});
