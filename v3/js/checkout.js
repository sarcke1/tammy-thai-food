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

async function getAvailablePickupSlots(cartItems = getCart()) {
  const [{ data: slots, error: slotsError }, { data: products, error: productsError }] = await Promise.all([
    supabase.rpc("get_public_pickup_slots"),
    supabase.from("products").select("id,name,preparation_minutes,protein_options,active").eq("active", true)
  ]);
  if (slotsError) throw new Error("Impossible de charger les créneaux : " + slotsError.message);
  if (productsError) throw new Error("Impossible de calculer la préparation : " + productsError.message);

  const productsByName = new Map((products || []).map(product => [
    String(product.name).trim().toLocaleLowerCase("fr-FR"), product
  ]));
  const counts = new Map();
  for (const item of cartItems) {
    const key = String(item.name).trim().toLocaleLowerCase("fr-FR");
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let neededMinutes = 0;
  for (const [name, quantity] of counts) {
    const product = productsByName.get(name);
    if (!product) continue;
    const deliveredQuantity = name.startsWith("nems maison") ? quantity + Math.floor(quantity / 4) : quantity;
    neededMinutes += Math.max(1, Number(product.preparation_minutes) || 1) * deliveredQuantity;
  }
  return (slots || []).filter(slot => Number(slot.remaining_preparation_minutes) >= neededMinutes);
}

function getPickupLabel(dateValue, timeValue) {
  const date = new Date(String(dateValue) + "T12:00:00");
  const day = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return day + " à " + String(timeValue).slice(0,5);
}

async function refreshPickupLabel() {
  const select = checkoutForm?.querySelector("#pickup-date");
  if (!select) return;
  try {
    const slots = await getAvailablePickupSlots();
    select.innerHTML = '<option value="" selected disabled>Choisissez une date et une heure</option>' +
      slots.map(slot => {
        const label = getPickupLabel(slot.service_date, slot.start_time);
        return '<option value="' + slot.id + '">' + label + '</option>';
      }).join("");
    if (!slots.length) {
      select.innerHTML = '<option value="" selected disabled>Aucun créneau disponible pour ce panier</option>';
    }
    const details = checkoutForm.querySelector("#checkout-details");
    if (details) details.hidden = !select.value;
  } catch (error) {
    select.innerHTML = '<option value="" selected disabled>Créneaux indisponibles</option>';
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
        <select name="pickup_slot_id" id="pickup-date" required>
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
      return;
    }

    const customerName = String(formData.get("customer_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").replace(/\s+/g, "").trim();
    const comment = String(formData.get("comment") || "").trim();
    const selectedSlotId = String(formData.get("pickup_slot_id") || "");

    if (!customerName || !email || !phone || !selectedSlotId) {
      status.textContent = "Vérifiez les informations obligatoires et le créneau de retrait.";
      return;
    }

    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", phone);

    submit.disabled = true;
    status.textContent = "Vérification du créneau et des produits…";

    try {
      const availableSlots = await getAvailablePickupSlots(cartItems);
      const selectedSlot = availableSlots.find(slot => slot.id === selectedSlotId);
      if (!selectedSlot) {
        throw new Error("Ce créneau n’est plus disponible pour votre panier. Choisissez une autre heure.");
      }

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id,name,protein_options,preparation_minutes,active")
        .eq("active", true);

      if (productsError) throw new Error("Impossible de vérifier les produits : " + productsError.message);

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
        const protein = String(item.protein || (name === "tom kha kai" ? "Poulet" : name === "soupe de nouilles au bœuf" ? "Bœuf" : "")).trim().toLocaleLowerCase("fr-FR");
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
        const lookupName = String(item.name).trim().toLocaleLowerCase("fr-FR");
        const product = productsByName.get(lookupName === "ailes de poulet frit" ? "menu enfant — ailes de poulet frit" : lookupName);
        if (!product) throw new Error("Produit introuvable ou indisponible : " + item.name);

        const spiceLevel = item.spicy
          ? Math.max(0, Math.min(3, Number(item.spice) || 0))
          : 0;
        const isNems = String(product.name).trim().toLocaleLowerCase("fr-FR").startsWith("nems maison");
        const isSatay = (String(item.id || "").startsWith("satay-poulet") || String(item.name || "").trim().toLocaleLowerCase("fr-FR").startsWith("brochette de filet de poulet satay"));

        if (isNems) {
          const existingNems = items.find(entry => entry.product_id === product.id && entry._nemsPromo);
          if (existingNems) {
            existingNems.quantity += 1;
          } else {
            items.push({ product_id: product.id, quantity: 1, spice_level: spiceLevel, protein: null, _nemsPromo: true });
          }
        } else if (isSatay) {
          const existingSatay = items.find(entry => entry.product_id === product.id && entry._satayPromo);
          if (existingSatay) existingSatay.quantity += 1;
          else items.push({ product_id: product.id, quantity: 1, spice_level: spiceLevel, protein: null, _satayPromo: true });
        } else {
          items.push({
            product_id: product.id,
            quantity: 1,
            spice_level: spiceLevel,
            protein: item.protein || (
              Array.isArray(product.protein_options) && product.protein_options.length === 1
                ? product.protein_options[0]
                : null
            ),
            customer_note: [item.sauce ? "Sauce : " + item.sauce : "", item.side ? "Accompagnement : " + item.side : ""].filter(Boolean).join(" — ") || null
          });
        }
      }

      const rpcItems = items.map(({ _nemsPromo, _satayPromo, ...item }) => item);
      status.textContent = "Enregistrement de votre commande…";

      const { data: orderData, error: orderError } = await supabase.rpc(
        "create_public_order_in_slot",
        {
          p_first_name: customerName,
          p_last_name: "",
          p_email: email,
          p_phone: phone,
          p_service_slot_id: selectedSlotId,
          p_items: rpcItems,
          p_customer_note: comment
        }
      );

      if (orderError) throw new Error(orderError.message || "Impossible d’enregistrer la commande.");

      const order = Array.isArray(orderData) ? orderData[0] : orderData;
      if (!order?.order_number) throw new Error("La commande a été envoyée, mais son numéro n’a pas pu être récupéré.");

      const pickupLabel = getPickupLabel(selectedSlot.service_date, selectedSlot.start_time);
      clearCart();
      box.reset();
      box.querySelector('[name="customer_name"]').value = customerName;
      box.querySelector('[name="email"]').value = email;
      box.querySelector('[name="phone"]').value = phone;
      box.hidden = true;
      cartContent.hidden = false;
      cartContent.innerHTML = `
        <div class="order-success">
          <div class="success-icon">✓</div>
          <h3>Commande enregistrée</h3>
          <p>Numéro de commande : <strong>#${order.order_number}</strong></p>
          <p>Votre commande a été transmise à Tammy.</p>
          <p class="pickup-reminder">Retrait : <strong>${pickupLabel}</strong></p>
          <p>Le paiement sera effectué au retrait.</p>
        </div>
      `;
    } catch (error) {
      status.textContent = "Commande non enregistrée : " + (error?.message || "erreur inconnue");
    } finally {
      submit.disabled = false;
    }
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

