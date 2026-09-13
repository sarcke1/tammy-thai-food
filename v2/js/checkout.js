import { supabase } from './supabase.js';
import { getCart } from './cart.js';

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
    const formData = new FormData(box);
    const cartItems = getCart();

    if(!cartItems.length){
      status.textContent = 'Votre panier est vide.';
      updateCheckoutVisibility();
      return;
    }

    status.textContent = 'Vérification des produits…';

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name,is_active')
      .eq('is_active', true);

    if(productsError){
      status.textContent = 'Erreur produits : ' + productsError.message;
      return;
    }

    const productsByName = new Map(
      (products || []).map(product => [product.name.trim().toLowerCase(), product])
    );

    const items = [];
    for(const item of cartItems){
      const product = productsByName.get(String(item.name || '').trim().toLowerCase());
      if(!product){
        status.textContent = `Produit introuvable : ${item.name || item.id}`;
        return;
      }

      items.push({
        product_id: product.id,
        quantity: 1,
        spice_level: item.spicy
          ? Math.max(0, Math.min(3, Number(item.spice) || 0))
          : 0
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
      return;
    }

    const order = Array.isArray(result) ? result[0] : result;
    status.textContent = `Commande n°${order.order_number} enregistrée. Paiement à venir.`;
  });
}

mountCheckout();
updateCheckoutVisibility();
document.addEventListener('cart:updated', updateCheckoutVisibility);
