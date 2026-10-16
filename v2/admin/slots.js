import { supabase } from '../js/supabase.js';

const panel = document.querySelector('#slots-panel');
const status = document.querySelector('#slots-status');
const list = document.querySelector('#slots-list');
const generateButton = document.querySelector('#generate-slots');
const slotsTab = document.querySelector('#slots-tab');
const openingPanel = document.querySelector('#opening-panel');
const openingTab = document.querySelector('#opening-tab');
const orders = document.querySelector('#orders');
const toolbar = document.querySelector('.toolbar');
const viewTabs = document.querySelector('.view-tabs');

const dateKey = d => {
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};
const timeKey = value => String(value).slice(0,5);
const labelDate = value => new Date(value+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const endDate = () => { const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+60);return d; };

function showPanel(){
  const show=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!show);
  openingPanel.classList.add('hidden');
  orders.classList.toggle('hidden',show);
  viewTabs.classList.toggle('hidden',show);
  toolbar.classList.toggle('hidden',show);
  openingTab.setAttribute('aria-pressed','false');
  openingTab.textContent='Calendrier des ouvertures';
  slotsTab.setAttribute('aria-pressed',String(show));
  slotsTab.textContent=show?'Retour aux commandes':'Planning des créneaux';
  if(show) loadSlots();
}
slotsTab.addEventListener('click',showPanel);

async function loadSlots(){
  status.textContent='Chargement du planning…';
  const from=dateKey(new Date()),to=dateKey(endDate());
  const {data,error}=await supabase.from('service_slots')
    .select('id,service_date,start_time,end_time,active,max_preparation_minutes')
    .gte('service_date',from).lte('service_date',to)
    .order('service_date').order('start_time');
  if(error){status.textContent='Erreur de chargement : '+error.message;list.innerHTML='';return;}
  renderSlots(data||[]);
  status.textContent=`${(data||[]).length} créneau(x) dans les 60 prochains jours.`;
}

function renderSlots(slots){
  if(!slots.length){list.innerHTML='<p class="empty">Aucun créneau généré. Utilisez le bouton de génération.</p>';return;}
  let currentDate='';
  list.innerHTML=slots.map(slot=>{
    const heading=slot.service_date!==currentDate;
    currentDate=slot.service_date;
    return `${heading?`<h3 class="slot-date">${labelDate(slot.service_date)}</h3>`:''}
      <div class="slot-row" data-slot-id="${slot.id}">
        <span class="slot-time">${timeKey(slot.start_time)} – ${timeKey(slot.end_time)}</span>
        <label class="slot-active"><input type="checkbox" data-slot-active ${slot.active?'checked':''}> Ouvert</label>
        <label class="slot-capacity">Charge max. (min)<input type="number" min="1" max="240" step="5" value="${slot.max_preparation_minutes}" data-slot-capacity></label>
      </div>`;
  }).join('');
  list.querySelectorAll('[data-slot-active]').forEach(input=>input.addEventListener('change',()=>saveSlot(input)));
  list.querySelectorAll('[data-slot-capacity]').forEach(input=>input.addEventListener('change',()=>saveSlot(input)));
}

async function saveSlot(input){
  const row=input.closest('[data-slot-id]');
  const activeInput=row.querySelector('[data-slot-active]');
  const capacityInput=row.querySelector('[data-slot-capacity]');
  const capacity=Math.max(1,Math.min(240,Number(capacityInput.value)||45));
  activeInput.disabled=true;capacityInput.disabled=true;
  status.textContent='Enregistrement du créneau…';
  const {error}=await supabase.from('service_slots').update({
    active:activeInput.checked,
    max_preparation_minutes:capacity
  }).eq('id',row.dataset.slotId);
  activeInput.disabled=false;capacityInput.disabled=false;
  if(error){status.textContent='Erreur : '+error.message;return;}
  capacityInput.value=String(capacity);
  status.textContent='Créneau enregistré.';
}

function addIntervals(rows,date,period){
  const dow=date.getDay();
  const row=rows.find(r=>Number(r.day_of_week)===dow&&r.service_period===period);
  if(!row?.is_open)return [];
  const weekend=dow===0||dow===6;
  const start=period==='midi'?11*60:17*60+30;
  const end=period==='midi'?14*60:(weekend?22*60:21*60);
  const result=[];
  for(let t=start;t<end;t+=15){
    const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')+':00';
    result.push({
      service_date:dateKey(date),
      start_time:fmt(t),
      end_time:fmt(t+15),
      max_orders:10,
      max_preparation_minutes:45,
      active:true
    });
  }
  return result;
}

generateButton.addEventListener('click',async()=>{
  generateButton.disabled=true;
  status.textContent='Lecture des ouvertures hebdomadaires…';
  try{
    const {data:hours,error:hoursError}=await supabase.from('weekly_opening_hours').select('day_of_week,service_period,is_open');
    if(hoursError)throw hoursError;
    const all=[];
    const start=new Date();start.setHours(12,0,0,0);
    const end=endDate();
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
      all.push(...addIntervals(hours,d,'midi'),...addIntervals(hours,d,'soir'));
    }
    if(!all.length)throw new Error('Aucun service n’est marqué ouvert dans le calendrier hebdomadaire.');
    let inserted=0;
    for(let i=0;i<all.length;i+=250){
      const chunk=all.slice(i,i+250);
      const {data,error}=await supabase.from('service_slots')
        .upsert(chunk,{onConflict:'service_date,start_time,end_time',ignoreDuplicates:true})
        .select('id');
      if(error)throw error;
      inserted+=(data||[]).length;
    }
    status.textContent=`${all.length} créneau(x) calculés. Les créneaux déjà existants ont été conservés.`;
    await loadSlots();
  }catch(error){
    status.textContent='Erreur : '+(error?.message||String(error));
  }finally{
    generateButton.disabled=false;
  }
});
