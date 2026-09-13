import { supabase } from '../js/supabase.js';

const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');
const logoutButton = document.querySelector('#logout');
const ordersEl = document.querySelector('#orders');
const refreshInfo = document.querySelector('#refresh-info');

function showDashboard(){loginPanel.classList.add('hidden');dashboard.classList.remove('hidden');logoutButton.classList.remove('hidden');loadOrders();}
function showLogin(){loginPanel.classList.remove('hidden');dashboard.classList.add('hidden');logoutButton.classList.add('hidden');}
function escapeHtml(value){return String(value ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function statusLabel(status){return ({pending_payment:'En attente de paiement',paid:'Payée',queued:'En file cuisine',preparing:'En préparation',ready:'Prête',completed:'Retirée',cancelled:'Annulée'})[status]||status;}
function nextAction(status){return ({pending_payment:['paid','Marquer comme payée'],paid:['queued','Mettre en file cuisine'],queued:['preparing','Démarrer la préparation'],preparing:['ready','Marquer prête'],ready:['completed','Marquer retirée']})[status]||null;}

async function changeOrderStatus(orderId,status){
  const updates={status};
  if(status==='paid') updates.payment_status='paid';
  const {error}=await supabase.from('orders').update(updates).eq('id',orderId);
  if(error){alert('Erreur de mise à jour : '+error.message);return;}
  await loadOrders();
}

async function loadOrders(){
  refreshInfo.textContent='Chargement…';
  const {data:orders,error}=await supabase.from('orders').select('id,order_number,status,total,payment_status,customer_first_name,customer_last_name,customer_email,customer_phone,estimated_preparation_minutes,created_at,order_items(product_name,quantity,unit_price,spice_level)').order('created_at',{ascending:false});
  if(error){ordersEl.innerHTML=`<div class="empty">Erreur : ${escapeHtml(error.message)}</div>`;refreshInfo.textContent='Erreur';return;}
  refreshInfo.textContent=`${orders.length} commande(s) — dernière actualisation ${new Date().toLocaleTimeString('fr-FR')}`;
  if(!orders.length){ordersEl.innerHTML='<div class="empty">Aucune commande.</div>';return;}
  ordersEl.innerHTML=orders.map(order=>{
    const action=nextAction(order.status);
    const actionHtml=action?`<button class="order-action primary" data-order-id="${order.id}" data-next-status="${action[0]}">${action[1]}</button>`:'';
    return `<article class="order-card"><div class="order-top"><div><div class="order-number">Commande n°${order.order_number}</div><div class="order-meta">${escapeHtml(order.customer_first_name)} ${escapeHtml(order.customer_last_name)}<br>${escapeHtml(order.customer_phone||'')} · ${escapeHtml(order.customer_email||'')}<br>${new Date(order.created_at).toLocaleString('fr-FR')}</div></div><span class="badge">${escapeHtml(statusLabel(order.status))}</span></div><ul class="items">${(order.order_items||[]).map(item=>`<li><div><div class="item-name">${escapeHtml(item.product_name)} × ${item.quantity}</div><div class="item-detail">Piment : ${item.spice_level===0?'Sans piment':'Niveau '+item.spice_level}</div></div><span>${Number(item.unit_price).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</span></li>`).join('')}</ul><div class="order-bottom"><span>Temps estimé : ${order.estimated_preparation_minutes||0} min</span><strong>${Number(order.total).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</strong></div>${actionHtml}</article>`;
  }).join('');

  ordersEl.querySelectorAll('.order-action').forEach(button=>{
    button.addEventListener('click',async()=>{
      button.disabled=true;
      button.textContent='Mise à jour…';
      await changeOrderStatus(button.dataset.orderId,button.dataset.nextStatus);
    });
  });
}

loginForm.addEventListener('submit',async event=>{event.preventDefault();loginStatus.textContent='Connexion…';const {error}=await supabase.auth.signInWithPassword({email:document.querySelector('#email').value,password:document.querySelector('#password').value});if(error){loginStatus.textContent='Erreur : '+error.message;return}loginStatus.textContent='';showDashboard();});
logoutButton.addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();});
document.querySelector('#refresh').addEventListener('click',loadOrders);
const {data:{session}}=await supabase.auth.getSession();if(session)showDashboard();else showLogin();
