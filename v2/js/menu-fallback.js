// V2 fallback renderer — emergency renderer only.
// It activates only when app.js has failed, while preserving the complete cart workflow.
import { dishes } from './data.js';
import { spiceLabel } from './spice.js';
import { addToCart, getCart, updateSpice, removeItem, clearCart, cartCount, cartTotal } from './cart.js';

const quantities = new Map();
const garnishes = new Map();
const spices = new Map();
const garnishNames = ['Porc','Poulet','Crevette'];
const euro = n => Number(n).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
function fallbackActive(){ return !window.__tammyAppReady; }
function quantityOf(id){ return quantities.get(id) || 0; }
function garnishOf(id,name){ return garnishes.get(id)?.[name] || 0; }
function setGarnish(id,name,value){ const current=garnishes.get(id)||{}; current[name]=Math.max(0,Math.min(20,value)); garnishes.set(id,current); }
function renderFallback(refresh=false){
  if(!fallbackActive())return;
  const grid=document.querySelector('#menu-grid'); if(!grid)return;
  if(!refresh && grid.children.length)return;
  grid.innerHTML=dishes.map(dish=>{const isNems=dish.id==='nems';const quantity=quantityOf(dish.id);const total=isNems?garnishNames.reduce((s,n)=>s+garnishOf(dish.id,n),0):quantity;return `<article class="dish-card" data-dish-id="${dish.id}"><div class="dish-photo" style="background-image:url('${dish.photo}');background-position:${dish.position||'center'};background-size:${dish.photo.endsWith('.webp')?'400% 300%':'cover'}"></div><div class="dish-card-body"><div class="dish-title-row"><h3>${dish.name}</h3><span class="price">${euro(dish.price)}</span></div><p>${dish.desc||''}</p>${isNems?`<div class="garnish-box"><div class="garnish-box-title"><span>Choisissez votre garniture</span><span>Quantité</span></div>${garnishNames.map(name=>`<div class="garnish-row"><span>Nems ${name.toLowerCase()}</span><div class="garnish-controls"><button type="button" data-gminus="${name}">−</button><b>${garnishOf(dish.id,name)}</b><button type="button" data-gplus="${name}">+</button></div></div>`).join('')}</div>`:`<div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-minus>−</button><b>${quantity}</b><button type="button" data-plus>+</button></div>`}<button class="button dish-action" type="button" data-add ${total?'':'disabled'}>Ajouter au panier</button></div></article>`;}).join('');
}
function renderFallbackCart(){
  const content=document.querySelector('#cart-content');
  const count=document.querySelector('#cart-count');
  if(count)count.textContent=cartCount();
  if(!content)return;
  const items=getCart();
  if(!items.length){content.innerHTML='<p class="empty-cart">Votre panier est vide.</p>';return;}
  content.innerHTML=items.map((item,index)=>`<div class="cart-line cart-unit"><div class="cart-unit-info"><strong>${item.name} <small>#${index+1}</small></strong>${item.spicy?`<div class="cart-spice-control"><span>Piment :</span><button data-cart-key="${item.key}" data-spice-delta="-1">−</button><b>${spiceLabel(item.spice)}</b><button data-cart-key="${item.key}" data-spice-delta="1">+</button></div>`:'<small>Sans piment</small>'}<span>${euro(item.price)}</span></div><button class="cart-remove" data-remove-key="${item.key}">×</button></div>`).join('')+`<div class="cart-total"><strong>Total</strong><strong>${euro(cartTotal())}</strong></div><div class="cart-actions"><button class="button cart-validate" data-validate-cart>Valider le panier</button><button class="button cart-clear secondary-cart-action" data-clear-cart>Vider le panier</button></div>`;
}
document.querySelector('#menu-grid')?.addEventListener('click',event=>{if(!fallbackActive())return;const card=event.target.closest('[data-dish-id]');if(!card)return;const id=card.dataset.dishId;const dish=dishes.find(d=>d.id===id);if(!dish)return;const gm=event.target.closest('[data-gminus]');const gp=event.target.closest('[data-gplus]');if(gm||gp){const name=(gm||gp).dataset.gminus||(gm||gp).dataset.gplus;setGarnish(id,name,garnishOf(id,name)+(gp?1:-1));return renderFallback(true);}const minus=event.target.closest('[data-minus]');const plus=event.target.closest('[data-plus]');if(minus||plus){quantities.set(id,Math.max(0,Math.min(20,quantityOf(id)+(plus?1:-1))));return renderFallback(true);}const add=event.target.closest('[data-add]');if(add){if(dish.garnishOptions){garnishNames.forEach(name=>{for(let i=0;i<garnishOf(id,name);i++)addToCart(dish,0,`Nems ${name.toLowerCase()}`);});garnishes.delete(id);}else{for(let i=0;i<quantityOf(id);i++)addToCart(dish,dish.spicy?(spices.get(id)||0));}quantities.set(id,0);renderFallback(true);renderFallbackCart();document.querySelector('#cart-panel')?.classList.add('open');}});
document.querySelector('#cart-content')?.addEventListener('click',event=>{if(!fallbackActive())return;const remove=event.target.closest('[data-remove-key]');if(remove){removeItem(remove.dataset.removeKey);renderFallbackCart();return;}const spice=event.target.closest('[data-spice-delta]');if(spice){const item=getCart().find(entry=>entry.key===spice.dataset.cartKey);if(item)updateSpice(item.key,item.spice+Number(spice.dataset.spiceDelta));renderFallbackCart();return;}const clear=event.target.closest('[data-clear-cart]');if(clear){if(confirm('Voulez-vous vraiment vider complètement le panier ?')){clearCart();renderFallbackCart();}return;}const validate=event.target.closest('[data-validate-cart]');if(validate){document.dispatchEvent(new CustomEvent('checkout:open'));return;}});
document.querySelector('.cart-button')?.addEventListener('click',()=>{if(!fallbackActive())return;renderFallbackCart();document.querySelector('#cart-panel')?.classList.toggle('open');});
document.querySelector('[data-cart-close]')?.addEventListener('click',()=>document.querySelector('#cart-panel')?.classList.remove('open'));
document.addEventListener('cart:updated',()=>{if(fallbackActive())renderFallbackCart();});
setTimeout(()=>renderFallback(false),800);
