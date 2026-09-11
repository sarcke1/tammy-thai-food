// V2 — UI RENDERER + EVENT WIRING
// Product content, spice logic and cart state remain separate modules.
import { dishes } from './data.js';
import { renderSpiceControl, readSpiceControl, spiceLabel } from './spice.js';
import { addToCart, getCart, updateSpice, removeItem, clearCart, cartCount, cartTotal } from './cart.js';

const euro = n => n.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
const grid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.category-row button')];
const cartButton = document.querySelector('.cart-button');
const cartPanel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');
const cartCountEl = document.querySelector('#cart-count');

function photoStyle(d){
  if(!d.photo) return 'background:linear-gradient(135deg,#e8dfca,#d5dfd2)';
  if(d.photo.endsWith('.webp')) return `background-image:url('${d.photo}');background-size:400% 300%;background-position:${d.position||'center'}`;
  return `background-image:url('${d.photo}')`;
}

function renderMenu(category='Tous'){
  if(!grid) return;
  const visible = category === 'Tous' ? dishes : dishes.filter(d => d.category === category);
  grid.innerHTML = visible.map(d => `
    <article class="dish-card" data-dish-id="${d.id}" data-category="${d.category}">
      <div class="dish-photo" style="${photoStyle(d)}">
        ${d.spicy ? '<span class="dish-badge">🌶️ Piment au choix</span>' : ''}
      </div>
      <div class="dish-card-body">
        <div class="dish-title-row"><h3>${d.name}</h3><span class="price">${euro(d.price)}</span></div>
        <p>${d.desc}</p>
        ${d.spicy ? renderSpiceControl(d.id, 1) : ''}
        <button class="button dish-action" type="button" data-action="add" data-dish-id="${d.id}">Ajouter au panier</button>
      </div>
    </article>`).join('');
}

function renderCart(){
  if(!cartContent) return;
  const items = getCart();
  if(cartCountEl) cartCountEl.textContent = cartCount();
  if(!items.length){
    cartContent.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>'; return;
  }

  cartContent.innerHTML = items.map((item, index) => `
    <div class="cart-line cart-unit" data-cart-key="${item.key}">
      <div class="cart-unit-info">
        <strong>${item.name} <small class="unit-number">#${index + 1}</small></strong>
        ${item.spicy ? `<div class="cart-spice-control" data-cart-spice="${item.key}">
          <span>Piment :</span>
          <button type="button" data-spice-delta="-1" data-cart-key="${item.key}">−</button>
          <b>${spiceLabel(item.spice)}</b>
          <button type="button" data-spice-delta="1" data-cart-key="${item.key}">+</button>
        </div>` : ''}
        <span>${euro(item.price)}</span>
      </div>
      <button class="cart-remove" type="button" data-remove-key="${item.key}" aria-label="Retirer ${item.name}">×</button>
    </div>`).join('') + `
      <div class="cart-total"><strong>Total</strong><strong>${euro(cartTotal())}</strong></div>
      <button class="button cart-clear" data-clear-cart>Vider le panier</button>`;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  categoryButtons.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  renderMenu(button.textContent.trim());
}));

grid?.addEventListener('click', event => {
  const addButton = event.target.closest('[data-action="add"]');
  if(!addButton) return;
  const dish = dishes.find(d => d.id === addButton.dataset.dishId);
  const card = addButton.closest('.dish-card');
  const spiceControl = card?.querySelector('[data-spice-control]');
  addToCart(dish, spiceControl ? readSpiceControl(spiceControl) : 0);
  renderCart();
  cartPanel?.classList.add('open');
});

grid?.addEventListener('click', event => {
  const button = event.target.closest('.spice-minus, .spice-plus');
  if(!button) return;
  const control = button.closest('[data-spice-control]');
  let level = Number(control.dataset.level || 0) + (button.classList.contains('spice-plus') ? 1 : -1);
  level = Math.max(0, Math.min(3, level));
  control.dataset.level = level;
  control.querySelector('.spice-value').textContent = spiceLabel(level);
});

cartContent?.addEventListener('click', event => {
  const remove = event.target.closest('[data-remove-key]');
  if(remove){
    removeItem(remove.dataset.removeKey);
    renderCart();
    return;
  }

  const spiceButton = event.target.closest('[data-spice-delta]');
  if(spiceButton){
    const key = spiceButton.dataset.cartKey;
    const item = getCart().find(entry => entry.key === key);
    if(item){
      const level = Math.max(0, Math.min(3, item.spice + Number(spiceButton.dataset.spiceDelta)));
      updateSpice(key, level);
    }
    renderCart();
    return;
  }

  if(event.target.closest('[data-clear-cart]')) clearCart();
  renderCart();
});

cartButton?.addEventListener('click', () => { cartPanel?.classList.toggle('open'); renderCart(); });
document.querySelector('[data-cart-close]')?.addEventListener('click', () => cartPanel?.classList.remove('open'));
document.addEventListener('cart:updated', renderCart);

renderMenu();
renderCart();
