import { supabase } from '../js/supabase.js';

const panel=document.querySelector('#slots-panel');
const status=document.querySelector('#slots-status');
const list=document.querySelector('#slots-list');
const slotsTab=document.querySelector('#slots-tab');
const openingPanel=document.querySelector('#opening-panel');
const orders=document.querySelector('#orders');
const toolbar=document.querySelector('.toolbar');
const viewTabs=document.querySelector('.view-tabs');
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const labelDate=value=>new Date(value+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const timeKey=value=>String(value).slice(0,5);
const endDate=()=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+60);return d;};
const serviceConfig={midi:{start:660,end:840,label:'Midi'},soir:{start:1050,label:'Soir'}};
function serviceEnd(date,period){if(period==='midi')return serviceConfig.midi.end;const day=date.getDay();return(day===0||day===6)?1320:1260;}
function intervals(date,period){
  const cfg=serviceConfig[period],end=serviceEnd(date,period),rows=[];
  const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')+':00';
  for(let t=cfg.start;t<end;t+=15)rows.push({service_date:dateKey(date),start_time:fmt(t),end_time:fmt(t+15),max_orders:10,max_preparation_minutes:45,active:true});
  return rows;
}
function showPanel(){
  const show=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!show);
  openingPanel?.classList.add('hidden');
  orders.classList.toggle('hidden',show);
  viewTabs.classList.toggle('hidden',show);
  toolbar.classList.toggle('hidden',show);
  slotsTab.setAttribute('aria-pressed',String(show));
  slotsTab.textContent=show?'Retour aux commandes':'Planning par date';
  if(show)loadSlots();
}
slotsTab.textContent='Planning par date';
slotsTab.addEventListener('click',showPanel);
async function loadSlots(){
  status.textContent='Chargement des services sur 60 jours…';
  const from=dateKey(new Date()),to=dateKey(endDate());
  const{data,error}=await supabase.from('service_slots').select('id,service_date,start_time,end_time,active,max_preparation_minutes')
    .gte('service_date',from).lte('service_date',to).order('service_date').order('start_time');
  if(error){status.textContent='Erreur de chargement : '+error.message;list.innerHTML='';return;}
  renderDates(data||[],from,to);
}
function renderDates(slots,from,to){
  const byService=new Map();
  for(const slot of slots){
    const period=timeKey(slot.start_time)<'15:00'?'midi':'soir',key=slot.service_date+'|'+period;
    if(!byService.has(key))byService.set(key,[]);
    byService.get(key).push(slot);
  }
  const dates=[],start=new Date(from+'T12:00:00'),end=new Date(to+'T12:00:00');
  for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))dates.push(dateKey(d));
  list.innerHTML='<div class="service-plan-head"><span>Date</span><span>Midi</span><span>Soir</span></div>'+dates.map(date=>{
    const cells=['midi','soir'].map(period=>{
      const rows=byService.get(date+'|'+period)||[],enabled=rows.some(s=>s.active),exists=rows.length>0;
      const label=enabled?'Ouvert':(exists?'Fermé':'Non généré');
      return `<div class="service-plan-cell"><button type="button" class="service-toggle ${enabled?'is-open':''}" data-date="${date}" data-period="${period}" aria-pressed="${enabled}" aria-label="${labelDate(date)} — ${serviceConfig[period].label} : ${label}">${label}</button><small>${exists?rows.length+' créneaux':' '}</small></div>`;
    }).join('');
    return `<div class="service-plan-row"><strong>${labelDate(date)}</strong>${cells}</div>`;
  }).join('');
  list.querySelectorAll('[data-date][data-period]').forEach(button=>button.addEventListener('click',()=>toggleService(button)));
  status.textContent='Planning par date : '+dates.length+' jours. Activez séparément le midi et le soir pour chaque date.';
}
async function toggleService(button){
  const date=button.dataset.date,period=button.dataset.period,nextOpen=button.getAttribute('aria-pressed')!=='true';
  const generated=intervals(new Date(date+'T12:00:00'),period);
  const fromTime=generated[0].start_time,toTime=generated[generated.length-1].end_time;
  button.disabled=true;
  status.textContent=(nextOpen?'Ouverture':'Fermeture')+' du service '+period+' du '+labelDate(date)+'…';
  try{
    if(nextOpen){
      for(let i=0;i<generated.length;i+=250){
        const{error}=await supabase.from('service_slots').upsert(generated.slice(i,i+250),{onConflict:'service_date,start_time,end_time',ignoreDuplicates:true});
        if(error)throw error;
      }
    }
    const{error}=await supabase.from('service_slots').update({active:nextOpen}).eq('service_date',date).gte('start_time',fromTime).lt('start_time',timeKey(toTime));
    if(error)throw error;
    await loadSlots();
    status.textContent='Service '+period+' du '+labelDate(date)+' : '+(nextOpen?'ouvert':'fermé')+'.';
  }catch(error){status.textContent='Erreur : '+(error?.message||String(error));}
  finally{button.disabled=false;}
}
