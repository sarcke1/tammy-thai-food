// V2 fallback renderer — emergency menu renderer only.
// It activates only when app.js has failed, but keeps basic cart insertion usable.
import { dishes } from './data.js';
import { spiceLabel } from './spice.js';
import { addToCart, getCart, cartCount, cartTotal } from './cart.js';

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
  grid.innerHTML=dishes.map(dish=>{const isNems=dish.id==='nems';const quantity=quantityOf(dish.id);const total=isNems?garnishNames.reduce((s,n)=>s+garnishOf(dish.id,n),0):quantity;return `<article class="dish-card" data-dish-id="${dish.id}"><div class="dish-photo" style="background-image:url('${dish.photo}');background-position:${dish.position||'center'};background-size:${dish.photo.endsWith('.webp')?'400% 300%':'cover'}"></div><div class="dish-card-body"><div class="dish-title-row"><h3>${dish.name}</h3><span class="price">${euro(dish.price)}</span></div><p>${dish.desc||''}</p>${isNems?`<div class="garnish-box"><div class="garnish-box-title"><span>Choisissez votre garniture</span><span>Quantité</span></div>${garnishNames.map(name=>`<div class="garnish-row"><span>Nems ${name.toLowerCase()}</span><div class="garnish-controls"><button type="button" data-gminus="${name}">−</button><b>${garnishOf(dish.id,name)}</b><button type="button" data-gplus="${name}">+</button></div></div>`).join('')}</div>`:`<div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-minus>−</button><b>${quantity}</b><button type="button" data-plus>+</button></div></div>`}<button class="button dish-action" type="button" data-add ${total?'':'disabled'}>Ajouter au panier</button></div></article>`;}).join('');
}
function renderFallbackCart(){const content=document.querySelector('#cart-content');const count=document.querySelector('#cart-count');if(count)count.textContent=cartCount();if(content)content.innerHTML=getCart().length?`<div class="cart-total"><strong>Total</strong><strong>${euro(cartTotal())}</strong></div>`:'<p class="empty-cart">Votre panier est vide.</p>';}
document.querySelector('#menu-grid')?.addEventListener('click',event=>{if(!fallbackActive())return;const card=event.target.closest('[data-dish-id]');if(!card)return;const id=card.dataset.dishId;const dish=dishes.find(d=>d.id===id);if(!dish)return;const gm=event.target.closest('[data-gminus]');const gp=event.target.closest('[data-gplus]');if(gm||gp){const name=(gm||gp).dataset.gminus||(gm||gp).dataset.gplus;setGarnish(id,name,garnishOf(id,name)+(gp?1:-1));return renderFallback(true);}const minus=event.target.closest('[data-minus]');const plus=event.target.closest('[data-plus]');if(minus||plus){quantities.set(id,Math.max(0,Math.min(20,quantityOf(id)+(plus?1:-1))));return renderFallback(true);}const add=event.target.closest('[data-add]');if(add){if(dish.garnishOptions){garnishNames.forEach(name=>{for(let i=0;i<garnishOf(id,name);i++)addToCart(dish,0,`Nems ${name.toLowerCase()}`);});garnishes.delete(id);}else{for(let i=0;i<quantityOf(id);i++)addToCart(dish,dish.spicy?(spices.get(id)||0):0);}quantities.set(id,0);renderFallback(true);renderFallbackCart();document.querySelector('#cart-panel')?.classList.add('open');}});
document.querySelector('.cart-button')?.addEventListener('click',()=>{renderFallbackCart();document.querySelector('#cart-panel')?.classList.toggle('open');});
document.querySelector('[data-cart-close]')?.addEventListener('click',()=>document.querySelector('#cart-panel')?.classList.remove('open'));
setTimeout(()=>renderFallback(false),800);
