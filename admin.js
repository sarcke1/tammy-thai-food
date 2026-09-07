let orders=[];
const $=s=>document.querySelector(s);
const euro=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});

function load(){try{return JSON.parse(localStorage.getItem("tammyOrders")||"[]")}catch{return[]}}
function save(){localStorage.setItem("tammyOrders",JSON.stringify(orders))}
function login(){if($("#pin").value==="2026"){sessionStorage.setItem("tammyAdmin","1");show()}else toast("Code incorrect")}
function logout(){sessionStorage.removeItem("tammyAdmin");$("#dashboard").hidden=true;$("#login").hidden=false}
function show(){$("#login").hidden=true;$("#dashboard").hidden=false;render()}
function render(){
  orders=load();
  $("#waiting").textContent=orders.filter(o=>o.status==="waiting").length;
  $("#cooking").textContent=orders.filter(o=>o.status==="cooking").length;
  $("#ready").textContent=orders.filter(o=>o.status==="ready").length;
  $("#admin-queue").innerHTML=orders.length?orders.map(o=>{
    const text={waiting:"En attente",cooking:"En préparation",ready:"Prête"}[o.status];
    const items=o.items.map(i=>`${i.qty} × ${i.name}${i.spice?` · ${i.spice}/3 🌶️`:""}`).join(" · ");
    const action=o.status==="waiting"?`<button class="btn" onclick="start('${o.id}')">🔥 Commencer</button>`:o.status==="cooking"?`<button class="btn" onclick="ready('${o.id}')">✅ Commande prête</button>`:`<span class="pill">Client prévenu</span>`;
    return `<article class="order ${o.status}"><div><b>${o.id} · ${text}</b><div>${items}</div><small>Retrait ${o.slot} · ${euro(o.total)} · estimation ~${o.estimatedMinutes||"—"} min</small></div><div class="actions">${action}</div></article>`
  }).join(""):"<p class='muted'>Aucune commande.</p>"
}
function start(id){orders=load();const o=orders.find(x=>x.id===id);if(!o)return;o.status="cooking";o.startedAt=Date.now();save();render();toast("🔥 "+id+" en préparation")}
function ready(id){orders=load();const o=orders.find(x=>x.id===id);if(!o)return;o.status="ready";o.readyAt=Date.now();save();render();toast("✅ "+id+" prête")}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
if(sessionStorage.getItem("tammyAdmin")==="1")show();
setInterval(()=>{if(!$("#dashboard").hidden)render()},1000);