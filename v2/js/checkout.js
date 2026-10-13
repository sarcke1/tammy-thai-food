import { supabase } from './supabase.js';
import { getCart, clearCart } from './cart.js?v=20261008-01';

const panel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');

let checkoutForm = null;

function updateCheckoutVisibility() {
  if (!checkoutForm) return;

  if (!getCart().length) {
    checkoutForm.hidden = true;
  }
}

async function getPickupDate() {
  const { data, error } = await supabase
    .from("weekly_opening_hours")
    .select("day_of_week,service_period,is_open");

  if (error) throw new Error("Impossible de vérifier les jours d’ouverture : " + error.message);
  const lunchRows = (data || []).filter(row => row.service_period === "midi");
  if (lunchRows.length !== 7) throw new Error("Le calendrier des ouvertures est incomplet. Réessayez plus tard.");

  const openLunchDays = new Set(lunchRows.filter(row => row.is_open).map(row => Number(row.day_of_week)));
  const now = new Date();
  const pickup = new Date(now);
  pickup.setHours(12, 0, 0, 0);
  pickup.setDate(pickup.getDate() + (now.getHours() >= 18 ? 2 : 1));

  for (let i = 0; i < 14; i++) {
    if (openLunchDays.has(pickup.getDay())) return pickup;
    pickup.setDate(pickup.getDate() + 1);
  }
  throw new Error("Aucun retrait à midi n’est ouvert dans les 14 prochains jours.");
}

function getPickupLabel(date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function formatDateForDatabase(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function refreshPickupLabel() {
  const label = checkoutForm?.querySelector("#pickup-label");
  if (!label) return;
  try {
    const pickupDate = await getPickupDate();
    label.textContent = `${getPickupLabel(pickupDate)} (midi)`;
  } catch (error) {
    label.textContent = "Indisponible";
    label.title = error.message;
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

      <h3>Vos informations</h3>

      <p class="checkout-help">
        Retrait : <strong id="pickup-label">Vérification des ouvertures…</strong>
      </p>

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

      <button class="button cart-submit" type="submit">
        Enregistrer la commande
      </button>

      <p id="order-status"></p>

    </div>
  `;

  cartContent.after(box);
  checkoutForm = box;

  document.addEventListener("cart:updated", updateCheckoutVisibility);

  box.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = box.querySelector("#order-status");
    const submit = box.querySelector("button");

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
    let pickupDate;
    try {
      pickupDate = await getPickupDate();
    } catch (error) {
      status.textContent = error.message;
      submit.disabled = false;
      return;
    }
    const pickupLabel = `${getPickupLabel(pickupDate)} (midi)`;
    status.textContent = "Vérification des produits...";

    const { data: products, error: productsError } =
      await supabase
        .from("products")
        .select("id,name");

    if (productsError) {
      status.textContent = "Erreur produits : " + productsError.message;
      submit.disabled = false;
      return;
    }

    const productsByName = new Map(
      (products || []).map(product => [
        product.name.trim().toLowerCase(),
        product
      ])
    );

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

      items.push({
        product_id: product.id,
        quantity: 1,
        spice_level: item.spicy
          ? Math.max(0, Math.min(3, Number(item.spice) || 0))
          : 0,
        protein: item.protein || null
      });
    }

    status.textContent = "Enregistrement...";

    const { error } = await supabase.rpc(
      "create_pending_order",
      {
        p_first_name: customerName,
        p_last_name: "",
        p_email: email,
        p_phone: phone,
        p_service_slot_id: null,
        p_items: items,
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
  window.location.reload();
}, 2200);
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

  checkoutForm.hidden = false;

  requestAnimationFrame(() => {
    panel.scrollTo({
      top: panel.scrollHeight,
      behavior: "smooth"
    });

    checkoutForm.querySelector('[name="customer_name"]')?.focus();
  });
}

document.addEventListener("checkout:mount", () => {
  mountCheckout();
});

document.addEventListener("checkout:open", openCheckout);

mountCheckout();

