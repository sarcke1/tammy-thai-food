const dishes=[
{id:"pad",name:"Pad Thaï",price:11,emoji:"🍜",desc:"Nouilles de riz sautées, sauce thaï, légumes et garniture."},
{id:"jour",name:"Plat thaï du jour",price:9,emoji:"🍛",desc:"Une recette thaïlandaise authentique préparée en petite quantité."},
{id:"kids",name:"Menu enfant",price:6,emoji:"🍗",desc:"2 pilons de poulet frit + frites, ou 2 nems + riz."},
{id:"nems",name:"Nems",price:1,emoji:"🥢",desc:"Nems croustillants, à l’unité."},
{id:"samoussa",name:"Samoussa",price:1.5,emoji:"🥟",desc:"Samoussa croustillant, à l’unité."},
{id:"spring",name:"Spring roll",price:3,emoji:"🌯",desc:"Rouleau frais préparé avec les ingrédients du jour."},
{id:"mango",name:"Sticky rice mangue",price:4,emoji:"🥭",desc:"Riz gluant au lait de coco et mangue."},
{id:"drink",name:"Boisson",price:2,emoji:"🥤",desc:"Eau ou soda."}
];
let cart=[],orders=[];
const euro=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const $=s=>document.querySelector(s);

function renderMenu(){$("#menu-grid").innerHTML=dishes.map(d=>`<article class="card"><div class="pic">${d.emoji}</div><div class="cardbody"><h3>${d.name}</h3><p>${d.desc}</p><div class="cardfoot"><b>${euro(d.price)}</b><button class="btn add" onclick="add('${d.id}')">Ajouter</button></div></div></article>`).join("")}
function add(id){let x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});renderCart();toast("Plat ajouté au panier")}
function remove(id){let x=cart.find(i=>i.id===id);if(!x)return;x.qty--;if(x.qty<1)cart=cart.filter(i=>i.id!==id);renderCart()}
function renderCart(){let el=$("#cart-items");if(!cart.length)el.innerHTML='<p class="muted">Votre panier est vide.</p>';else el.innerHTML=cart.map(i=>{let d=dishes.find(x=>x.id===i.id);return `<div class="line"><span>${i.qty} × ${d.name}</span><button onclick="remove('${d.id}')">−</button></div>`}).join("");let total=cart.reduce((s,i)=>s+dishes.find(d=>d.id===i.id).price*i.qty,0);$("#cart-total").textContent=euro(total);$("#checkout").disabled=!cart.length}
function checkout(){let total=cart.reduce((s,i)=>s+dishes.find(d=>d.id===i.id).price*i.qty,0);let mins=8+cart.reduce((s,i)=>s+i.qty*3,0);orders.push({id:"#"+String(Date.now()).slice(-4),status:"waiting",ready:Date.now()+mins*60000,total,items:cart.map(i=>({...i,name:dishes.find(d=>d.id===i.id).name}))});cart=[];renderCart();renderQueue();toast("Commande ajoutée à la file");$("#tammy").scrollIntoView({behavior:"smooth"})}
function renderQueue(){let q=$("#queue");if(!orders.length){q.innerHTML='<p class="muted">La file de préparation apparaîtra ici.</p>'}else q.innerHTML=orders.map(o=>{let eta=new Date(o.ready).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});let text={waiting:"En attente",cooking:"En préparation",ready:"Prête"}[o.status];let items=o.items.map(i=>`${i.qty} × ${i.name}`).join(" · ");let action=o.status==="waiting"?`<button class="btn" onclick="start('${o.id}')">Commencer</button>`:o.status==="cooking"?`<button class="btn" onclick="ready('${o.id}')">Commande prête</button>`:`<span class="pill">Client prévenu</span>`;return `<div class="order ${o.status}"><div><b>${o.id} · ${text}</b><div>${items}</div><small>Estimation : ${eta} · ${euro(o.total)}</small></div><div class="actions">${action}</div></div>`}).join("");$("#waiting").textContent=orders.filter(o=>o.status==="waiting").length;$("#cooking").textContent=orders.filter(o=>o.status==="cooking").length;$("#ready").textContent=orders.filter(o=>o.status==="ready").length;$("#count").textContent=`${orders.length} commande${orders.length>1?"s":""}`}
function start(id){let o=orders.find(x=>x.id===id);o.status="cooking";renderQueue();toast("🔥 "+id+" est en préparation")}
function ready(id){let o=orders.find(x=>x.id===id);o.status="ready";renderQueue();toast("✅ "+id+" est prête")}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
$("#checkout").onclick=checkout;renderMenu();renderCart();renderQueue();
