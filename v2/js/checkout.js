import { supabase } from './supabase.js';
import { getCart } from './cart.js';

const panel = document.querySelector('#cart-content');

function euro(n){return Number(n).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});}
function injectCheckout(){
  if(!panel || !getCart().length || panel.querySelector('#order-form')) return;
  const box=document.createElement('form');
  box.id='order-form';
  box.innerHTML=`<h3>Finaliser la commande</h3><input name="first_name" placeholder="Prénom" required><input name="last_name" placeholder="Nom" required><input name="email" type="email" placeholder="Email" required><input name="phone" placeholder="Téléphone" required><button class="button" type="submit">Enregistrer la commande</button><p id="order-status"></p>`;
  panel.appendChild(box);
  box.addEventListener('submit',async e=>{
    e.preventDefault();
    const status=box.querySelector('#order-status'); const data=new FormData(box);
    const items=getCart().map(item=>({product_id:item.id,quantity:1,spice_level:item.spicy?item.spice:0}));
    status.textContent='Enregistrement en cours…';
    const {data:result,error}=await supabase.rpc('create_pending_order',{p_first_name:data.get('first_name'),p_last_name:data.get('last_name'),p_email:data.get('email'),p_phone:data.get('phone'),p_service_slot_id:null,p_items:items,p_customer_note:null});
    if(error){status.textContent='Erreur : '+error.message;return;}
    const order=Array.isArray(result)?result[0]:result;
    status.textContent=`Commande n°${order.order_number} enregistrée. Paiement à venir.`;
  });
}
new MutationObserver(injectCheckout).observe(panel,{childList:true,subtree:true});
injectCheckout();