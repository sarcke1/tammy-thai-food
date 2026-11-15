import { supabase } from '../js/supabase.js';

const $ = s => document.querySelector(s);
const panel = $('#haccp-panel');
const statusEl = $('#haccp-status');
const recordEl = $('#haccp-record-content');
const consultEl = $('#haccp-consult-content');

let equipment = [];
let currentMode = 'record';
let currentRecordSection = 'temperatures';
let currentConsultSection = 'temperatures';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));
const localDate = value => new Date(value).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'});
const temp = value => value === null || value === undefined || value === ''
  ? '—'
  : Number(value).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' °C';
const today = () => new Date().toISOString().slice(0,10);

function status(message, error=false){
  if(!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.toggle('error', error);
}

function field(name,label,type='text',attrs=''){
  return '<label>'+label+'<input name="'+name+'" type="'+type+'" '+attrs+'></label>';
}

function textarea(name,label,required=false){
  return '<label>'+label+'<textarea name="'+name+'" rows="3" '+(required?'required':'')+'></textarea></label>';
}

function formCard(title, body){
  return '<article class="haccp-form-card"><h3>'+title+'</h3><form class="haccp-form" novalidate>'+body+'<button type="submit" class="primary">Enregistrer</button></form></article>';
}

function setMode(mode){
  currentMode = mode;
  $('#haccp-record')?.classList.toggle('hidden', mode !== 'record');
  $('#haccp-consult')?.classList.toggle('hidden', mode !== 'consult');
  panel?.querySelectorAll('[data-haccp-mode]').forEach(button => {
    button.classList.toggle('active', button.dataset.haccpMode === mode);
  });
  if(mode === 'record') renderRecord(currentRecordSection);
  else loadConsult(currentConsultSection);
}

function renderRecord(section){
  currentRecordSection = section;
  if(!recordEl) return;

  if(section === 'temperatures'){
    if(!equipment.length){
      recordEl.innerHTML = '<div class="availability-empty">Chargement des équipements…</div>';
      loadEquipment().then(() => renderRecord('temperatures'));
      return;
    }
    recordEl.innerHTML = equipment.map(eq => formCard(
      '🌡️ '+esc(eq.name),
      '<input type="hidden" name="equipment_id" value="'+esc(eq.id)+'">'+
      '<p>Plage conforme : '+temp(eq.min_temperature_c)+' à '+temp(eq.max_temperature_c)+'</p>'+
      field('temperature','Température relevée','text','required placeholder="Ex. 3,2 ou -18,4" inputmode="decimal"')+
      textarea('corrective_action','Action corrective — obligatoire si non conforme')+
      textarea('notes','Observation facultative')
    )).join('');
  }

  if(section === 'transport'){
    recordEl.innerHTML = formCard('🚗 Livraison / transport',
      field('reference','Référence commande / tournée','text','placeholder="Facultatif"')+
      '<label>Type de transport<select name="transport_type"><option>Sac isotherme</option><option>Glacière</option><option>Autre</option></select></label>'+
      field('departure_temperature_c','Température au départ (°C)','number','step="0.1" inputmode="decimal"')+
      field('arrival_temperature_c','Température à l’arrivée (°C)','number','step="0.1" inputmode="decimal"')+
      '<label class="haccp-check"><input type="checkbox" name="is_conforming" checked> Transport conforme</label>'+
      textarea('corrective_action','Action corrective')+
      textarea('notes','Observation')
    );
  }

  if(section === 'cleaning'){
    recordEl.innerHTML = formCard('🧹 Suivi du nettoyage',
      field('cleaning_date','Date','date','required value="'+today()+'"')+
      '<label>Fréquence<select name="frequency"><option>Quotidien</option><option>Hebdomadaire</option><option>Mensuel</option><option>Périodique</option></select></label>'+
      field('zone','Zone / équipement','text','required placeholder="Plan de travail, wok, frigo…"')+
      field('method_or_product','Produit / méthode','text','placeholder="Facultatif"')+
      field('performed_by','Réalisé par','text','placeholder="Facultatif"')+
      textarea('notes','Observation')
    );
  }

  if(section === 'receipts'){
    recordEl.innerHTML = formCard('📦 Réception des marchandises',
      '<p>Une réception crée un numéro automatique et un historique de lot.</p>'+
      field('supplier','Fournisseur','text','required')+
      field('product_name','Produit reçu','text','required')+
      field('lot_number','Numéro de lot','text')+
      field('expiry_date','DLC / DDM','date')+
      field('temperature_c','Température à réception (°C)','number','step="0.1" inputmode="decimal"')+
      '<label class="haccp-check"><input type="checkbox" name="packaging_conforming" checked> Emballage conforme</label>'+
      '<label class="haccp-check"><input type="checkbox" name="is_conforming" checked> Réception conforme</label>'+
      textarea('corrective_action','Action corrective')+
      '<label>Photos de l’étiquette / produit<input name="photos" type="file" accept="image/*" multiple></label>'+
      textarea('notes','Observation')
    );
  }

  if(section === 'oil'){
    recordEl.innerHTML = formCard('🛢️ Huile de friture',
      '<label>Action<select name="oil_action"><option value="mise_en_service">Mise en service</option><option value="controle">Contrôle</option><option value="changement">Changement d’huile</option></select></label>'+
      field('result','Résultat / mesure','text','placeholder="Ex. aspect conforme, test…"', '')+
      '<label class="haccp-check"><input type="checkbox" name="is_conforming" checked> Conforme</label>'+
      textarea('corrective_action','Action corrective')+
      textarea('notes','Observation')
    );
  }

  if(section === 'nonconformities'){
    recordEl.innerHTML = formCard('⚠️ Gestion des non-conformités',
      '<label>Catégorie<select name="category"><option>Température</option><option>Réception</option><option>Chaîne du froid</option><option>Emballage</option><option>Panne matériel</option><option>Hygiène</option><option>Autre</option></select></label>'+
      textarea('description','Problème / description',true)+
      textarea('corrective_action','Action corrective',true)+
      textarea('result','Résultat')+
      '<label>Statut<select name="status"><option value="open">Ouverte</option><option value="monitoring">Surveillance</option><option value="resolved">Résolue</option></select></label>'
    );
  }

  panel?.querySelectorAll('[data-haccp-section]').forEach(button => {
    button.classList.toggle('active', button.dataset.haccpSection === section);
  });
}

function historyRows(rows, render){
  if(!rows?.length) return '<div class="availability-empty">Aucun enregistrement.</div>';
  return '<div class="haccp-history">'+rows.map(row => '<div class="haccp-history-row">'+render(row)+'</div>').join('')+'</div>';
}

async function loadConsult(section){
  currentConsultSection = section;
  if(!consultEl) return;
  consultEl.innerHTML = '<p>Chargement…</p>';
  panel?.querySelectorAll('[data-haccp-consult]').forEach(button => {
    button.classList.toggle('active', button.dataset.haccpConsult === section);
  });

  try{
    if(section === 'temperatures'){
      const {data,error} = await supabase.from('haccp_temperature_logs')
        .select('measured_temperature_c,measured_at,is_conforming,corrective_action,notes,haccp_equipment(name)')
        .order('measured_at',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.haccp_equipment?.name || 'Équipement')+'</strong> — '+temp(row.measured_temperature_c)+' — '+(row.is_conforming?'✓ Conforme':'⚠ Non conforme')+
        '<br><small>'+localDate(row.measured_at)+(row.corrective_action?' · Action : '+esc(row.corrective_action):'')+'</small>'
      );
    }

    if(section === 'transport'){
      const {data,error} = await supabase.from('haccp_transport_logs').select('*').order('departure_at',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.reference || row.transport_type)+'</strong> — '+(row.is_conforming?'✓ Conforme':'⚠ Non conforme')+
        '<br><small>'+localDate(row.departure_at)+' · Départ '+temp(row.departure_temperature_c)+' · Arrivée '+temp(row.arrival_temperature_c)+'</small>'
      );
    }

    if(section === 'cleaning'){
      const {data,error} = await supabase.from('haccp_cleaning_logs').select('*').order('cleaning_date',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.zone)+'</strong> — '+esc(row.frequency)+
        '<br><small>'+esc(row.cleaning_date)+' · '+esc(row.method_or_product || 'Méthode non renseignée')+(row.performed_by?' · '+esc(row.performed_by):'')+'</small>'
      );
    }

    if(section === 'receipts'){
      const {data,error} = await supabase.from('haccp_receipts')
        .select('*,haccp_receipt_items(*),haccp_receipt_photos(storage_path,original_name)')
        .order('received_at',{ascending:false}).limit(100);
      if(error) throw error;
      for(const receipt of data || []){
        for(const photo of receipt.haccp_receipt_photos || []){
          const {data:signed} = await supabase.storage.from('haccp-receipts').createSignedUrl(photo.storage_path,3600);
          photo.signed_url = signed?.signedUrl || '';
        }
      }
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.receipt_number)+'</strong> — '+esc(row.supplier)+' — '+(row.is_conforming?'✓ Conforme':'⚠ Non conforme')+
        '<br><small>'+localDate(row.received_at)+'</small>'+
        '<div>'+((row.haccp_receipt_items || []).map(item => '📦 '+esc(item.product_name)+(item.lot_number?' · lot '+esc(item.lot_number):'')).join('<br>'))+'</div>'+
        ((row.haccp_receipt_photos || []).map(photo => photo.signed_url
          ? '📷 <a target="_blank" rel="noopener" href="'+esc(photo.signed_url)+'">'+esc(photo.original_name || 'Voir la photo')+'</a>'
          : '📷 '+esc(photo.original_name || 'Photo enregistrée')).join('<br>'))
      );
    }

    if(section === 'lots'){
      const {data,error} = await supabase.from('haccp_lot_usage')
        .select('*,haccp_receipt_items(product_name,lot_number,haccp_receipts(receipt_number,supplier,received_at))')
        .order('used_from',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row => {
        const item = row.haccp_receipt_items || {};
        const receipt = item.haccp_receipts || {};
        return '<strong>'+esc(item.product_name || 'Produit')+'</strong> · lot '+esc(item.lot_number || 'non renseigné')+
          '<br><small>'+esc(receipt.receipt_number || '')+' · utilisé du '+esc(row.used_from)+(row.used_until?' au '+esc(row.used_until):' · en cours')+'</small>';
      });
    }

    if(section === 'oil'){
      const {data,error} = await supabase.from('haccp_oil_logs').select('*').order('action_at',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.oil_action.replaceAll('_',' '))+'</strong> — '+(row.is_conforming?'✓ Conforme':'⚠ Non conforme')+
        '<br><small>'+localDate(row.action_at)+(row.result?' · '+esc(row.result):'')+'</small>'
      );
    }

    if(section === 'nonconformities'){
      const {data,error} = await supabase.from('haccp_nonconformities').select('*').order('occurred_at',{ascending:false}).limit(100);
      if(error) throw error;
      consultEl.innerHTML = historyRows(data, row =>
        '<strong>'+esc(row.category)+'</strong> — '+esc(row.status)+
        '<br>'+esc(row.description)+
        '<br><small>Action corrective : '+esc(row.corrective_action)+(row.result?' · Résultat : '+esc(row.result):'')+'</small>'
      );
    }
  }catch(error){
    consultEl.innerHTML = '<div class="availability-empty">Erreur : '+esc(error.message || error)+'</div>';
    status('Erreur de consultation : '+(error.message || error), true);
  }
}

function formValue(form,name){
  return String(form.elements[name]?.value || '').trim();
}

function numberValue(form,name){
  const raw = formValue(form,name).replace(',','.');
  return raw === '' ? null : Number(raw);
}

async function submitTemperature(form){
  const equipmentId = formValue(form,'equipment_id');
  const measured = numberValue(form,'temperature');
  const eq = equipment.find(item => item.id === equipmentId);
  if(!eq || !Number.isFinite(measured)) throw new Error('Température invalide.');
  const conforming = measured >= Number(eq.min_temperature_c) && measured <= Number(eq.max_temperature_c);
  const corrective = formValue(form,'corrective_action');
  if(!conforming && !corrective) throw new Error('Action corrective obligatoire pour une température non conforme.');

  const {error} = await supabase.from('haccp_temperature_logs').insert({
    equipment_id:equipmentId,
    measured_temperature_c:measured,
    corrective_action:corrective || null,
    notes:formValue(form,'notes') || null
  });
  if(error) throw error;
}

async function submitReceipt(form){
  const {data:number,error:numberError} = await supabase.rpc('haccp_next_receipt_number',{p_date:today()});
  if(numberError) throw numberError;

  const {data:receipt,error:receiptError} = await supabase.from('haccp_receipts').insert({
    receipt_number:number,
    supplier:formValue(form,'supplier'),
    packaging_conforming:form.elements.packaging_conforming.checked,
    is_conforming:form.elements.is_conforming.checked,
    temperature_c:numberValue(form,'temperature_c'),
    corrective_action:formValue(form,'corrective_action') || null,
    notes:formValue(form,'notes') || null
  }).select().single();
  if(receiptError) throw receiptError;

  const {data:item,error:itemError} = await supabase.from('haccp_receipt_items').insert({
    receipt_id:receipt.id,
    product_name:formValue(form,'product_name'),
    lot_number:formValue(form,'lot_number') || null,
    expiry_date:formValue(form,'expiry_date') || null,
    temperature_c:numberValue(form,'temperature_c')
  }).select().single();
  if(itemError) throw itemError;

  for(const file of [...(form.elements.photos?.files || [])]){
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path = receipt.id+'/'+Date.now()+'-'+safeName;
    const {error:uploadError} = await supabase.storage.from('haccp-receipts').upload(path,file,{contentType:file.type});
    if(uploadError) throw uploadError;
    const {error:photoError} = await supabase.from('haccp_receipt_photos').insert({
      receipt_id:receipt.id,storage_path:path,original_name:file.name
    });
    if(photoError) throw photoError;
  }

  if(item.lot_number){
    const {error:usageError} = await supabase.from('haccp_lot_usage').insert({
      receipt_item_id:item.id,used_from:today()
    });
    if(usageError) throw usageError;
  }
}

async function submitGeneric(form){
  const section = currentRecordSection;
  if(section === 'temperatures') return submitTemperature(form);
  if(section === 'receipts') return submitReceipt(form);

  let table = '';
  let payload = {};

  if(section === 'transport'){
    table = 'haccp_transport_logs';
    payload = {
      reference:formValue(form,'reference') || null,
      transport_type:formValue(form,'transport_type'),
      departure_temperature_c:numberValue(form,'departure_temperature_c'),
      arrival_temperature_c:numberValue(form,'arrival_temperature_c'),
      is_conforming:form.elements.is_conforming.checked,
      corrective_action:formValue(form,'corrective_action') || null,
      notes:formValue(form,'notes') || null
    };
  }

  if(section === 'cleaning'){
    table = 'haccp_cleaning_logs';
    payload = {
      cleaning_date:formValue(form,'cleaning_date'),
      zone:formValue(form,'zone'),
      frequency:formValue(form,'frequency'),
      method_or_product:formValue(form,'method_or_product') || null,
      performed_by:formValue(form,'performed_by') || null,
      notes:formValue(form,'notes') || null
    };
  }

  if(section === 'oil'){
    table = 'haccp_oil_logs';
    payload = {
      oil_action:formValue(form,'oil_action'),
      result:formValue(form,'result') || null,
      is_conforming:form.elements.is_conforming.checked,
      corrective_action:formValue(form,'corrective_action') || null,
      notes:formValue(form,'notes') || null
    };
  }

  if(section === 'nonconformities'){
    table = 'haccp_nonconformities';
    const state = formValue(form,'status');
    payload = {
      category:formValue(form,'category'),
      description:formValue(form,'description'),
      corrective_action:formValue(form,'corrective_action'),
      result:formValue(form,'result') || null,
      status:state,
      resolved_at:state === 'resolved' ? new Date().toISOString() : null
    };
  }

  if(!table) throw new Error('Section inconnue.');
  const {error} = await supabase.from(table).insert(payload);
  if(error) throw error;
}

async function loadEquipment(){
  status('Chargement HACCP…');
  const {data,error} = await supabase.from('haccp_equipment').select('*').eq('active',true).order('name');
  if(error){
    status('Erreur HACCP : '+error.message,true);
    return;
  }
  equipment = data || [];
  status('Module HACCP prêt.');
}

async function refreshHaccp(){
  await loadEquipment();
  if(currentMode === 'record') renderRecord(currentRecordSection);
  else loadConsult(currentConsultSection);
}

panel?.addEventListener('click', async event => {
  const refresh = event.target.closest('#haccp-refresh');
  if(refresh){ event.preventDefault(); await refreshHaccp(); return; }

  const modeButton = event.target.closest('[data-haccp-mode]');
  if(modeButton){ event.preventDefault(); setMode(modeButton.dataset.haccpMode); return; }

  const recordButton = event.target.closest('[data-haccp-section]');
  if(recordButton){ event.preventDefault(); renderRecord(recordButton.dataset.haccpSection); return; }

  const consultButton = event.target.closest('[data-haccp-consult]');
  if(consultButton){ event.preventDefault(); await loadConsult(consultButton.dataset.haccpConsult); }
});

recordEl?.addEventListener('submit', async event => {
  const form = event.target.closest('form.haccp-form');
  if(!form) return;
  event.preventDefault();

  if(!form.reportValidity()) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try{
    await submitGeneric(form);
    status('Enregistrement effectué et horodaté.');
    form.reset();
    if(currentRecordSection === 'temperatures') renderRecord('temperatures');
    if(currentRecordSection === 'cleaning') renderRecord('cleaning');
  }catch(error){
    status('Erreur : '+(error.message || error),true);
  }finally{
    button.disabled = false;
  }
});

window.addEventListener('tammy:haccp-open', async () => {
  await refreshHaccp();
});

supabase.auth.onAuthStateChange(async () => {
  const {data:{session}} = await supabase.auth.getSession();
  $('#haccp-tab')?.classList.toggle('hidden',!session);
});

refreshHaccp();
