import { supabase } from '../js/supabase.js';

const $=s=>document.querySelector(s);
const statusEl=$('#accounting-status');
let orders=[],expenses=[],recipes=[],products=[],loaded=false;

const money=n=>Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toLocaleDateString('en-CA');
function dateRange(){
 const start=$('#accounting-start').value||'2000-01-01';
 const end=$('#accounting-end').value||today();
 return {start,end};
}
function isIncluded(o){
 if(o.sales_channel==='colleague')return o.status!=='cancelled';
 if(o.sales_channel!=='public')return false;
 return o.payment_status==='paid';
}
function provider(o){
 if(o.sales_channel==='colleague')return 'Espèces — collègues';
 const p=String(o.payment_provider||'').toLowerCase();
 if(p==='cash')return 'Espèces';
 if(p==='stripe')return 'Carte bancaire';
 if(p==='paypal')return 'PayPal / autre';
 return 'À régulariser';
}
function filteredOrders(){
 const {start,end}=dateRange();
 return orders.filter(o=>{const d=String(o.created_at||'').slice(0,10);return d>=start&&d<=end;});
}
function filteredExpenses(){
 const {start,end}=dateRange();
 return expenses.filter(e=>e.expense_date>=start&&e.expense_date<=end);
}
function kpi(label,value){return '<div class="accounting-kpi"><span>'+safe(label)+'</span><strong>'+money(value)+'</strong></div>';}
function render(){
 const periodOrders=filteredOrders(),periodExpenses=filteredExpenses();
 const colleague=periodOrders.filter(o=>o.sales_channel==='colleague'&&isIncluded(o));
 const pub=periodOrders.filter(o=>o.sales_channel==='public'&&isIncluded(o));
 const colleagueTotal=colleague.reduce((s,o)=>s+Number(o.total||0),0);
 const publicTotal=pub.reduce((s,o)=>s+Number(o.total||0),0);
 const expenseTotal=periodExpenses.reduce((s,e)=>s+Number(e.amount_ttc||0),0);
 const cashPublic=pub.filter(o=>provider(o)==='Espèces').reduce((s,o)=>s+Number(o.total||0),0);
 const card=pub.filter(o=>provider(o)==='Carte bancaire').reduce((s,o)=>s+Number(o.total||0),0);
 const other=pub.filter(o=>provider(o)==='PayPal / autre').reduce((s,o)=>s+Number(o.total||0),0);
 const unknown=pub.filter(o=>provider(o)==='À régulariser');
 const refunded=periodOrders.filter(o=>o.sales_channel==='public'&&o.payment_status==='refunded').reduce((s,o)=>s+Number(o.total||0),0);
 $('#accounting-summary').innerHTML=[
  kpi('CA collègues — espèces',colleagueTotal),kpi('CA clients V3',publicTotal),kpi('Dépenses saisies',expenseTotal),kpi('Résultat de gestion provisoire',colleagueTotal+publicTotal-expenseTotal)
 ].join('');
 const rows=[
  ['V2 collègues — espèces',colleague.length,colleagueTotal],
  ['V3 — espèces',pub.filter(o=>provider(o)==='Espèces').length,cashPublic],
  ['V3 — carte bancaire',pub.filter(o=>provider(o)==='Carte bancaire').length,card],
  ['V3 — PayPal / autre',pub.filter(o=>provider(o)==='PayPal / autre').length,other],
  ['V3 — paiements à régulariser',unknown.length,unknown.reduce((s,o)=>s+Number(o.total||0),0)],
  ['V3 — remboursements signalés',periodOrders.filter(o=>o.sales_channel==='public'&&o.payment_status==='refunded').length,refunded]
 ];
 $('#accounting-sales').innerHTML='<h3>Recettes par origine et moyen de paiement</h3><p class="accounting-note">Les commandes V2 sont comptées en espèces selon votre consigne, indépendamment du statut de paiement enregistré. En V3, seules les commandes marquées payées sont incluses dans le chiffre d’affaires. Les remboursements sont isolés.</p><table class="accounting-table"><thead><tr><th>Origine / règlement</th><th>Commandes</th><th>Montant</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+safe(r[0])+'</td><td>'+r[1]+'</td><td>'+money(r[2])+'</td></tr>').join('')+'</tbody></table>'+(unknown.length?'<p class="accounting-alert">'+unknown.length+' commande(s) V3 payées ont un moyen de paiement non renseigné. Montant à régulariser : '+money(unknown.reduce((s,o)=>s+Number(o.total||0),0))+'.</p>':'');
 $('#accounting-expenses').innerHTML='<h3>Historique des dépenses — '+periodExpenses.length+'</h3>'+(periodExpenses.length?'<table class="accounting-table"><thead><tr><th>Date</th><th>Dépense</th><th>Règlement</th><th>Montant</th><th></th></tr></thead><tbody>'+periodExpenses.map(e=>'<tr><td>'+safe(e.expense_date)+'</td><td>'+safe(e.category)+'<br><span class="accounting-note">'+safe(e.description)+(e.supplier?' — '+safe(e.supplier):'')+'</span></td><td>'+safe(({cash:'Espèces',card:'Carte',transfer:'Virement',other:'Autre'})[e.payment_method]||e.payment_method)+'</td><td>'+money(e.amount_ttc)+'</td><td class="expense-row-actions"><button type="button" data-delete-expense="'+e.id+'">Supprimer</button></td></tr>').join('')+'</tbody></table>':'<p class="accounting-note">Aucune dépense sur cette période.</p>');
 renderProfitability(periodOrders);
 $('#accounting-expenses').querySelectorAll('[data-delete-expense]').forEach(b=>b.addEventListener('click',()=>deleteExpense(b.dataset.deleteExpense)));
}
function renderProfitability(periodOrders){
 const sales=new Map();
 periodOrders.filter(isIncluded).forEach(o=>(o.order_items||[]).forEach(it=>{
  const id=it.product_id||'name:'+it.product_name;
  const x=sales.get(id)||{name:it.product_name,qty:0,revenue:0};
  x.qty+=Number(it.quantity||0);x.revenue+=Number(it.line_total||0);sales.set(id,x);
 }));
 const recipeByProduct=new Map(recipes.map(r=>[r.product_id,r]));
 const lines=[...sales.entries()].map(([id,s])=>{
  const rec=recipeByProduct.get(id);
  const unit=Number(rec?.estimated_cost_eur)/(Number(rec?.yield_quantity)||1);
  const hasCost=Boolean(rec&&rec.estimated_cost_eur!==null&&Number.isFinite(unit));
  return {...s,cost:hasCost?unit*s.qty:null,margin:hasCost?s.revenue-unit*s.qty:null,status:rec?.cost_status||'non renseigné'};
 }).sort((a,b)=>(b.margin??-Infinity)-(a.margin??-Infinity));
 const known=lines.filter(x=>x.margin!==null);
 $('#accounting-profitability').innerHTML='<h3>Rentabilité estimée des plats</h3>'+(lines.length?'<table class="accounting-table"><thead><tr><th>Produit</th><th>Qté</th><th>CA</th><th>Coût matière estimé</th><th>Marge estimée</th></tr></thead><tbody>'+lines.map(x=>'<tr><td>'+safe(x.name)+'</td><td>'+x.qty+'</td><td>'+money(x.revenue)+'</td><td>'+(x.cost===null?'À renseigner':money(x.cost))+'</td><td>'+(x.margin===null?'—':money(x.margin))+'</td></tr>').join('')+'</tbody></table><p class="accounting-note">'+known.length+' produit(s) avec coût estimé exploitable sur '+lines.length+'.</p>':'<p class="accounting-note">Aucune vente sur la période.</p>');
}
async function load(){
 statusEl.textContent='Chargement des ventes, dépenses et coûts recettes…';
 const [o,e,r]=await Promise.all([
  supabase.from('orders').select('id,order_number,sales_channel,status,payment_status,payment_provider,total,created_at,order_items(product_id,product_name,quantity,line_total)').order('created_at',{ascending:false}),
  supabase.from('accounting_expenses').select('*').order('expense_date',{ascending:false}),
  supabase.from('product_recipes').select('product_id,estimated_cost_eur,yield_quantity,cost_status,recipe_name')
 ]);
 if(o.error||e.error||r.error){statusEl.textContent='Erreur de chargement : '+(o.error?.message||e.error?.message||r.error?.message);return;}
 orders=o.data||[];expenses=e.data||[];recipes=r.data||[];await Promise.all(expenses.map(async item=>{if(item.document_path){const signed=await supabase.storage.from('accounting-documents').createSignedUrl(item.document_path,3600);item.document_url=signed.data?.signedUrl||null;}}));loaded=true;render();statusEl.textContent='Données actualisées. Les montants sont exprimés en euros TTC.';
}
async function saveExpense(ev){
 ev.preventDefault();const form=ev.currentTarget;const formData=new FormData(form);const data=Object.fromEntries(formData.entries());const file=formData.get('document_file');delete data.document_file;data.amount_ttc=Number(data.amount_ttc);
 if(file&&file.size){const ext=(file.name.split('.').pop()||'file').toLowerCase().replace(/[^a-z0-9]/g,'');const path='expenses/'+crypto.randomUUID()+'.'+ext;const uploaded=await supabase.storage.from('accounting-documents').upload(path,file,{contentType:file.type,upsert:false});if(uploaded.error){statusEl.textContent='Erreur de dépôt du justificatif : '+uploaded.error.message;return;}data.document_path=path;}
 const {error}=await supabase.from('accounting_expenses').insert(data);
 if(error){if(data.document_path)await supabase.storage.from('accounting-documents').remove([data.document_path]);statusEl.textContent='Erreur : '+error.message;return;}
 form.reset();form.elements.expense_date.value=today();statusEl.textContent='Dépense enregistrée.';await load();
}
async function deleteExpense(id){
 if(!confirm('Supprimer cette dépense ?'))return;
 const item=expenses.find(e=>e.id===id);const {error}=await supabase.from('accounting_expenses').delete().eq('id',id);
 if(error){statusEl.textContent='Erreur de suppression : '+error.message;return;}
 if(item?.document_path)await supabase.storage.from('accounting-documents').remove([item.document_path]);await load();
}
function exportCsv(){
 const rows=[['Type','Date','Origine / catégorie','Description','Moyen de paiement','Montant EUR']];
 filteredOrders().filter(isIncluded).forEach(o=>rows.push(['Recette',String(o.created_at).slice(0,10),o.sales_channel==='colleague'?'V2 collègues':'V3 public','Commande '+o.order_number,provider(o),Number(o.total||0).toFixed(2)]));
 filteredExpenses().forEach(e=>rows.push(['Dépense',e.expense_date,e.category,[e.supplier,e.description].filter(Boolean).join(' — '),e.payment_method,Number(e.amount_ttc||0).toFixed(2)]));
 const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
 const a=document.createElement('a');a.href=url;a.download='tammy-thai-food-comptabilite-'+dateRange().start+'-'+dateRange().end+'.csv';a.click();URL.revokeObjectURL(url);
}
$('#expense-form').addEventListener('submit',saveExpense);
$('#expense-form').elements.expense_date.value=today();
$('#accounting-refresh').addEventListener('click',load);
$('#accounting-filter').addEventListener('click',render);
$('#accounting-export').addEventListener('click',exportCsv);
window.addEventListener('tammy:accounting-open',()=>{if(!loaded)load();});
