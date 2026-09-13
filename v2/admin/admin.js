import { supabase } from '../js/supabase.js';

const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');
const logoutButton = document.querySelector('#logout');
const ordersEl = document.querySelector('#orders');
const refreshInfo = document.querySelector('#refresh-info');
const viewTabs = document.querySelectorAll('.view-tab');
let currentView = 'active';
let allOrders = [];

function showDashboard(){loginPanel.classList.add('hidden');dashboard.classList.remove('hidden');logoutButton.classList.remove('hidden');loadOrders();}
function showLogin(){loginPanel.classList.remove('hidden');dashboard.classList.add('hidden');logoutButton.classList.add('hidden');}
function escapeHtml(value){return String(value ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function statusLabel(status){return ({pending_payment:'En attente de paiement',paid:'Payée',confirmed:'En file cuisine',preparing:'En préparation',ready:'Prête',completed:'Archivée',cancelled:'Annulée'})[status]||status;}
function nextAction(status){return ({pending_payment:['paid','Marquer comme payée'],paid:['enqueue','Mettre en file cuisine'],confirmed:['preparing','Démarrer la préparation'],preparing:['ready','Plat prêt ✓'],ready:['completed','Retirer / archiver']})[status]||null;}
function formatMoney(value){return Number(value||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});}

async function enqueueOrder(orderId){
  const {data:existing,error:existingError}=await supabase.from('kitchen_queue').select('id').eq('order_id',orderId).maybeSingle();
  if(existingError){alert('Erreur de vérification de la file cuisine : '+existingError.message);return false;}
  if(!existing){
    const {data:lastItem,error:lastError}=await supabase.from('kitchen_queue').select('queue_position').order('queue_position',{ascending:false}).limit(1).maybeSingle();
    if(lastError){alert('Erreur de lecture de la file cuisine : '+lastError.message);return false;}
    const nextPosition=(lastItem?.queue_position||0)+1;
    const {error:insertError}=await supabase.from('kitchen_queue').insert({order_id:orderId,queue_position:nextPosition,status:'waiting'});
    if(insertError){alert('Erreur d’ajout à la file cuisine : '+insertError.message);return false;}
  }
  const {error:updateError}=await supabase.from('orders').update({status:'confirmed'}).eq('id',orderId);
  if(updateError){alert('Commande ajoutée mais statut non mis à jour : '+updateError.message);return false;}
  return true;
}

async function changeOrderStatus(orderId,status){
  if(status==='enqueue'){
    const success=await enqueueOrder(orderId);
    if(success) await loadOrders();
    return;
  }

  const {data:queueItem}=await supabase.from('kitchen_queue').select('id').eq('order_id',orderId).maybeSingle();
  const updates={status};
  if(status==='paid') updates.payment_status='paid';
  const {error}=await supabase.from('orders').update(updates).eq('id',orderId);
  if(error){alert('Erreur de mise à jour : '+error.message);return;}

  if(queueItem){
    if(status==='preparing') await supabase.from('kitchen_queue').update({status:'in_progress'}).eq('id',queueItem.id);
    if(status==='ready') await supabase.from('kitchen_queue').update({status:'completed'}).eq('id',queueItem.id);
    if(status==='completed') await supabase.from('kitchen_queue').delete().eq('id',queueItem.id);
  }
  await loadOrders();
}

function renderOrders(){
  const visible=allOrders.filter(order=>currentView==='active'?!['completed','cancelled'].includes(order.status):['completed','cancelled'].includes(order.status));
  const activeCount=allOrders.filter(order=>!['completed','cancelled'].includes(order.status)).length;
  const archiveCount=allOrders.length-activeCount;
  viewTabs.forEach(tab=>{tab.textContent=tab.dataset.view==='active'?`En cours (${activeCount})`:`Archives (${archiveCount})`;tab.classList.toggle('active',tab.dataset.view===currentView);});
  if(!visible.length){ordersEl.innerHTML=`<div class="empty">${currentView==='active'?'Aucune commande en cours.':'Aucune commande archivée.'}</div>`;return;}

  ordersEl.innerHTML=visible.map(order=>{
    const action=nextAction(order.status);
    const queue=Array.isArray(order.kitchen_queue)?order.kitchen_queue[0]:order.kitchen_queue;
    const queuePosition=queue?.queue_position;
    const actionHtml=action?`<button class="order-action primary" data-order-id="${order.id}" data-next-status="${action[0]}">${action[1]}</button>`:'';
    const cardClass=['confirmed','preparing','ready'].includes(order.status)?' in-kitchen':'';
    const archivedClass=['completed','cancelled'].includes(order.status)?' archived':'';
    const badgeClass=order.status==='ready'?' ready':order.status==='preparing'?' preparing':archivedClass?' archived-badge':'';
    return `<article class="order-card${cardClass}${archivedClass}">
      <div class="order-top"><div><div class="order-number">Commande n°${order.order_number}${queuePosition?`<span class="queue-position">File #${queuePosition}</span>`:''}</div><div class="order-meta">${escapeHtml(order.customer_first_name)} ${escapeHtml(order.customer_last_name)}<br>${escapeHtml(order.customer_phone||'')} · ${escapeHtml(order.customer_email||'')}<br>${new Date(order.created_at).toLocaleString('fr-FR')}</div></div><span class="badge${badgeClass}">${escapeHtml(statusLabel(order.status))}</span></div>
      <ul class="items">${(order.order_items||[]).map(item=>`<li><div><div class="item-name">${escapeHtml(item.product_name)} × ${item.quantity}</div><div class="item-detail">Piment : ${item.spice_level===0?'Sans piment':'Niveau '+item.spice_level}</div></div><span>${formatMoney(Number(item.unit_price)*Number(item.quantity))}</span></li>`).join('')}</ul>
      <div class="order-bottom"><span>Temps estimé : ${order.estimated_preparation_minutes||0} min</span><strong>${formatMoney(order.total)}</strong></div>${actionHtml}
    </article>`;
  }).join('');

  ordersEl.querySelectorAll('.order-action').forEach(button=>button.addEventListener('click',async()=>{button.disabled=true;button.textContent='Mise à jour…';await changeOrderStatus(button.dataset.orderId,button.dataset.nextStatus);}));
}

async function loadOrders(){
  refreshInfo.textContent='Chargement…';
  const {data:orders,error}=await supabase.from('orders').select('id,order_number,status,total,payment_status,customer_first_name,customer_last_name,customer_email,customer_phone,estimated_preparation_minutes,created_at,order_items(product_name,quantity,unit_price,spice_level),kitchen_queue(queue_position,status)').order('created_at',{ascending:false});
  if(error){ordersEl.innerHTML=`<div class="empty">Erreur : ${escapeHtml(error.message)}</div>`;refreshInfo.textContent='Erreur';return;}
  allOrders=orders||[];
  refreshInfo.textContent=`${allOrders.length} commande(s) — dernière actualisation ${new Date().toLocaleTimeString('fr-FR')}`;
  renderOrders();
}

viewTabs.forEach(tab=>tab.addEventListener('click',()=>{currentView=tab.dataset.view;renderOrders();}));
loginForm.addEventListener('submit',async event=>{event.preventDefault();loginStatus.textContent='Connexion…';const {error}=await supabase.auth.signInWithPassword({email:document.querySelector('#email').value,password:document.querySelector('#password').value});if(error){loginStatus.textContent='Erreur : '+error.message;return}loginStatus.textContent='';showDashboard();});
logoutButton.addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();});
document.querySelector('#refresh').addEventListener('click',loadOrders);
const {data:{session}}=await supabase.auth.getSession();if(session)showDashboard();else showLogin();
