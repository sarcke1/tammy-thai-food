import { supabase } from '../js/supabase.js';

const tab=document.querySelector('#availability-tab');
const panel=document.querySelector('#availability-panel');
const status=document.querySelector('#availability-status');
const productsEl=document.querySelector('#availability-products');
const proteinsEl=document.querySelector('#availability-proteins');
const orders=document.querySelector('#orders');
const toolbar=document.querySelector('.toolbar');
const viewTabs=document.querySelector('.view-tabs');
const slotsPanel=document.querySelector('#slots-panel');
const openingPanel=document.querySelector('#opening-panel');
const slotsTab=document.querySelector('#slots-tab');
let products=[];
let proteins=[];
let loading=false;

function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function euro(value){return Number(value||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});}
function showPanel(){
  const show=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!show);
  slotsPanel?.classList.add('hidden');
  openingPanel?.classList.add('hidden');
  if(slotsTab){slotsTab.setAttribute('aria-pressed','false');slotsTab.textContent='Planning par date';}
  orders.classList.toggle('hidden',show);
  viewTabs.classList.toggle('hidden',show);
  toolbar.classList.toggle('hidden',show);
  tab.setAttribute('aria-pressed',String(show));
  tab.textContent=show?'Retour aux commandes':'Disponibilité';
  if(show)loadAvailability();
}
tab?.addEventListener('click',showPanel);

function renderProducts(){
  if(!products.length){productsEl.innerHTML='<div class="availability-empty">Aucun produit trouvé.</div>';return;}
  const sorted=[...products].sort((a,b)=>String(a.product_categories?.name||'').localeCompare(String(b.product_categories?.name||''),'fr')||a.name.localeCompare(b.name,'fr'));
  productsEl.innerHTML='<div class="availability-list">'+sorted.map(p=>`<div class="availability-row ${p.active?'':'is-unavailable'}"><div class="availability-row-main"><div class="availability-row-title">${escapeHtml(p.name)}</div><div class="availability-row-meta">${escapeHtml(p.product_categories?.name||'Sans catégorie')} · ${euro(p.price)}</div></div><label class="availability-switch"><input type="checkbox" data-product-id="${p.id}" ${p.active?'checked':''}><span>${p.active?'Disponible':'En rupture'}</span></label></div>`).join('')+'</div>';
  productsEl.querySelectorAll('[data-product-id]').forEach(input=>input.addEventListener('change',()=>saveProduct(input)));
}
function renderProteins(){
  proteinsEl.innerHTML='<div class="availability-list">'+proteins.map(p=>`<div class="availability-row ${p.available?'':'is-unavailable'}"><div class="availability-row-main"><div class="availability-row-title">${escapeHtml(p.protein_name)}</div><div class="availability-row-meta">${p.available?'Disponible dans les plats':'En rupture — choix désactivé'}</div></div><label class="availability-switch"><input type="checkbox" data-protein-name="${escapeHtml(p.protein_name)}" ${p.available?'checked':''}><span>${p.available?'Disponible':'En rupture'}</span></label></div>`).join('')+'</div>';
  proteinsEl.querySelectorAll('[data-protein-name]').forEach(input=>input.addEventListener('change',()=>saveProtein(input)));
}
async function loadAvailability(){
  if(loading)return;
  loading=true;
  status.textContent='Chargement des produits et des protéines…';
  const [productResult,proteinResult]=await Promise.all([
    supabase.from('products').select('id,name,price,active,sort_order,product_categories(name)').order('sort_order').order('name'),
    supabase.from('protein_availability').select('protein_name,available,updated_at').order('protein_name')
  ]);
  loading=false;
  if(productResult.error||proteinResult.error){
    status.textContent='Erreur de chargement : '+(productResult.error?.message||proteinResult.error?.message);
    return;
  }
  products=productResult.data||[];
  proteins=proteinResult.data||[];
  renderProducts();renderProteins();
  status.textContent='Disponibilités chargées. Chaque modification est enregistrée immédiatement.';
}
async function saveProduct(input){
  const item=products.find(p=>p.id===input.dataset.productId);
  if(!item)return;
  const previous=item.active,next=input.checked;
  input.disabled=true;status.textContent='Enregistrement de '+item.name+'…';
  const {data,error}=await supabase.from('products').update({active:next,updated_at:new Date().toISOString()}).eq('id',item.id).select('id,active').maybeSingle();
  input.disabled=false;
  if(error||!data){input.checked=previous;status.textContent='Erreur : '+(error?.message||'aucune ligne mise à jour');return;}
  item.active=data.active;renderProducts();
  status.textContent=item.name+' : '+(item.active?'disponible':'en rupture')+'.';
  document.dispatchEvent(new CustomEvent('availability:changed'));
}
async function saveProtein(input){
  const item=proteins.find(p=>p.protein_name===input.dataset.proteinName);
  if(!item)return;
  const previous=item.available,next=input.checked;
  input.disabled=true;status.textContent='Enregistrement de '+item.protein_name+'…';
  const {data,error}=await supabase.from('protein_availability').update({available:next,updated_at:new Date().toISOString()}).eq('protein_name',item.protein_name).select('protein_name,available,updated_at').maybeSingle();
  input.disabled=false;
  if(error||!data){input.checked=previous;status.textContent='Erreur : '+(error?.message||'aucune ligne mise à jour');return;}
  item.available=data.available;renderProteins();
  status.textContent=item.protein_name+' : '+(item.available?'disponible':'en rupture')+'.';
  document.dispatchEvent(new CustomEvent('availability:changed'));
}
document.querySelectorAll('.view-tab').forEach(button=>button.addEventListener('click',()=>{
  panel.classList.add('hidden');tab?.setAttribute('aria-pressed','false');if(tab)tab.textContent='Disponibilité';
}));
slotsTab?.addEventListener('click',()=>{panel.classList.add('hidden');tab?.setAttribute('aria-pressed','false');if(tab)tab.textContent='Disponibilité';});
