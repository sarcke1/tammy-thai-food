import { supabase } from './supabase.js';
import { getCart } from './cart.js';

// Checkout is deliberately outside #cart-content because renderCart() replaces
// that element's HTML whenever the cart changes.
const panel = document.querySelector('#checkout-content');
let checkoutForm = null;

function updateCheckoutVisibility(){
  if(!panel) return;
  panel.hidden = getCart().length === 0;
}

function mountCheckout(){
  if(!panel || checkoutForm) return;

  const box = document.createElement('form');
  box.id = 'order-form';
  box.innerHTML = `
    <h3>Finaliser la commande</h3>
    <input name="first_name" placeholder="Prénom" autocomplete="given-name" required>
    <input name="last_name" placeholder="Nom" autocomplete="family-name" required>
    <input name="email" type="email" placeholder="Email" autocomplete="email" required>
    <input name="phone" placeholder="Téléphone" autocomplete="tel" required>
    <button class="button" type="submit">Enregistrer la commande</button>
    <p id="order-status"></p>`;

  panel.appendChild(box);
  checkoutForm = box;

  box.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = box.querySelector('#order-status');
    const data = new FormData(box);
    const items = getCart().map(item => ({
      product_id: item.id,
      quantity: 1,
      spice_level: item.spicy ? Number(item.spice || 0) : 0
    }));

    if(!items.length){
      status.textContent = 'Votre panier est vide.';
      updateCheckoutVisibility();
      return;
    }

    status.textContent = 'Enregistrement en cours…';

    const { data: result, error } = await supabase.rpc('create_pending_order', {
      p_first_name: data.get('first_name'),
      p_last_name: data.get('last_name'),
      p_email: data.get('email'),
      p_phone: data.get('phone'),
      p_service_slot_id: null,
      p_items: items,
      p_customer_note: null
    });

    if(error){
      status.textContent = 'Erreur : ' + error.message;
      return;
    }

    const order = Array.isArray(result) ? result[0] : result;
    status.textContent = `Commande n°${order.order_number} enregistrée. Paiement à venir.`;
  });
}

mountCheckout();
updateCheckoutVisibility();
document.addEventListener('cart:updated', updateCheckoutVisibility);
