import { supabase } from './supabase.js';
import { getCart, clearCart } from './cart.js?v=20260923-07';

const panel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');

let checkoutForm = null;

function updateCheckoutVisibility() {
  if (!checkoutForm) return;

  if (!getCart().length) {
    checkoutForm.hidden = true;
  }
}

function getPickupDate() {
  const now = new Date();
  const pickup = new Date(now);

  if (now.getHours() >= 18) {
    pickup.setDate(pickup.getDate() + 2);
  } else {
    pickup.setDate(pickup.getDate() + 1);
  }

  return pickup;
}

function getPickupLabel() {
  return getPickupDate().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
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
        Retrait : <strong>${getPickupLabel()} (midi)</strong>
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
        placeholder="Téléphone"
        value="${localStorage.getItem('customerPhone') || ''}"
        inputmode="tel"
        autocomplete="tel"
      >
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

  document.addEventListener("checkout:open", () => {
    if (!getCart().length) return;

    box.hidden = false;

    box.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

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
    const phone = String(formData.get("phone") || "").trim();
    const comment = String(formData.get("comment") || "").trim();
    
    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", phone);

    submit.disabled = true;
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
        p_customer_note: comment
      }
    );

    if (error) {
      status.textContent = "Erreur : " + error.message;
      submit.disabled = false;
      return;
    }

    status.textContent = "Commande enregistrée.";

    clearCart();

    box.reset();

    box.querySelector('[name="customer_name"]').value = customerName;
    box.querySelector('[name="email"]').value = email;

    submit.disabled = false;
    box.hidden = true;

    panel.classList.remove("open");
  });

  updateCheckoutVisibility();
}

mountCheckout();
