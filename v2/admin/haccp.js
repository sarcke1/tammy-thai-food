import { supabase } from '../js/supabase.js';

const $=s=>document.querySelector(s);
const tab=$('#haccp-tab'), panel=$('#haccp-panel'), statusEl=$('#haccp-status');
const recordEl=$('#haccp-record-content'), consultEl=$('#haccp-consult-content');
let equipment=[];

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const temp=v=>Number(v).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' °C';
const dateTime=v=>new Date(v).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'});
const input=(name,label,type='text',extra='')=>'<label>'+label+'<input name="'+name+'" type="'+type+'" '+extra+'></label>';

async function syncVisibility(){
  const {data:{session}}=await supabase.auth.getSession();
  tab?.classList.toggle('hidden',!session);
}
function showPanel(){
  if(!panel) return;
  const isOpening=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!isOpening);
  document.querySelector('#opening-panel')?.classList.add('hidden');
  document.querySelector('#slots-panel')?.classList.add('hidden');
  document.querySelector('#availability-panel')?.classList.add('hidden');
  if(isOpening){
    document.querySelector('#orders')?.classList.add('hidden');
    document.querySelector('.view-tabs')?.classList.add('hidden');
    document.querySelector('.toolbar')?.classList.add('hidden');
    loadHaccp();
  }else{
    document.querySelector('#orders')?.classList.remove('hidden');
    document.querySelector('.view-tabs')?.classList.remove('hidden');
    document.querySelector('.toolbar')?.classList.remove('hidden');
  }
  tab?.setAttribute('aria-pressed',String(isOpening));
}
function setStatus(text){statusEl.textContent=text;}
function setMode(mode){
  $('#haccp-record').classList.toggle('hidden',mode!=='record');
  $('#haccp-consult').classList.toggle('hidden',mode!=='consult');
  document.querySelectorAll('.haccp-mode-tab').forEach(b=>b.classList.toggle('active',b.dataset.haccpMode===mode));
}
function formShell(title,body){return '<article class="haccp-form-card"><h3>'+title+'</h3><form class="haccp-generic-form">'+body+'<div class="haccp-form-footer"><button class="primary" type="submit">Enregistrer</button></div></form></article>';}

function temperatureForm(){
  if(!equipment.length)return '<div class="availability-empty">Aucun équipement configuré.</div>';
  return equipment.map(e=>formShell('🌡️ '+esc(e.name),
    '<input type="hidden" name="equipment_id" value="'+e.id+'">'+
    '<p>Plage conforme : '+temp(e.min_temperature_c)+' à '+temp(e.max_temperature_c)+'</p>'+
    input('temperature','Température relevée','text','required placeholder="Ex. 3,2 ou -18,4"')+
    '<label class="haccp-corrective">Action corrective <span>obligatoire si non conforme</span><textarea name="corrective_action" rows="3"></textarea></label>'+
    '<label>Observation <span>facultatif</span><textarea name="notes" rows="2"></textarea></label>'
  )).join('');
}
function transportForm(){return formShell('🚗 Livraison / transport',
  input('reference','Référence commande / tournée','text','placeholder="Facultatif"')+
  '<label>Type de transport<select name="transport_type"><option>Sac isotherme</option><option>Glacière</option><option>Autre</option></select></label>'+
  input('departure_temperature_c','Température au départ (°C)','number','step="0.1"')+
  input('arrival_temperature_c','Température à l’arrivée (°C)','number step="0.1"')+
  '<label><input type="checkbox" name="is_conforming" checked> Conforme</label>'+
  '<label>Action corrective<textarea name="corrective_action" rows="2"></textarea></label><label>Observation<textarea name="notes" rows="2"></textarea></label>'
);}
function cleaningForm(){return formShell('🧹 Suivi du nettoyage',
  input('cleaning_date','Date','date','required value="'+new Date().toISOString().slice(0,10)+'"')+
  '<label>Fréquence<select name="frequency"><option>Quotidien</option><option>Hebdomadaire</option><option>Mensuel</option><option>Périodique</option></select></label>'+
  input('zone','Zone / équipement','text','required placeholder="Plan de travail, wok, frigo..."')+
  input('method_or_product','Produit / méthode','text','placeholder="Facultatif"')+
  input('performed_by','Réalisé par','text','placeholder="Facultatif"')+
  '<label>Observation<textarea name="notes" rows="2"></textarea></label>'
);}
function receiptForm(){return formShell('📦 Réception des marchandises',
  input('supplier','Fournisseur','text','required')+
  input('product_name','Produit reçu','text','required')+
  input('lot_number','Numéro de lot','text')+
  input('expiry_date','DLC / DDM','date')+
  input('temperature_c','Température à réception (°C)','number','step="0.1"')+
  '<label><input type="checkbox" name="packaging_conforming" checked> Emballage conforme</label>'+
  '<label><input type="checkbox" name="is_conforming" checked> Réception conforme</label>'+
  '<label>Action corrective<textarea name="corrective_action" rows="2"></textarea></label>'+
  '<label>Photo de l’étiquette / produit<input name="photos" type="file" accept="image/*" multiple></label>'+
  '<label>Observation<textarea name="notes" rows="2"></textarea></label>'
);}
function oilForm(){return formShell('🛢️ Huile de friture',
  '<label>Action<select name="oil_action"><option value="mise_en_service">Mise en service</option><option value="controle">Contrôle</option><option value="changement">Changement d’huile</option></select></label>'+
  input('result','Résultat / mesure','text','placeholder="Ex. aspect conforme, test..."')+
  '<label><input type="checkbox" name="is_conforming" checked> Conforme</label>'+
  '<label>Action corrective<textarea name="corrective_action" rows="2"></textarea></label><label>Observation<textarea name="notes" rows="2"></textarea></label>'
);}
function nonconformityForm(){return formShell('⚠️ Gestion des non-conformités',
  '<label>Catégorie<select name="category"><option>Température</option><option>Réception</option><option>Chaîne du froid</option><option>Emballage</option><option>Panne matériel</option><option>Hygiène</option><option>Autre</option></select></label>'+
  '<label>Problème / description<textarea name="description" rows="3" required></textarea></label>'+
  '<label>Action corrective<textarea name="corrective_action" rows="3" required></textarea></label>'+
  '<label>Résultat<textarea name="result" rows="2"></textarea></label>'+
  '<label>Statut<select name="status"><option value="open">Ouverte</option><option value="monitoring">Surveillance</option><option value="resolved">Résolue</option></select></label>'
);}
function renderRecord(section){
  const map={temperatures:temperatureForm,transport:transportForm,cleaning:cleaningForm,receipts:receiptForm,oil:oilForm,nonconformities:nonconformityForm};
  recordEl.innerHTML=(map[section]||temperatureForm)();
  recordEl.dataset.section=section;
}

async function loadConsult(section){
  consultEl.innerHTML='<p>Chargement…</p>';
  if(section==='temperatures'){
    const {data,error}=await supabase.from('haccp_temperature_logs').select('measured_temperature_c,measured_at,is_conforming,corrective_action,haccp_equipment(name)').order('measured_at',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.haccp_equipment?.name||'Équipement')+'</strong> — '+temp(d.measured_temperature_c)+' — '+(d.is_conforming?'✓ Conforme':'⚠ Non conforme')+'<br><small>'+dateTime(d.measured_at)+(d.corrective_action?' · '+esc(d.corrective_action):'')+'</small>');
  } else if(section==='transport'){
    const {data,error}=await supabase.from('haccp_transport_logs').select('*').order('departure_at',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.reference||d.transport_type)+'</strong> — '+(d.is_conforming?'✓ Conforme':'⚠ Non conforme')+'<br><small>'+dateTime(d.departure_at)+' · départ '+(d.departure_temperature_c==null?'—':temp(d.departure_temperature_c))+(d.arrival_temperature_c==null?'':' · arrivée '+temp(d.arrival_temperature_c))+'</small>');
  } else if(section==='cleaning'){
    const {data,error}=await supabase.from('haccp_cleaning_logs').select('*').order('cleaning_date',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.zone)+'</strong> — '+esc(d.frequency)+'<br><small>'+esc(d.cleaning_date)+' · '+esc(d.method_or_product||'')+'</small>');
  } else if(section==='receipts'){
    const {data,error}=await supabase.from('haccp_receipts').select('*,haccp_receipt_items(*),haccp_receipt_photos(storage_path,original_name)').order('received_at',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    for(const receipt of data||[]){
      for(const photo of receipt.haccp_receipt_photos||[]){
        const {data:signed}=await supabase.storage.from('haccp-receipts').createSignedUrl(photo.storage_path,3600);
        photo.signed_url=signed?.signedUrl||'';
      }
    }
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.receipt_number)+'</strong> — '+esc(d.supplier)+' — '+(d.is_conforming?'✓ Conforme':'⚠ Non conforme')+'<br><small>'+dateTime(d.received_at)+'</small><div>'+((d.haccp_receipt_items||[]).map(i=>'📦 '+esc(i.product_name)+(i.lot_number?' · lot '+esc(i.lot_number):'')).join('<br>'))+'</div>'+((d.haccp_receipt_photos||[]).map(p=>p.signed_url?'📷 <a target="_blank" rel="noopener" href="'+esc(p.signed_url)+'">'+esc(p.original_name||'Voir la photo')+'</a>':'📷 '+esc(p.original_name||'Photo enregistrée')).join('<br>'))');
  } else if(section==='lots'){
    const {data,error}=await supabase.from('haccp_lot_usage').select('*,haccp_receipt_items(product_name,lot_number,haccp_receipts(receipt_number,supplier,received_at))').order('used_from',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>{const i=d.haccp_receipt_items||{},r=i.haccp_receipts||{};return '<strong>'+esc(i.product_name||'Produit')+'</strong> · lot '+esc(i.lot_number||'non renseigné')+'<br><small>Réception '+esc(r.receipt_number||'')+' — utilisé du '+esc(d.used_from)+(d.used_until?' au '+esc(d.used_until):'')+'</small>';});
  } else if(section==='oil'){
    const {data,error}=await supabase.from('haccp_oil_logs').select('*').order('action_at',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.oil_action.replaceAll('_',' '))+'</strong> — '+(d.is_conforming?'✓ Conforme':'⚠ Non conforme')+'<br><small>'+dateTime(d.action_at)+' · '+esc(d.result||'')+'</small>');
  } else if(section==='nonconformities'){
    const {data,error}=await supabase.from('haccp_nonconformities').select('*').order('occurred_at',{ascending:false}).limit(100);
    if(error)return consultEl.innerHTML='<div class="availability-empty">'+esc(error.message)+'</div>';
    consultEl.innerHTML=historyRows(data,d=>'<strong>'+esc(d.category)+'</strong> — '+esc(d.status)+'<br>'+esc(d.description)+'<br><small>Action : '+esc(d.corrective_action)+'</small>');
  }
  consultEl.dataset.section=section;
}
function historyRows(data,row){return !data?.length?'<div class="availability-empty">Aucun enregistrement.</div>':'<div class="haccp-history">'+data.map(d=>'<div class="haccp-history-row">'+row(d)+'</div>').join('')+'</div>';}

function value(form,name){return String(form.elements[name]?.value||'').trim();}
function num(form,name){const v=value(form,name).replace(',','.');return v===''?null:Number(v);}
async function submitTemperature(form){
  const id=value(form,'equipment_id'), temperature=num(form,'temperature'), eq=equipment.find(e=>e.id===id);
  if(!eq||!Number.isFinite(temperature))throw new Error('Température invalide.');
  const ok=temperature>=Number(eq.min_temperature_c)&&temperature<=Number(eq.max_temperature_c);
  const corrective=value(form,'corrective_action');
  if(!ok&&!corrective)throw new Error('Action corrective obligatoire pour une non-conformité.');
  const {error}=await supabase.from('haccp_temperature_logs').insert({equipment_id:id,measured_temperature_c:temperature,corrective_action:corrective||null,notes:value(form,'notes')||null});
  if(error)throw error;
}
async function submitReceipt(form){
  const {data:number,error:nErr}=await supabase.rpc('haccp_next_receipt_number',{p_date:new Date().toISOString().slice(0,10)});
  if(nErr)throw nErr;
  const receipt={receipt_number:number,supplier:value(form,'supplier'),packaging_conforming:form.elements.packaging_conforming.checked,is_conforming:form.elements.is_conforming.checked,temperature_c:num(form,'temperature_c'),corrective_action:value(form,'corrective_action')||null,notes:value(form,'notes')||null};
  const {data,error}=await supabase.from('haccp_receipts').insert(receipt).select().single(); if(error)throw error;
  const {data:item,error:iErr}=await supabase.from('haccp_receipt_items').insert({receipt_id:data.id,product_name:value(form,'product_name'),lot_number:value(form,'lot_number')||null,expiry_date:value(form,'expiry_date')||null,temperature_c:num(form,'temperature_c')}).select().single(); if(iErr)throw iErr;
  const files=[...(form.elements.photos?.files||[])];
  for(const file of files){const path=data.id+'/'+Date.now()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const {error:uErr}=await supabase.storage.from('haccp-receipts').upload(path,file,{contentType:file.type});if(uErr)throw uErr;const {error:mErr}=await supabase.from('haccp_receipt_photos').insert({receipt_id:data.id,storage_path:path,original_name:file.name});if(mErr)throw mErr;}
  if(item.lot_number){await supabase.from('haccp_lot_usage').insert({receipt_item_id:item.id,used_from:new Date().toISOString().slice(0,10)});}
}
async function submitGeneric(section,form){
  if(section==='temperatures')return submitTemperature(form);
  if(section==='receipts')return submitReceipt(form);
  const tables={transport:'haccp_transport_logs',cleaning:'haccp_cleaning_logs',oil:'haccp_oil_logs',nonconformities:'haccp_nonconformities'};
  const table=tables[section]; if(!table)throw new Error('Section inconnue.');
  let payload={};
  if(section==='transport')payload={reference:value(form,'reference')||null,transport_type:value(form,'transport_type'),departure_temperature_c:num(form,'departure_temperature_c'),arrival_temperature_c:num(form,'arrival_temperature_c'),is_conforming:form.elements.is_conforming.checked,corrective_action:value(form,'corrective_action')||null,notes:value(form,'notes')||null};
  if(section==='cleaning')payload={cleaning_date:value(form,'cleaning_date'),zone:value(form,'zone'),frequency:value(form,'frequency'),method_or_product:value(form,'method_or_product')||null,performed_by:value(form,'performed_by')||null,notes:value(form,'notes')||null};
  if(section==='oil')payload={oil_action:value(form,'oil_action'),result:value(form,'result')||null,is_conforming:form.elements.is_conforming.checked,corrective_action:value(form,'corrective_action')||null,notes:value(form,'notes')||null};
  if(section==='nonconformities')payload={category:value(form,'category'),description:value(form,'description'),corrective_action:value(form,'corrective_action'),result:value(form,'result')||null,status:value(form,'status'),resolved_at:value(form,'status')==='resolved'?new Date().toISOString():null};
  const {error}=await supabase.from(table).insert(payload); if(error)throw error;
}

async function loadHaccp(){
  setStatus('Chargement HACCP…');
  const {data,error}=await supabase.from('haccp_equipment').select('*').eq('active',true).order('name');
  if(error){setStatus('Erreur : '+error.message);return;}
  equipment=data||[];
  renderRecord(recordEl.dataset.section||'temperatures');
  setStatus('Module HACCP prêt.');
}

window.addEventListener('tammy:haccp-open',()=>loadHaccp());
$('#haccp-refresh')?.addEventListener('click',loadHaccp);
document.querySelectorAll('.haccp-mode-tab').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.haccpMode)));
document.querySelectorAll('[data-haccp-section]').forEach(b=>b.addEventListener('click',()=>renderRecord(b.dataset.haccpSection)));
document.querySelectorAll('[data-haccp-consult]').forEach(b=>b.addEventListener('click',()=>loadConsult(b.dataset.haccpConsult)));
recordEl?.addEventListener('submit',async e=>{if(!e.target.matches('form'))return;e.preventDefault();const button=e.target.querySelector('button[type=submit]');button.disabled=true;try{await submitGeneric(recordEl.dataset.section,e.target);e.target.reset();setStatus('Enregistrement effectué et horodaté.');if(recordEl.dataset.section==='temperatures')renderRecord('temperatures');}catch(err){setStatus('Erreur : '+err.message);}finally{button.disabled=false;}});
supabase.auth.onAuthStateChange(()=>syncVisibility());
syncVisibility();