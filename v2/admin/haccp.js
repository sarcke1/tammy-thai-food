import { supabase } from '../js/supabase.js';

const tab=document.querySelector('#haccp-tab');
const panel=document.querySelector('#haccp-panel');
const statusEl=document.querySelector('#haccp-status');
const equipmentEl=document.querySelector('#haccp-equipment');
const historyEl=document.querySelector('#haccp-history');
const refreshButton=document.querySelector('#haccp-refresh');

let equipment=[];

function escapeHtml(value){
  return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&gt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function formatTemperature(value){return Number(value).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' °C';}
function formatDate(value){return new Date(value).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'});}
function isConforming(item,temp){return Number(temp)>=Number(item.min_temperature_c)&&Number(temp)<=Number(item.max_temperature_c);}

async function syncVisibility(){
  const {data:{session}}=await supabase.auth.getSession();
  tab?.classList.toggle('hidden',!session);
}

function showPanel(){
  panel.classList.toggle('hidden');
  tab?.setAttribute('aria-pressed',String(!panel.classList.contains('hidden')));
  if(!panel.classList.contains('hidden')) loadHaccp();
}

function renderEquipment(){
  if(!equipment.length){
    equipmentEl.innerHTML='<div class="availability-empty">Aucun équipement HACCP configuré.</div>';
    return;
  }
  equipmentEl.innerHTML=equipment.map(item=>`
    <article class="haccp-equipment-card">
      <div class="haccp-equipment-head">
        <div><h3>${escapeHtml(item.name)}</h3><p>Plage conforme : ${formatTemperature(item.min_temperature_c)} à ${formatTemperature(item.max_temperature_c)}</p></div>
      </div>
      <form class="haccp-temperature-form" data-equipment-id="${item.id}">
        <label>Température relevée avec le thermomètre indépendant
          <input name="temperature" type="text" inputmode="decimal" required pattern="[-+]?[0-9]+([,.][0-9]+)?" placeholder="Ex. -18,4 ou 3,2">
        </label>
        <label class="haccp-corrective hidden">Action corrective <span>obligatoire si non conforme</span>
          <textarea name="corrective_action" rows="3" placeholder="Ex. contrôle du joint, transfert des denrées, appel maintenance..."></textarea>
        </label>
        <label>Observation <span>facultatif</span>
          <textarea name="notes" rows="2" placeholder="Observation éventuelle"></textarea>
        </label>
        <div class="haccp-form-footer">
          <span class="haccp-live-status">Saisir une température</span>
          <button class="primary" type="submit">Enregistrer le relevé</button>
        </div>
      </form>
    </article>`).join('');

  equipmentEl.querySelectorAll('.haccp-temperature-form').forEach(form=>{
    const item=equipment.find(e=>e.id===form.dataset.equipmentId);
    const input=form.elements.temperature;
    const corrective=form.querySelector('.haccp-corrective');
    const live=form.querySelector('.haccp-live-status');
    const refreshState=()=>{
      if(input.value===''){corrective.classList.add('hidden');live.textContent='Saisir une température';return;}
      const temp=Number(String(input.value).replace(',','.'));
      if(!Number.isFinite(temp)){live.textContent='Température invalide';return;}
      const ok=isConforming(item,temp);
      corrective.classList.toggle('hidden',ok);
      corrective.querySelector('textarea').required=!ok;
      live.textContent=ok?'✓ Conforme':'⚠ Non conforme — action corrective obligatoire';
      live.classList.toggle('is-ok',ok);
      live.classList.toggle('is-alert',!ok);
    };
    input.addEventListener('input',refreshState);
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const temperature=Number(String(input.value).replace(',','.'));
      const correctiveAction=String(form.elements.corrective_action.value||'').trim();
      const notes=String(form.elements.notes.value||'').trim();
      if(!Number.isFinite(temperature)){alert('Veuillez saisir une température valide.');return;}
      const ok=isConforming(item,temperature);
      if(!ok&&!correctiveAction){alert('Une action corrective est obligatoire pour une température non conforme.');return;}
      const button=form.querySelector('button[type="submit"]');
      button.disabled=true;button.textContent='Enregistrement…';
      const {error}=await supabase.from('haccp_temperature_logs').insert({
        equipment_id:item.id,
        measured_temperature_c:temperature,
        corrective_action:correctiveAction||null,
        notes:notes||null
      });
      button.disabled=false;button.textContent='Enregistrer le relevé';
      if(error){alert('Erreur : '+error.message);return;}
      form.reset();refreshState();
      statusEl.textContent='Relevé enregistré et horodaté automatiquement.';
      await loadHistory();
    });
  });
}

async function loadHistory(){
  const {data,error}=await supabase
    .from('haccp_temperature_logs')
    .select('id,measured_temperature_c,measured_at,is_conforming,corrective_action,notes,haccp_equipment(name)')
    .order('measured_at',{ascending:false})
    .limit(30);
  if(error){historyEl.innerHTML='<div class="availability-empty">Erreur de chargement : '+escapeHtml(error.message)+'</div>';return;}
  if(!(data||[]).length){historyEl.innerHTML='<div class="availability-empty">Aucun relevé enregistré.</div>';return;}
  historyEl.innerHTML=data.map(log=>`
    <div class="haccp-history-row ${log.is_conforming?'is-conforming':'is-nonconforming'}">
      <div><strong>${escapeHtml(log.haccp_equipment?.name||'Équipement')}</strong><br><span>${formatDate(log.measured_at)}</span></div>
      <div class="haccp-history-temp">${formatTemperature(log.measured_temperature_c)}</div>
      <div class="haccp-history-result">${log.is_conforming?'✓ Conforme':'⚠ Non conforme'}${log.corrective_action?'<br><small>'+escapeHtml(log.corrective_action)+'</small>':''}</div>
    </div>`).join('');
}

async function loadHaccp(){
  statusEl.textContent='Chargement…';
  const {data,error}=await supabase.from('haccp_equipment').select('*').eq('active',true).order('name');
  if(error){statusEl.textContent='Erreur : '+error.message;return;}
  equipment=data||[];
  renderEquipment();
  await loadHistory();
  statusEl.textContent='Utilisez un thermomètre indépendant pour le relevé. La date et l’heure sont enregistrées automatiquement.';
}

tab?.addEventListener('click',showPanel);
refreshButton?.addEventListener('click',loadHaccp);
supabase.auth.onAuthStateChange(()=>syncVisibility());
syncVisibility();
