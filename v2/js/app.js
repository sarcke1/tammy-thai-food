// V2 — UI RENDERER + EVENT WIRING
import { dishes } from './data.js';
import { spiceLabel } from './spice.js';
import { addToCart, getCart, updateSpice, removeItem, clearCart, cartCount, cartTotal } from './cart.js';

const euro = n => n.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
const grid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.category-row button')];
const cartButton = document.querySelector('.cart-button');
const cartPanel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');
const cartCountEl = document.querySelector('#cart-count');
const cardStates = new Map();

function photoStyle(d){
  if(!d.photo) return 'background:linear-gradient(135deg,#e8dfca,#d5dfd2)';
  if(d.photo.endsWith('.webp')) return `background-image:url('${d.photo}');background-size:400% 300%;background-position:${d.position||'center'}`;
  return `background-image:url('${d.photo}')`;
}
function getState(dish){
  if(!cardStates.has(dish.id)) cardStates.set(dish.id, { quantity: 0, spices: [] });
  return cardStates.get(dish.id);
}
function setQuantity(dish, quantity){
  const state = getState(dish);
  state.quantity = Math.max(0, Math.min(20, quantity));
  while(state.spices.length < state.quantity) state.spices.push(0);
  state.spices.length = state.quantity;
}
function spiceRows(dish){
  if(!dish.spicy) return '';
  const state = getState(dish);
  if(state.quantity === 0) return '<div class="spice-box spice-box-empty">Sélectionnez une quantité pour choisir le piment.</div>';
  return `<div class="spice-box"><div class="spice-box-title">Choisissez le piment pour chaque plat</div>${state.spices.map((level,index)=>`
    <div class="spice-row" data-spice-row="${index}"><span>Plat ${index+1}</span><div class="spice-row-controls">
      <button type="button" data-spice-delta="-1" aria-label="Diminuer le piment">−</button><b>${spiceLabel(level)}</b><button type="button" data-spice-delta="1" aria-label="Augmenter le piment">+</button>
    </div></div>`).join('')}</div>`;
}
function quantityControl(dish){
  const state = getState(dish);
  return `<div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-quantity-delta="-1" aria-label="Diminuer la quantité">−</button><b>${state.quantity}</b><button type="button" data-quantity-delta="1" aria-label="Augmenter la quantité">+</button></div></div>`;
}
function renderMenu(category='Tous'){
  const visible = category === 'Tous' ? dishes : dishes.filter(d=>d.category===category);
  grid.innerHTML = visible.map(d=>{
    const state = getState(d);
    return `<article class="dish-card" data-dish-id="${d.id}" data-category="${d.category}">
    <div class="dish-photo" style="${photoStyle(d)}">${d.spicy?'<span class="dish-badge">🌶️ Piment au choix</span>':''}</div>
    <div class="dish-card-body"><div class="dish-title-row"><h3>${d.name}</h3><span class="price">${euro(d.price)}</span></div><p>${d.desc}</p>
    ${quantityControl(d)}${spiceRows(d)}<button class="button dish-action ${state.quantity===0?'is-disabled':''}" type="button" data-action="add" ${state.quantity===0?'disabled':''}>Ajouter au panier</button></div></article>`;
  }).join('');
}
function renderCart(){
  const items=getCart(); if(cartCountEl) cartCountEl.textContent=cartCount();
  if(!items.length){cartContent.innerHTML='<p class="empty-cart">Votre panier est vide.</p>';return;}
  cartContent.innerHTML=items.map((item,index)=>`<div class="cart-line cart-unit"><div class="cart-unit-info"><strong>${item.name} <small>#${index+1}</small></strong>${item.spicy?`<div class="cart-spice-control"><span>Piment :</span><button data-cart-key="${item.key}" data-spice-delta="-1">−</button><b>${spiceLabel(item.spice)}</b><button data-cart-key="${item.key}" data-spice-delta="1">+</button></div>`:'<small>Sans piment</small>'}<span>${euro(item.price)}</span></div><button class="cart-remove" data-remove-key="${item.key}">×</button></div>`).join('')+`<div class="cart-total"><strong>Total</strong><strong>${euro(cartTotal())}</strong></div><button class="button cart-clear" data-clear-cart>Vider le panier</button>`;
}
categoryButtons.forEach(button=>button.addEventListener('click',()=>{categoryButtons.forEach(b=>b.classList.remove('active'));button.classList.add('active');renderMenu(button.textContent.trim());}));
grid?.addEventListener('click',event=>{
  const card=event.target.closest('.dish-card'); if(!card)return;
  const dish=dishes.find(d=>d.id===card.dataset.dishId); const state=getState(dish);
  const q=event.target.closest('[data-quantity-delta]');
  if(q){setQuantity(dish,state.quantity+Number(q.dataset.quantityDelta));renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');return;}
  const s=event.target.closest('[data-spice-delta]');
  if(s){const row=s.closest('[data-spice-row]');const i=Number(row.dataset.spiceRow);state.spices[i]=Math.max(0,Math.min(3,state.spices[i]+Number(s.dataset.spiceDelta)));renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');return;}
  if(event.target.closest('[data-action="add"]')){state.spices.slice(0,state.quantity).forEach(level=>addToCart(dish,dish.spicy?level:0));renderCart();cartPanel?.classList.add('open');}
});
cartContent?.addEventListener('click',event=>{const remove=event.target.closest('[data-remove-key]');if(remove){removeItem(remove.dataset.removeKey);renderCart();return;}const s=event.target.closest('[data-spice-delta]');if(s){const item=getCart().find(x=>x.key===s.dataset.cartKey);if(item)updateSpice(item.key,item.spice+Number(s.dataset.spiceDelta));renderCart();return;}if(event.target.closest('[data-clear-cart]'))clearCart();renderCart();});
cartButton?.addEventListener('click',()=>{cartPanel?.classList.toggle('open');renderCart();});
document.querySelector('[data-cart-close]')?.addEventListener('click',()=>cartPanel?.classList.remove('open'));
document.addEventListener('cart:updated',renderCart);
renderMenu();renderCart();
