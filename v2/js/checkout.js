import { supabase } from './supabase.js';
import { getCart, clearCart } from './cart.js?v=20260923-07';

const panel = document.querySelector('#checkout-content');
let checkoutForm = null;

function updateCheckoutVisibility() {
  if (!panel) return;
  panel.hidden = getCart().length === 0;
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
  if (!panel || checkoutForm) return;

  const savedName = localStorage.getItem("customerName") || "";
  const savedEmail = localStorage.getItem("customerEmail") || "";

  const box = document.createElement("form");
  box.id = "order-form";
  box.hidden = true;

  box.innerHTML = `
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

    <textarea
      name="comment"
      placeholder="Commentaire (facultatif)"
      rows="3"
    ></textarea>

    <button class="button" type="submit">
      Enregistrer la commande
    </button>

    <p id="order-status"></p>
  `;

  panel.appendChild(box);
  checkoutForm = box;

  document.addEventListener("checkout:open", () => {
    if (!getCart().length) return;
    box.hidden = false;
    box.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

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

    const customerName = formData.get("customer_name");
    const email = formData.get("email");
    const comment = formData.get("comment");

    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerEmail", email);

    submit.disabled = true;
    status.textContent = "Vérification des produits...";

    const { data: products, error: productsError } =
      await supabase
        .from("products")
        .select("id,name");

    if (productsError) {
      status.textContent =
        "Erreur produits : " + productsError.message;
      submit.disabled = false;
      return;
    }

    const productsByName = new Map(
      (products || []).map(p => [
        p.name.trim().toLowerCase(),
        p
      ])
    );

    const items = [];

    for (const item of cartItems) {
      const product = productsByName.get(
        String(item.name).trim().toLowerCase()
      );

      if (!product) {
        status.textContent =
          "Produit introuvable : " + item.name;
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
    const { data: result, error } = await supabase.rpc(
      "create_pending_order",
      {
        p_first_name: customerName,
        p_last_name: "",
        p_email: email,
        p_phone: "",
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

    clearCart();
    box.hidden