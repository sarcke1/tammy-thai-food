// Emergency fallback renderer with working quantity controls.
import { dishes } from './data.js';
import { addToCart, getCart } from './cart.js';
import { spiceLabel } from './spice.js';

const euro = n => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
const quantities = new Map();
const spices = new Map();

function quantityOf(id) { return quantities.get(id) || 0; }
function setQuantity(id, value) {
  quantities.set(id, Math.max(0, Math.min(20, value)));
  renderFallback(true);
}

function renderFallback(refresh = false) {
  const grid = document.querySelector('#menu-grid');
  if (!grid) return;
  if (!refresh && grid.children.length) return;
  grid.dataset.fallbackRenderer = 'true';

  grid.innerHTML = dishes.map(dish => {
    const quantity = quantityOf(dish.id);
    const spice = spices.get(dish.id) || 0;
    return `
      <article class="dish-card" data-dish-id="${dish.id}" data-category="${dish.category}">
        <div class="dish-photo" style="background-image:url('${dish.photo}');background-position:${dish.position || 'center'};background-size:${dish.photo.endsWith('.webp') ? '400% 300%' : 'cover'}"></div>
        <div class="dish-card-body">
          <div class="dish-title-row"><h3>${dish.name}</h3><span class="price">${euro(dish.price)}</span></div>
          <p>${dish.desc || ''}</p>
          <div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-minus="${dish.id}">−</button><b>${quantity}</b><button type="button" data-plus="${dish.id}">+</button></div></div>
          ${dish.spicy && quantity ? `<div class="spice-box"><div class="spice-box-title">Piment</div><div class="spice-row"><span>${spiceLabel(spice)}</span><div class="spice-row-controls"><button type="button" data-spice-minus="${dish.id}">−</button><b>${spiceLabel(spice)}</b><button type="button" data-spice-plus="${dish.id}">+</button></div></div></div>` : ''}
          <button class="button dish-action" type="button" data-add="${dish.id}" ${quantity ? '' : 'disabled'}>Ajouter au panier</button>
        </div>
      </article>`;
  }).join('');
}

document.querySelector('#menu-grid')?.addEventListener('click', event => {
  const id = event.target.closest('[data-dish-id]')?.dataset.dishId;
  if (!id) return;
  if (event.target.closest('[data-minus]')) return setQuantity(id, quantityOf(id) - 1);
  if (event.target.closest('[data-plus]')) return setQuantity(id, quantityOf(id) + 1);
  if (event.target.closest('[data-spice-minus]')) { spices.set(id, Math.max(0, (spices.get(id) || 0) - 1)); return renderFallback(true); }
  if (event.target.closest('[data-spice-plus]')) { spices.set(id, Math.min(3, (spices.get(id) || 0) + 1)); return renderFallback(true); }
  if (event.target.closest('[data-add]')) {
    const dish = dishes.find(item => item.id === id);
    const quantity = quantityOf(id);
    for (let i = 0; i < quantity; i++) addToCart(dish, dish.spicy ? (spices.get(id) || 0) : 0);
    quantities.set(id, 0);
    renderFallback(true);
    const count = document.querySelector('#cart-count');
    if (count) count.textContent = getCart().length;
  }
});

setTimeout(() => renderFallback(false), 800);
