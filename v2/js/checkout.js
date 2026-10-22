import { supabase } from './supabase.js';
import { getCart, clearCart, removeItem } from './cart.js?v=20261019-08';

const panel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');

let checkoutForm = null;

function updateCheckoutVisibility() {
  if(!checkoutForm)return;
  if(!getCart().length)checkoutForm.hidden=true;
  cartContent.hidden=Boolean(getCart().length&&!checkoutForm.hidden);
}

async function getAvailablePickupSlots() {
  const [slotResult, openingResult] = await Promise.all([
    supabase.from("service_slots")
      .select("id,service_date,start_time,end_time,active,max_preparation_minutes")
      .eq("active", true).order("service_date").order("start_time"),
    supabase.from("weekly_opening_hours").select("day_of_week,service_period,is_open")
  ]);
  if (slotResult.error) throw new Error("Impossible de charger les créneaux du planning : " + slotResult.error.message);
  if (openingResult.error) throw new Error("Impossible de vérifier les ouvertures : " + openingResult.error.message);
  const openPeriods = new Set((openingResult.data || [])
    .filter(row => row.is_open)
    .map(row => Number(row.day_of_week) + "|" + row.service_period));
  const now = new Date();
  const minimum = new Date(now); minimum.setHours(0,0,0,0);
  minimum.setDate(minimum.getDate() + (now.getHours() >= 18 ? 2 : 1));
  const monday = new Date(now); monday.setHours(0,0,0,0);
  monday.setDate(monday.getDate() - ((monday.getDay()+6)%7));
  const latest = new Date(monday); latest.setDate(latest.getDate()+7);
  const minDate = formatDateForDatabase(minimum), maxDate = formatDateForDatabase(latest);
  const slots = (slotResult.data || []).filter(slot => {
    if (slot.service_date < minDate || slot.service_date > maxDate || !slot.start_time || !slot.end_time) return false;
    const day = new Date(slot.service_date + "T12:00:00").getDay();
    const period = String(slot.start_time).slice(0,5) < "15:00" ? "midi" : "soir";
    return openPeriods.has(day + "|" + period);
  });
  if (!slots.length) throw new Error("Aucun créneau ouvert n’est actuellement disponible dans le planning.");
  return slots;
}
function getPickupLabel(dateValue, timeValue) {
  const date = new Date(dateValue + "T12:00:00");
  const dateLabel = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const time = String(timeValue || "").slice(0, 5);
  return dateLabel + " à " + (time || "midi");
}

function formatDateForDatabase(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function refreshPickupLabel() {
  const select = checkoutForm?.querySelector("#pickup-date");
  if (!select) return;
  try {
    const slots = await getAvailablePickupSlots();
    select.innerHTML = '<option value="" selected disabled>Choisissez un créneau de retrait</option>' + slots.map(slot => {
      const label = getPickupLabel(slot.service_date, slot.start_time);
      const safeLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return '<option value="' + slot.id + '" data-pickup-date="' + slot.service_date + '">' + safeLabel + '</option>';
    }).join("");
    select.title = "";
  } catch (error) {
    select.innerHTML = '<option value="" selected disabled>Aucun créneau disponible</option>';
    select.title = error.message;
    const details = checkoutForm.querySelector("#checkout-details");
    if (details) details.hidden = true;
  }
}

function mountCheckout() {
  if (!panel || !cartContent || checkoutForm) return;

  const savedName = localStorage.getItem("customerName") || "";
  const savedEmail = localStorage.getItem("customerEmail") || "";

  const box = document.createElement("form");
  box.id = "order-form";
  box.hidden = true;

  box.innerHTML = `
    <div class="checkout-box">

      <label class="checkout-pickup">
        <strong>1. Choisissez votre créneau de retrait</strong>
        <select name="pickup_date" id="pickup-date" required>
          <option value="" selected disabled>Vérification des ouvertures…</option>
        </select>
      </label>

      <div id="checkout-details" hidden>
      <h3>2. Vos informations</h3>

      <input
        name="customer_name"
        placeholder="Nom"
        value="${savedName}"
        required
      >

      <input
        name="email"
        type="email"
        placeholder="Email personnel"
        value="${savedEmail}"
        required
      >
      
     <input
        name="phone"
        type="tel"
        placeholder="Téléphone (06 12 34 56 78)"
        value="${localStorage.getItem('customerPhone') || ''}"
        inputmode="tel"
        autocomplete="tel"
        required
        pattern="^(?:(?:[+]33|0033|0)[67](?: ?[0-9]){8})$"
        title="Entrez un numéro français valide (06 12 34 56 78 ou +33 6 12 34 56 78)."
      />
      <textarea
        name="comment"
        placeholder="Commentaire (facultatif)"
        rows="3"
      ></textarea>

      <button class="secondary-cart-action" type="button" data-back-to-cart>Retour au panier</button>

      <button class="button cart-submit" type="submit">
        Enregistrer la commande
      </button>

      <p id="order-status"></p>
      </div>

    </div>
  `;

  panel.insertBefore(box, cartContent);
  checkoutForm = box;
  refreshPickupLabel();

  document.addEventListener("cart:updated", updateCheckoutVisibility);
  box.querySelector("#pickup-date")?.addEventListener("change", event => {
    const details=box.querySelector("#checkout-details");
    if(details)details.hidden=!event.target.value;
    if(event.target.value){
      // Garder le début du formulaire visible au-dessus du clavier mobile.
      requestAnimationFrame(()=>{
        panel.scrollTo({top:0,behavior:"smooth"});
        const nameField=box.querySelector('[name="customer_name"]');
        nameField?.focus({preventScroll:true});
        requestAnimationFrame(()=>panel.scrollTo({top:0,behavior:"smooth"}));
      });
    }
  });

  box.querySelector("[data-back-to-cart]")?.addEventListener("click", () => {
    checkoutForm.hidden = true;
    cartContent.hidden = false;
    panel.scrollTo({ top: 0, behavior: "smooth" });
  });

  box.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = box.querySelector("#order-status");
    const submit = box.querySelector('button[type="submit"]');

    const formData = new FormData(box);
    const cartItems = getCart();

    if (!cartItems.length) {
      status.textContent = "Votre panier est vide.";
      updateCheckoutVisibility();
      return;
    }

    const customerName = String(formData.get("customer_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "")
      .replace(/\s+/g, "")
      .trim();
    const comment = String(formData.get("comment") || "").trim();
    
    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", phone);

    submit.disabled = true;
    status.textContent = "Vérification des jours d’ouverture…";
    let pickupSlot;
    let pickupDate;
    try {
      const slots = await getAvailablePickupSlots();
      const selectedSlotId = String(box.querySelector("#pickup-date").value || "");
      pickupSlot = slots.find(slot => slot.id === selectedSlotId);
      if (!pickupSlot) throw new Error("Choisissez un créneau disponible dans le planning.");
      pickupDate = new Date(pickupSlot.service_date + "T12:00:00");
    } catch (error) {
      status.textContent = error.message;
      submit.disabled = false;
      return;
    }
    const pickupLabel = getPickupLabel(pickupSlot.service_date, pickupSlot.start_time);
    status.textContent = "Vérification des produits...";

    const { data: products, error: productsError } =
      await supabase
        .from("products")
        .select("id,name,protein_options,active").eq("active", true);

    if (productsError) {
      status.textContent = "Erreur produits : " + productsError.message;
      submit.disabled = false;
      return;
    }

    const productsByName = new Map(
      (products || []).map(product => [
        String(product.name).trim().toLocaleLowerCase("fr-FR"),
        product
      ])
    );
    const { data: proteinRows, error: proteinError } = await supabase
      .from("protein_availability")
      .select("protein_name,available");
    if (proteinError) {
      status.textContent = "Impossible de vérifier les ruptures de viande : " + proteinError.message;
      submit.disabled = false;
      return;
    }
    const proteinStatus = new Map((proteinRows || []).map(row => [
      String(row.protein_name).trim().toLocaleLowerCase("fr-FR"),
      row.available !== false
    ]));
    const unavailableItems = cartItems.filter(item => {
      const name = String(item.name).trim().toLocaleLowerCase("fr-FR");
      const protein = String(item.protein || (name === "tom kha kai" ? "Poulet" : "")).trim().toLocaleLowerCase("fr-FR");
      return !productsByName.has(name) || (protein && proteinStatus.get(protein) === false);
    });
    if (unavailableItems.length) {
      unavailableItems.forEach(item => removeItem(item.key));
      status.textContent = unavailableItems.length === 1
        ? "Un article en rupture a été retiré du panier. Vérifiez votre panier avant de recommencer."
        : unavailableItems.length + " articles en rupture ont été retirés du panier. Vérifiez votre panier avant de recommencer.";
      submit.disabled = false;
      return;
    }
    const items = [];

    for (const item of cartItems) {
      const product = productsByName.get(
        String(item.name).trim().toLowerCase()
      );

      if (!product) {
        status.textContent = "Produit introuvable : " + item.name;
        submit.disabled = false;
        return;
      }

      const spiceLevel = item.spicy
        ? Math.max(0, Math.min(3, Number(item.spice) || 0))
        : 0;
      const isNems = String(item.name).trim().toLowerCase().startsWith("nems maison");
      const isSatay = (String(item.id || "").startsWith("satay-poulet") || String(item.name || "").trim().toLocaleLowerCase("fr-FR").startsWith("brochette de filet de poulet satay"));

      if (isNems) {
        const existingNems = items.find(entry => entry._nemsPromo && entry.product_id === product.id);
        if (existingNems) {
          existingNems.quantity += 1;
        } else {
          items.push({
            product_id: product.id,
            quantity: 1,
            spice_level: spiceLevel,
            protein: null,
            _nemsPromo: true
          });
        }
      } else if (isSatay) {
        const existingSatay = items.find(entry => entry._satayPromo && entry.product_id === product.id);
        if (existingSatay) existingSatay.quantity += 1;
        else items.push({ product_id: product.id, quantity: 1, spice_level: spiceLevel, protein: null, _satayPromo: true });
      } else {
        const isBoBun = String(product.name).trim().toLocaleLowerCase("fr-FR").startsWith("bò bún");
        items.push({
          product_id: product.id,
          quantity: 1,
          spice_level: spiceLevel,
          protein: item.protein || (Array.isArray(product.protein_options) && product.protein_options.length === 1 ? product.protein_options[0] : null),
          sauce: isBoBun ? (item.sauce || "Sauce non pimentée") : null,
          customer_note: isBoBun ? `Sauce : ${item.sauce || "Sauce non pimentée"}` : null
        });
      }
    }

    const rpcItems = items.map(({ _nemsPromo, _satayPromo, ...item }) => item);
    status.textContent = "Enregistrement...";

    const { error } = await supabase.rpc(
      "create_pending_order",
      {
        p_first_name: customerName,
        p_last_name: "",
        p_email: email,
        p_phone: phone,
        p_service_slot_id: pickupSlot.id,
        p_items: rpcItems,
        p_customer_note: comment,
        p_pickup_date: formatDateForDatabase(pickupDate)
      }
    );

    if (error) {
      status.textContent = "Erreur : " + error.message;
      submit.disabled = false;
      return;
    }
status.textContent = "Votre commande est transmise à Tammy.";

clearCart(); // Déclenche déjà cart:updated

// Message de confirmation
cartContent.innerHTML = `
  <div class="order-success">
    <div class="success-icon">✓</div>
    <h3>Commande transmise</h3>
    <p>Votre commande est en cours de préparation.</p>
    <p class="pickup-reminder">
      Retrait : <strong>${pickupLabel}</strong>
    </p>
  </div>
`;

box.reset();

box.querySelector('[name="customer_name"]').value = customerName;
box.querySelector('[name="email"]').value = email;
box.querySelector('[name="phone"]').value = phone;

submit.disabled = false;
box.hidden = true;

// Ferme le panier puis remet toute l'interface à zéro
setTimeout(() => {
  panel.classList.remove("open");
}, 4000);
});

updateCheckoutVisibility();
}


function openCheckout(){
  if (!getCart().length) return;

  // Le formulaire est créé une seule fois puis simplement affiché.
  // Cette fonction est volontairement indépendante du rendu du panier.
  if (!checkoutForm) {
    mountCheckout();
  }

  if (!checkoutForm) return;

  checkoutForm.hidden=false;
  cartContent.hidden=true;
  refreshPickupLabel();
  requestAnimationFrame(()=>{
    panel.scrollTo({top:0,behavior:"smooth"});
    checkoutForm.scrollIntoView({block:"start",behavior:"smooth"});
    // Ne pas ouvrir le clavier avant que le client ait choisi son retrait.
    checkoutForm.querySelector("#pickup-date")?.focus({preventScroll:true});
  });
}

document.addEventListener("checkout:mount", () => {
  mountCheckout();
});

document.addEventListener("checkout:open", openCheckout);

mountCheckout();

