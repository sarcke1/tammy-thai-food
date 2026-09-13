import { supabase } from './supabase.js';
import { getCart, clearCart } from './cart.js';

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
  box.hidden = true;
  box.innerHTML = `
    <h3>Vos informations</h3>
    <p class="checkout-help">Confirmez vos coordonnées avant de poursuivre vers le paiement.</p>
    <input name="first_name" placeholder="Prénom" autocomplete="given-name" required>
    <input name="last_name" placeholder="Nom" autocomplete="family-name" required>
    <input name="email" type="email" placeholder="Email" autocomplete="email" required>
    <input name="phone" placeholder="Téléphone" autocomplete="tel" required>
    <button class="button" type="submit">Confirmer les informations</button>
    <p id="order-status"></p>`;

  panel.appendChild(box);
  checkoutForm = box;

  document.addEventListener('checkout:open', () => {
    if(!getCart().length) return;
    box.hidden = false;
    box.scrollIntoView({behavior:'smooth', block:'nearest'});
  });

  box.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = box.querySelector('#order-status');
    const submit = box.querySelector('button[type="submit"]');
    const formData = new FormData(box);
    const cartItems = getCart();

    if(!cartItems.length){
      status.textContent = 'Votre panier est vide.';
      updateCheckoutVisibility();
      return;
    }

    submit.disabled = true;
    status.textContent = 'Vérification des produits…';

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name');

    if(productsError){
      status.textContent = 'Erreur produits : ' + productsError.message;
      submit.disabled = false;
      return;
    }

    const productsByName = new Map((products || []).map(product => [product.name.trim().toLowerCase(), product]));
    const items = [];
    for(const item of cartItems){
      const product = productsByName.get(String(item.name || '').trim().toLowerCase());
      if(!product){
        status.textContent = `Produit introuvable : ${item.name || item.id}`;
        submit.disabled = false;
        return;
      }
      items.push({
        product_id: product.id,
        quantity: 1,
        spice_level: item.spicy ? Math.max(0, Math.min(3, Number(item.spice) || 0)) : 0
      });
    }

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

    if(error){
      status.textContent = 'Erreur : ' + error.message;
      submit.disabled = false;
      return;
    }

    const order = Array.isArray(result) ? result[0] : result;
    clearCart();
    box.hidden = true;
    status.textContent = '';
    const confirmation = document.createElement('div');
    confirmation.className = 'checkout-success';
    confirmation.innerHTML = `<strong>Commande n°${order.order_number} enregistrée.</strong><br>Paiement à venir.`;
    panel.appendChild(confirmation);
    updateCheckoutVisibility();
  });
}

mountCheckout();
updateCheckoutVisibility();
document.addEventListener('cart:updated', updateCheckoutVisibility);
