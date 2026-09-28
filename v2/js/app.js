// V2 — UI RENDERER + EVENT WIRING
import { dishes as localDishes } from './data.js?v=20260923-14';
import { spiceLabel } from './spice.js';
import { supabase } from './supabase.js';
import { addToCart, getCart, updateSpice, removeItem, clearCart, cartCount, cartTotal } from './cart.js?v=20260923-08';

let dishes = [...localDishes];
const euro = n => n.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
const grid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.category-row button')];
const cartButton = document.querySelector('.cart-button');
const cartPanel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');
const cartCountEl = document.querySelector('#cart-count');
const cardStates = new Map();
const categoryOrder = { Plats:1, Entrées:2, Desserts:3, Boissons:4 };

async function loadProductsFromSupabase(){
  const { data, error } = await supabase.from('products').select('id,name,price,description,image_url,preparation_minutes,supports_spice,protein_options,product_categories(name)').eq('active',true);
  if(error){ console.error('Supabase products error — fallback local:', error.message); return; }
  if(!data?.length){ console.warn('Supabase products empty — fallback local'); return; }
  dishes = data.map(product => {
    const local = localDishes.find(d => d.name === product.name);
    return { id:product.id, name:product.name, price:Number(product.price), category:product.product_categories?.name||local?.category||'Plats', emoji:local?.emoji||'🍽️', photo:local?.photo||'', position:local?.position, desc:product.description||local?.desc||'', spicy:Boolean(product.supports_spice), proteinOptions:product.protein_options||local?.proteinOptions||[], preparation_minutes:product.preparation_minutes??local?.preparation_minutes??null, menuPosition:local?localDishes.indexOf(local):999 };
  }).sort((a,b)=>(categoryOrder[a.category]||99)-(categoryOrder[b.category]||99)||a.menuPosition-b.menuPosition);
  renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');
}
function photoStyle(d){ if(!d.photo)return 'background:linear-gradient(135deg,#e8dfca,#d5dfd2)'; if(d.photo.endsWith('.webp'))return "background-image:url('"+d.photo+"');background-size:400% 300%;background-position:"+(d.position||'center'); return "background-image:url('"+d.photo+"')"; }
function getState(dish){ if(!cardStates.has(dish.id))cardStates.set(dish.id,{quantity:0,spices:[],protein:'',proteinQuantities:{},chiliPacketQty:0}); return cardStates.get(dish.id); }
function syncSpices(state){ while(state.spices.length<state.quantity)state.spices.push(0); state.spices.length=state.quantity; }
function setQuantity(dish,quantity){ const state=getState(dish); state.quantity=Math.max(0,Math.min(20,quantity)); syncSpices(state); }
function setProteinQuantity(dish,protein,quantity){ const state=getState(dish); const next=Math.max(0,Math.min(20,Number(quantity)||0)); state.proteinQuantities[protein]=next; state.quantity=Object.values(state.proteinQuantities).reduce((sum,value)=>sum+Number(value||0),0); if(state.quantity>20){ const overflow=state.quantity-20; state.proteinQuantities[protein]=Math.max(0,next-overflow); state.quantity=Object.values(state.proteinQuantities).reduce((sum,value)=>sum+Number(value||0),0); } syncSpices(state); }
function proteinSelector(dish){ if(!dish.proteinOptions?.length)return ''; const state=getState(dish); return '<div class="spice-box protein-box"><div class="spice-box-title">Choix de la viande</div>'+dish.proteinOptions.map(option=>{const quantity=Number(state.proteinQuantities?.[option]||0);return '<div class="spice-row protein-row" data-protein-row="'+option+'"><span>'+option+'</span><div class="spice-row-controls"><button type="button" data-protein-delta="-1" aria-label="Diminuer la quantité de '+option+'">−</button><b>'+quantity+'</b><button type="button" data-protein-delta="1" aria-label="Augmenter la quantité de '+option+'">+</button></div></div>';}).join('')+'</div>'; }
function spiceRows(dish){ if(!dish.spicy)return ''; const state=getState(dish); if(state.quantity===0)return '<div class="spice-box spice-box-empty">Sélectionnez une quantité pour choisir le piment.</div>'; return '<div class="spice-box"><div class="spice-box-title">Choisissez le piment pour chaque plat</div>'+state.spices.map((level,index)=>'<div class="spice-row" data-spice-row="'+index+'"><span>Plat '+(index+1)+'</span><div class="spice-row-controls"><button type="button" data-spice-delta="-1" aria-label="Diminuer le piment">−</button><b>'+spiceLabel(level)+'</b><button type="button" data-spice-delta="1" aria-label="Augmenter le piment">+</button></div></div>').join('')+'</div>'; }
function quantityControl(dish){ const state=getState(dish); return '<div class="quantity-row"><span>Quantité</span><div class="quantity-controls"><button type="button" data-quantity-delta="-1" aria-label="Diminuer la quantité">−</button><b>'+state.quantity+'</b><button type="button" data-quantity-delta="1" aria-label="Augmenter la quantité">+</button></div></div>'; }
function renderMenu(category='Tous'){ const visible=category==='Tous'?dishes:dishes.filter(d=>d.category===category); grid.innerHTML=visible.map(d=>{const state=getState(d);return '<article class="dish-card" data-dish-id="'+d.id+'" data-category="'+d.category+'"><div class="dish-photo" style="'+photoStyle(d)+'">'+(d.spicy?'<span class="dish-badge">🌶️ Piment au choix</span>':'')+'</div><div class="dish-card-body"><div class="dish-title-row"><h3>'+d.name+'</h3><span class="price">'+euro(d.price)+'</span></div><p>'+d.desc+'</p>'+proteinSelector(d)+(d.proteinOptions?.length?'':quantityControl(d))+spiceRows(d)+'<button class="button dish-action '+(state.quantity===0?'is-disabled':'')+'" type="button" data-action="add" '+(state.quantity===0?'disabled':'')+'>Ajouter au panier</button></div></article>';}).join(''); }

function renderCart(){
  const items=getCart();
  if(cartCountEl)cartCountEl.textContent=cartCount();
  if(!items.length){cartContent.innerHTML='<p class="empty-cart">Votre panier est vide.</p>';return;}
  cartContent.innerHTML=items.map((item,index)=>'<div class="cart-line cart-unit"><div class="cart-unit-info"><strong>'+item.name+' <small>#'+(index+1)+'</small></strong>'+(item.protein?'<small>Viande : '+item.protein+'</small>':'')+(item.spicy?'<div class="cart-spice-control"><span>Piment :</span><button data-cart-key="'+item.key+'" data-spice-delta="-1">−</button><b>'+spiceLabel(item.spice)+'</b><button data-cart-key="'+item.key+'" data-spice-delta="1">+</button></div>':'<small>Sans piment</small>')+'<span>'+euro(item.price)+'</span></div><button class="cart-remove" data-remove-key="'+item.key+'">×</button></div>').join('')+'<div class="cart-total"><strong>Total</strong><strong>'+euro(cartTotal())+'</strong></div><div class="cart-actions"><button class="button cart-validate" data-validate-cart>Valider le panier</button><button class="cart-clear secondary-cart-action" data-clear-cart>Vider le panier</button></div>';
}

categoryButtons.forEach(button=>button.addEventListener('click',()=>{categoryButtons.forEach(b=>b.classList.remove('active'));button.classList.add('active');renderMenu(button.textContent.trim());}));

grid?.addEventListener('click',event=>{
  const card=event.target.closest('.dish-card');if(!card)return;
  const dish=dishes.find(d=>d.id===card.dataset.dishId);if(!dish)return;
  const state=getState(dish);
  const pq=event.target.closest('[data-protein-delta]');
  if(pq){const row=pq.closest('[data-protein-row]');setProteinQuantity(dish,row.dataset.proteinRow,Number(pq.dataset.proteinDelta)+(Number(state.proteinQuantities?.[row.dataset.proteinRow]||0)));renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');return;}
  const q=event.target.closest('[data-quantity-delta]');
  if(q){setQuantity(dish,state.quantity+Number(q.dataset.quantityDelta));renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');return;}
  const s=event.target.closest('[data-spice-delta]');
  if(s){const row=s.closest('[data-spice-row]');const i=Number(row.dataset.spiceRow);state.spices[i]=Math.max(0,Math.min(3,state.spices[i]+Number(s.dataset.spiceDelta)));renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');return;}
  if(event.target.closest('[data-action="add"]')){
    let spiceIndex=0;
    if(dish.proteinOptions?.length){
      dish.proteinOptions.forEach(protein=>{
        const quantity=Number(state.proteinQuantities?.[protein]||0);
        for(let i=0;i<quantity;i++){addToCart(dish,state.spices[spiceIndex]||0,protein);spiceIndex++;}
      });
    }else{
      for(let i=0;i<state.quantity;i++){addToCart(dish,state.spices[i]||0,state.protein);}
    }
    renderCart();cartPanel?.classList.add('open');
  }
});
cartContent?.addEventListener('click',event=>{const remove=event.target.closest('[data-remove-key]');if(remove){removeItem(remove.dataset.removeKey);renderCart();return;}const s=event.target.closest('[data-spice-delta]');if(s){const item=getCart().find(x=>x.key===s.dataset.cartKey);if(item)updateSpice(item.key,item.spice+Number(s.dataset.spiceDelta));renderCart();return;}const clear=event.target.closest('[data-clear-cart]');if(clear){if(confirm('Voulez-vous vraiment vider complètement le panier ?'))clearCart();return;}const validate=event.target.closest('[data-validate-cart]');if(validate)document.dispatchEvent(new CustomEvent('checkout:open'));});
cartButton?.addEventListener('click',()=>{cartPanel?.classList.toggle('open');renderCart();});
document.querySelector('[data-cart-close]')?.addEventListener('click',()=>cartPanel?.classList.remove('open'));
document.addEventListener('cart:updated',()=>{renderCart();if(!getCart().length){cardStates.clear();renderMenu(document.querySelector('.category-row .active')?.textContent.trim()||'Tous');}});
renderMenu();renderCart();loadProductsFromSupabase();
