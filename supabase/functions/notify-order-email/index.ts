import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("TTF_WEBHOOK_SECRET") || "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";
const BREVO_FROM = { name: "Tammy Thai Food", email: "commandes@tammythaifood.fr" };
const RECIPIENT = "sarcke@gmail.com";

function esc(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[c] || c));
}

function pickupLabel(pickupDate: string | null, pickupTime: string | null, createdAt: string) {
  if (pickupDate) {
    const dateLabel = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(new Date(pickupDate + "T12:00:00Z"));
    const match = String(pickupTime || "").match(/^(\\d{2}):(\\d{2})/);
    const timeLabel = match ? match[1] + " h " + match[2] : "midi";
    return dateLabel + " à " + timeLabel;
  }
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

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not configured");
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
    .select("id,order_number,total,customer_first_name,customer_last_name,customer_email,customer_phone,customer_note,created_at,pickup_date,pickup_time,order_items(product_name,quantity,unit_price,line_total,spice_level,customer_note)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Order lookup failed", orderError);
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const rows = (order.order_items || []).map((item: any) => {
    const proteinMatch = String(item.customer_note || "").match(/^Viande\s*:\s*([^—]+)/i);
    const protein = proteinMatch ? proteinMatch[1].trim() : "";
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
  const pickup = pickupLabel(order.pickup_date || null, order.pickup_time || null, order.created_at);
  const customer = [order.customer_first_name, order.customer_last_name].filter(Boolean).join(" ");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222">
      <h2>Nouvelle commande #${esc(order.order_number)}</h2>
      <p><strong>Retrait : ${esc(pickup)}</strong></p>
      <p><strong>Client :</strong> ${esc(customer)}<br>
      <strong>Téléphone :</strong> ${esc(order.customer_phone || "")}<br>
      <strong>Email :</strong> ${esc(order.customer_email || "")}</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        ${rows}
      </table>
      <p><strong>TOTAL : ${esc(total)}</strong></p>
      ${order.customer_note ? `<p><strong>Commentaire :</strong><br>${esc(order.customer_note)}</p>` : ""}
      <p style="margin-top:24px"><a href="https://sarcke1.github.io/tammy-thai-food/v2/admin/" style="display:inline-block;background:#234d3d;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Ouvrir l’administration des commandes</a></p>
    </div>`;

  if (payload?.type === "UPDATE" && payload?.old_record?.status !== "ready" && payload?.record?.status === "ready") {
    if (!order.customer_email) {
      console.warn("Pickup-ready email skipped: customer email missing", order.order_number);
      return Response.json({ ok: true, order_id: order.id, pickup_ready_email_sent: false, reason: "missing_customer_email" });
    }

    const readyHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222">
        <h2>Votre commande #${esc(order.order_number)} est prête</h2>
        <p>Bonjour ${esc(customer)},</p>
        <p>Votre commande Tammy Thai Food est prête et vous attend pour le retrait.</p>
        <p><strong>Retrait prévu : ${esc(pickup)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}</table>
        <p><strong>TOTAL : ${esc(total)}</strong></p>
        <p>À bientôt,<br>Tammy Thai Food</p>
      </div>`;

    const readyResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({
        sender: BREVO_FROM,
        to: [{ email: order.customer_email }],
        subject: `Votre commande #${order.order_number} est prête au retrait`,
        htmlContent: readyHtml
      })
    });
    const readyBody = await readyResponse.text();
    if (!readyResponse.ok) {
      console.error("Brevo pickup-ready email error", readyResponse.status, readyBody);
      return new Response(readyBody, { status: 502, headers: { "Content-Type": "application/json" } });
    }
    return Response.json({ ok: true, order_id: order.id, pickup_ready_email_sent: true });
  }

  const adminResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: BREVO_FROM,
      to: [{ email: RECIPIENT }],
      subject: `Nouvelle commande #${order.order_number} — ${total}`,
      htmlContent: html
    })
  });

  const adminBody = await adminResponse.text();
  if (!adminResponse.ok) {
    console.error("Brevo admin email error", adminResponse.status, adminBody);
    return new Response(adminBody, { status: 502, headers: {"Content-Type":"application/json"} });
  }

  let customerEmailSent = false;
  if (order.customer_email) {
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#222">
        <h2>Merci pour votre commande #${esc(order.order_number)}</h2>
        <p>Bonjour ${esc(customer)},</p>
        <p>Nous avons bien reçu votre commande chez Tammy Thai Food.</p>
        <p><strong>Retrait prévu : ${esc(pickup)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}</table>
        <p><strong>TOTAL : ${esc(total)}</strong></p>
        ${order.customer_note ? `<p><strong>Votre commentaire :</strong><br>${esc(order.customer_note)}</p>` : ""}
        <p>Merci et à bientôt,<br>Tammy Thai Food</p>
      </div>`;

    const customerResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: BREVO_FROM,
        to: [{ email: order.customer_email }],
        subject: `Confirmation de votre commande #${order.order_number} — ${total}`,
        htmlContent: customerHtml
      })
    });
    const customerBody = await customerResponse.text();
    if (!customerResponse.ok) {
      console.error("Brevo customer confirmation error", customerResponse.status, customerBody);
      return new Response(customerBody, { status: 502, headers: {"Content-Type":"application/json"} });
    }
    customerEmailSent = true;
  }

  return Response.json({ ok: true, order_id: order.id, customer_email_sent: customerEmailSent });
});