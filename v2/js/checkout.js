import { supabase } from './supabase.js';
import { getCart } from './cart.js';

const checkoutPanel = document.querySelector('#checkout-content');
let checkoutForm = null;

function renderCheckout(){
  if(!checkoutPanel) return;
  const cart = getCart();
  if(!cart.length){
    checkoutPanel.innerHTML = '';
    checkoutForm = null;
    return;
  }
  if(checkoutForm && checkoutPanel.contains(checkoutForm)) return;

  const box = document.createElement('form');
  box.id = 'order-form';
  box.innerHTML = `<h3>Finaliser la commande</h3>
    <input name="first_name" placeholder="Prénom" autocomplete="given-name" required>
    <input name="last_name" placeholder="Nom" autocomplete="family-name" required>
    <input name="email" type="email" placeholder="Email" autocomplete="email" required>
    <input name="phone" placeholder="Téléphone" autocomplete="tel" required>
    <button class="button" type="submit">Enregistrer la commande</button>
    <p id="order-status"></p>`;
  checkoutPanel.appendChild(box);
  checkoutForm = box;

  box.addEventListener('submit', async event => {
    event.preventDefault();
    const status = box.querySelector('#order-status');
    const formData = new FormData(box);
    const items = getCart().map(item => ({
      product_id: item.id,
      quantity: item.quantity || 1,
      spice_level: item.spicy ? (item.spice || 0) : 0
    }));
    status.textContent = 'Enregistrement en cours…';
    const { data: result, error } = await supabase.rpc('create_pending_order', {
      p_first_name: formData.get('first_name'),
      p_last_name: formData.get('last_name'),
      p_email: formData.get('email'),
      p_phone: formData.get('phone'),
      p_service_slot_id: null,
      p_items: items,
      p_customer_note: null
    });
    if(error){ status.textContent = 'Erreur : ' + error.message; return; }
    const order = Array.isArray(result) ? result[0] : result;
    status.textContent = `Commande n°${order.order_number} enregistrée. Paiement à venir.`;
  });
}

document.addEventListener('cart:updated', renderCheckout);
renderCheckout();
