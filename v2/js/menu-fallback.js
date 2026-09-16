// V2 fallback renderer — menu only.
// The complete cart and checkout logic belongs to app.js and checkout.js.
import { dishes } from './data.js';
import { spiceLabel } from './spice.js';

const quantities = new Map();
const garnishes = new Map();
const spices = new Map();
const garnishNames = ['Porc','Poulet','Crevette'];

function quantityOf(id){ return quantities.get(id) || 0; }
function garnishOf(id,name){ return garnishes.get(id)?.[name] || 0; }
function setGarnish(id,name,value){ const current=garnishes.get(id)||{}; current[name]=Math.max(0,Math.min(20,value)); garnishes.set(id,current); }

function renderFallback(refresh=false){
  const grid=document.querySelector('#menu-grid');
  if(!grid)return;
  if(!refresh && grid.children.length)return;
  grid.dataset.fallbackRenderer='true';
  grid.innerHTML=dishes.map(dish=>{
    const isNems=dish.id==='nems';
    const quantity=quantityOf(dish.id);
    const total=isNems?garnishNames.reduce((s,n)=>s+garnishOf(dish.id,n),0):quantity;
    return `<article class="dish-card" data-dish-id="${dish.id}"><div class="dish-photo" style="background-image:url('${dish.photo}');background-position:${dish.position||'center'};background-size:${dish.photo.endsWith('.webp')?'400% 300%':'cover'}"></div><div class="dish-card-body"><div class="dish-title-row"><h3>${dish.name}</h3><span class="price">${Number(dish.price).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</span></div><p>${dish.desc||''}</p>${isNems?`<div class="garnish-box"><div class="garnish-box-title"><span>Choisissez votre garniture</span><span>Quantité</span></div>${garnishNames.map(name=>`<div class="garnish-row"><span>Nems ${name.toLowerCase()}</span><div class="garnish-controls"><button type="button" data-gminus="${name}">−</button><b>${garnishOf(dish.id,name)}</b><button type="button" data-gplus="${name}">+</button></div></div>`).join('')}</div>`:`<div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-minus>−</button><b>${quantity}</b><button type="button" data-plus>+</button></div></div>`}${dish.spicy&&quantity?`<div class="spice-box"><div class="spice-box-title">Piment</div><div class="spice-row"><span>${spiceLabel(spices.get(dish.id)||0)}</span><div class="spice-row-controls"><button type="button" data-spice-minus>−</button><b>${spiceLabel(spices.get(dish.id)||0)}</b><button type="button" data-spice-plus>+</button></div></div></div>`:''}<button class="button dish-action" type="button" data-add ${total?'':'disabled'}>Ajouter au panier</button></div></article>`;
  }).join('');
}

document.querySelector('#menu-grid')?.addEventListener('click',event=>{
  const card=event.target.closest('[data-dish-id]');
  if(!card)return;
  const id=card.dataset.dishId;
  const dish=dishes.find(d=>d.id===id);
  if(!dish)return;
  if(event.target.closest('[data-gminus]')){const n=event.target.closest('[data-gminus]').dataset.gminus;setGarnish(id,n,garnishOf(id,n)-1);return renderFallback(true);}
  if(event.target.closest('[data-gplus]')){const n=event.target.closest('[data-gplus]').dataset.gplus;setGarnish(id,n,garnishOf(id,n)+1);return renderFallback(true);}
  if(event.target.closest('[data-minus]')){quantities.set(id,Math.max(0,quantityOf(id)-1));return renderFallback(true);}
  if(event.target.closest('[data-plus]')){quantities.set(id,Math.min(20,quantityOf(id)+1));return renderFallback(true);}
  if(event.target.closest('[data-spice-minus]')){spices.set(id,Math.max(0,(spices.get(id)||0)-1));return renderFallback(true);}
  if(event.target.closest('[data-spice-plus]')){spices.set(id,Math.min(3,(spices.get(id)||0)+1));return renderFallback(true);}
});

setTimeout(()=>renderFallback(false),800);
