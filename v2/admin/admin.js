import { supabase } from '../js/supabase.js';

const loginPanel=document.querySelector('#login-panel'),dashboard=document.querySelector('#dashboard'),loginForm=document.querySelector('#login-form'),loginStatus=document.querySelector('#login-status'),logoutButton=document.querySelector('#logout'),ordersEl=document.querySelector('#orders'),refreshInfo=document.querySelector('#refresh-info'),viewTabs=document.querySelectorAll('.view-tab'),enableSoundButton=document.querySelector('#enable-sound'),alertStatus=document.querySelector('#alert-status');
let currentView='active',allOrders=[],loading=false,firstLoad=true,knownOrderIds=new Set(),audioContext=null,audioEnabled=false,refreshTimer=null;
const checklistKey='tammy-kitchen-checklist';

function showDashboard(){loginPanel.classList.add('hidden');dashboard.classList.remove('hidden');logoutButton.classList.remove('hidden');loadOrders();startAutoRefresh();}
function showLogin(){loginPanel.classList.remove('hidden');dashboard.classList.add('hidden');logoutButton.classList.add('hidden');if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}}
function escapeHtml(v){return String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
function statusLabel(s){return({pending_payment:'En attente de paiement',paid:'Payée',confirmed:'En cuisine',preparing:'En cuisine',ready:'En attente de retrait',completed:'Archivée',cancelled:'Annulée'})[s]||s;}
function nextAction(s){return({pending_payment:['paid','Marquer comme payée'],paid:['enqueue','Mettre en cuisine'],confirmed:['noop','En cuisine'],preparing:null,ready:['completed','Retirer / archiver']})[s]||null;}
function formatMoney(v){return Number(v||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});}
function getChecklist(){try{return JSON.parse(localStorage.getItem(checklistKey)||'{}');}catch{return{};}}
function setChecklist(d){localStorage.setItem(checklistKey,JSON.stringify(d));}
function isChecked(id,i){return Boolean(getChecklist()[id]?.includes(i));}
function updateChecklist(id,i,checked){const d=getChecklist(),list=new Set(d[id]||[]);checked?list.add(i):list.delete(i);d[id]=[...list];setChecklist(d);}
function allChecked(o){return(o.order_items||[]).length>0&&o.order_items.every((_,i)=>isChecked(o.id,i));}

async function activateAudio(){
  try{
    audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();
    await audioContext.resume();
    audioEnabled=audioContext.state==='running';
    if(!audioEnabled)throw new Error('AudioContext non actif');
    enableSoundButton.textContent='Son activé';
    alertStatus.textContent='Alertes sonores activées';
    enableSoundButton.disabled=true;
    await playNotificationSound(false);
  }catch(error){
    console.error('Audio activation error:',error);
    audioEnabled=false;
    alertStatus.textContent='Son non disponible sur ce navigateur';
  }
}

async function playNotificationSound(repeat=true){
  if(!audioContext||!audioEnabled)return;
  try{
    if(audioContext.state==='suspended')await audioContext.resume();
    if(audioContext.state!=='running')return;
    const beep=()=>{
      const now=audioContext.currentTime;
      const osc=audioContext.createOscillator();
      const gain=audioContext.createGain();
      osc.type='sine';
      osc.frequency.setValueAtTime(880,now);
      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.exponentialRampToValueAtTime(0.35,now+0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.45);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now+0.5);
    };
    beep();
    if(repeat){setTimeout(beep,550);setTimeout(beep,1100);}
  }catch(error){console.error('Notification sound error:',error);}
}
function startAutoRefresh(){if(refreshTimer)return;refreshTimer=setInterval(()=>loadOrders(true),5000);}

async function enqueueOrder(orderId){const{data:existing,error:ee}=await supabase.from('kitchen_queue').select('id').eq('order_id',orderId).maybeSingle();if(ee){alert('Erreur de vérification de la file cuisine : '+ee.message);return false;}if(!existing){const{data:last,error:le}=await supabase.from('kitchen_queue').select('queue_position').order('queue_position',{ascending:false}).limit(1).maybeSingle();if(le){alert('Erreur de lecture de la file cuisine : '+le.message);return false;}const pos=(last?.queue_position||0)+1;const{error:ie}=await supabase.from('kitchen_queue').insert({order_id:orderId,queue_position:pos,status:'in_progress'});if(ie){alert('Erreur d’ajout à la file cuisine : '+ie.message);return false;}}const{error:ue}=await supabase.from('orders').update({status:'preparing'}).eq('id',orderId);if(ue){alert('Commande ajoutée mais statut non mis à jour : '+ue.message);return false;}return true;}
async function changeOrderStatus(id,status){if(status==='noop')return;if(status==='enqueue'){if(await enqueueOrder(id))await loadOrders();return;}const{data:q}=await supabase.from('kitchen_queue').select('id').eq('order_id',id).maybeSingle();const updates={status};if(status==='paid')updates.payment_status='paid';const{error}=await supabase.from('orders').update(updates).eq('id',id);if(error){alert('Erreur de mise à jour : '+error.message);return;}if(q){if(status==='ready')await supabase.from('kitchen_queue').update({status:'completed'}).eq('id',q.id);if(status==='completed')await supabase.from('kitchen_queue').delete().eq('id',q.id);}await loadOrders();}
function renderChecklist(o){if(!['preparing','confirmed'].includes(o.status))return '';const items=o.order_items||[],count=items.filter((_,i)=>isChecked(o.id,i)).length;return `<div class="kitchen-checklist"><div class="checklist-title">Préparation : ${count}/${items.length} lignes préparées</div>${items.map((it,i)=>`<label class="checklist-item"><input type="checkbox" data-check-order="${o.id}" data-check-index="${i}" ${isChecked(o.id,i)?'checked':''}><span>${escapeHtml(it.product_name)} × ${it.quantity} — ${it.spice_level===0?'Sans piment':'Niveau '+it.spice_level}</span></label>`).join('')}</div>${allChecked(o)?`<button class="order-action primary" data-order-id="${o.id}" data-next-status="ready">Sac complet — en attente du client</button>`:''}`;}
function matchesView(o){if(currentView==='archive')return['completed','cancelled'].includes(o.status);if(currentView==='kitchen')return['preparing','confirmed'].includes(o.status);if(currentView==='pickup')return o.status==='ready';return!['completed','cancelled','preparing','confirmed','ready'].includes(o.status);}
function renderOrders(){const visible=allOrders.filter(matchesView),activeCount=allOrders.filter(o=>!['completed','cancelled','preparing','confirmed','ready'].includes(o.status)).length,kitchenCount=allOrders.filter(o=>['preparing','confirmed'].includes(o.status)).length,pickupCount=allOrders.filter(o=>o.status==='ready').length,archiveCount=allOrders.filter(o=>['completed','cancelled'].includes(o.status)).length;viewTabs.forEach(t=>{t.textContent=t.dataset.view==='active'?`En cours (${activeCount})`:t.dataset.view==='kitchen'?`En cuisine (${kitchenCount})`:t.dataset.view==='pickup'?`En attente de retrait (${pickupCount})`:`Archives (${archiveCount})`;t.classList.toggle('active',t.dataset.view===currentView);});if(!visible.length){ordersEl.innerHTML=`<div class="empty">${currentView==='archive'?'Aucune commande archivée.':currentView==='kitchen'?'Aucune commande en cuisine.':currentView==='pickup'?'Aucune commande en attente de retrait.':'Aucune commande en cours.'}</div>`;return;}ordersEl.innerHTML=visible.map(o=>{const action=nextAction(o.status),queue=Array.isArray(o.kitchen_queue)?o.kitchen_queue[0]:o.kitchen_queue,pos=queue?.queue_position,actionHtml=action&&action[0]!=='noop'?`<button class="order-action primary" data-order-id="${o.id}" data-next-status="${action[0]}">${action[1]}</button>`:'';const cardClass=['confirmed','preparing','ready'].includes(o.status)?' in-kitchen':'';const archived=['completed','cancelled'].includes(o.status);return `<article class="order-card${cardClass}${archived?' archived':''}"><div class="order-top"><div><div class="order-number">Commande n°${o.order_number}${pos?`<span class="queue-position">File #${pos}</span>`:''}</div><div class="order-meta">${escapeHtml(o.customer_first_name)} ${escapeHtml(o.customer_last_name)}<br>${escapeHtml(o.customer_phone||'')} · ${escapeHtml(o.customer_email||'')}<br>${new Date(o.created_at).toLocaleString('fr-FR')}</div></div><span class="badge">${escapeHtml(statusLabel(o.status))}</span></div><ul class="items">${(o.order_items||[]).map(it=>`<li><div><div class="item-name">${escapeHtml(it.product_name)} × ${it.quantity}</div><div class="item-detail">Piment : ${it.spice_level===0?'Sans piment':'Niveau '+it.spice_level}</div></div><span>${formatMoney(Number(it.unit_price)*Number(it.quantity))}</span></li>`).join('')}</ul>${renderChecklist(o)}<div class="order-bottom"><span>Temps estimé : ${o.estimated_preparation_minutes||0} min</span><strong>${formatMoney(o.total)}</strong></div>${actionHtml}</article>`;}).join('');ordersEl.querySelectorAll('[data-check-order]').forEach(i=>i.addEventListener('change',()=>{updateChecklist(i.dataset.checkOrder,Number(i.dataset.checkIndex),i.checked);renderOrders();}));ordersEl.querySelectorAll('.order-action').forEach(b=>b.addEventListener('click',async()=>{b.disabled=true;b.textContent='Mise à jour…';await changeOrderStatus(b.dataset.orderId,b.dataset.nextStatus);}));}

async function loadOrders(silent=false){if(loading)return;loading=true;const{data,error}=await supabase.from('orders').select('id,order_number,status,total,payment_status,customer_first_name,customer_last_name,customer_email,customer_phone,estimated_preparation_minutes,created_at,order_items(product_name,quantity,unit_price,spice_level),kitchen_queue(queue_position,status)').order('created_at',{ascending:false});loading=false;if(error){if(!silent){ordersEl.innerHTML=`<div class="empty">Erreur : ${escapeHtml(error.message)}</div>`;refreshInfo.textContent='Erreur';}return;}const incoming=data||[];if(!firstLoad){const newOrders=incoming.filter(o=>!knownOrderIds.has(o.id));if(newOrders.length){playNotificationSound(true);alertStatus.textContent=`${newOrders.length} nouvelle commande${newOrders.length>1?'s':''} détectée${newOrders.length>1?'s':''}`;}}knownOrderIds=new Set(incoming.map(o=>o.id));firstLoad=false;allOrders=incoming;refreshInfo.textContent=`${allOrders.length} commande(s) — actualisation automatique toutes les 5 s — ${new Date().toLocaleTimeString('fr-FR')}`;renderOrders();}

viewTabs.forEach(t=>t.addEventListener('click',()=>{currentView=t.dataset.view;renderOrders();}));
loginForm.addEventListener('submit',async e=>{e.preventDefault();loginStatus.textContent='Connexion…';const{error}=await supabase.auth.signInWithPassword({email:document.querySelector('#email').value,password:document.querySelector('#password').value});if(error){loginStatus.textContent='Erreur : '+error.message;return;}loginStatus.textContent='';showDashboard();});
logoutButton.addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();});
document.querySelector('#refresh').addEventListener('click',()=>loadOrders());
enableSoundButton.addEventListener('click',activateAudio);
const{data:{session}}=await supabase.auth.getSession();if(session)showDashboard();else showLogin();
