import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = "ttf-order-mail-9d6e1b7f4c2a8e5f0d3c7b1a6e4f9c2d";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") || "Tammy Thai Food <onboarding@resend.dev>";
const RECIPIENT = "sarcke@gmail.com";

function esc(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[c] || c));
}

function pickupLabel(createdAt: string) {
  const date = new Date(createdAt);
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const hour = Number(parts.find(p => p.type === "hour")?.value || 0);
  const pickup = new Date(date.getTime());
  pickup.setUTCDate(pickup.getUTCDate() + (hour >= 18 ? 2 : 1));
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(pickup);
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST" || req.headers.get("x-ttf-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return Response.json({ error: "Email provider not configured" }, { status: 503 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = payload?.record?.id;
  if (!orderId) return Response.json({ error: "Missing order id" }, { status: 400 });

  const supabaseSecretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
  const secretKey = supabaseSecretKeys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secretKey) {
    console.error("Supabase secret key is not available");
    return Response.json({ error: "Supabase server key unavailable" }, { status: 500 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, secretKey);
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,order_number,total,customer_first_name,customer_last_name,customer_email,customer_phone,customer_note,created_at,order_items(product_name,quantity,unit_price,line_total,spice_level,customer_note)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Order lookup failed", orderError);
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const rows = (order.order_items || []).map((item: any) => {
    const protein = String(item.customer_note || "").replace(/^Viande\s*:\s*/i, "").trim();
    const spice = Number(item.spice_level || 0);
    return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee">
          <strong>${esc(item.quantity)} × ${esc(item.product_name)}</strong>
          ${protein ? `<br><span>Viande : ${esc(protein)}</span>` : ""}
          <br><span>Piment : ${spice === 0 ? "Sans piment" : "Niveau " + spice}</span>
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${Number(item.line_total || 0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}</td>
      </tr>`;
  }).join("");

  const total = Number(order.total || 0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
  const pickup = pickupLabel(order.created_at);
  const customer = [order.customer_first_name, order.customer_last_name].filter(Boolean).join(" ");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222">
      <h2>Nouvelle commande #${esc(order.order_number)}</h2>
      <p><strong>Retrait : ${esc(pickup)} — midi</strong></p>
      <p><strong>Client :</strong> ${esc(customer)}<br>
      <strong>Téléphone :</strong> ${esc(order.customer_phone || "")}<br>
      <strong>Email :</strong> ${esc(order.customer_email || "")}</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        ${rows}
      </table>
      <p><strong>TOTAL : ${esc(total)}</strong></p>
      ${order.customer_note ? `<p><strong>Commentaire :</strong><br>${esc(order.customer_note)}</p>` : ""}
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Idempotency-Key": `tammy-order-${order.id}`
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [RECIPIENT],
      subject: `Nouvelle commande #${order.order_number} — ${total}`,
      html
    })
  });

  const body = await response.text();
  if (!response.ok) {
    console.error("Resend error", response.status, body);
    return new Response(body, { status: 502, headers: {"Content-Type":"application/json"} });
  }

  return Response.json({ ok: true, order_id: order.id });
});