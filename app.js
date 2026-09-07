const dishes=[
{id:"pad",name:"Pad Thaï",price:11,emoji:"🍜",desc:"Nouilles de riz sautées, sauce thaï, légumes et garniture.",spicy:true},
{id:"jour",name:"Plat thaï du jour",price:9,emoji:"🍛",desc:"Une recette thaïlandaise authentique préparée en petite quantité.",spicy:true},
{id:"kids",name:"Menu enfant",price:6,emoji:"🍗",desc:"2 pilons de poulet frit + frites, ou 2 nems + riz.",spicy:false},
{id:"nems",name:"Nems",price:1,emoji:"🥢",desc:"Nems croustillants, à l’unité.",spicy:false},
{id:"samoussa",name:"Samoussa",price:1.5,emoji:"🥟",desc:"Samoussa croustillant, à l’unité.",spicy:false},
{id:"spring",name:"Spring roll",price:3,emoji:"🌯",desc:"Rouleau frais préparé avec les ingrédients du jour.",spicy:false},
{id:"mango",name:"Sticky rice mangue",price:4,emoji:"🥭",desc:"Riz gluant au lait de coco et mangue.",spicy:false},
{id:"drink",name:"Boisson",price:2,emoji:"🥤",desc:"Eau ou soda.",spicy:false}
];

const SERVICE_WINDOWS=[{label:"Service midi",start:"11:30",end:"14:00"},{label:"Service soir",start:"18:30",end:"21:00"}];

// Première logique de charge cuisine : une commande n'est plus estimée uniquement
// au nombre d'articles. Les produits sont regroupés par famille afin de tenir
// compte des préparations qui peuvent être mutualisées (ex. plusieurs Pad Thaï).
const PREP={
  pad:{base:8,extra:2,group:"wok"},
  jour:{base:7,extra:2,group:"wok"},
  kids:{base:5,extra:1.5,group:"friture"},
  nems:{base:2,extra:.5,group:"friture"},
  samoussa:{base:2,extra:.5,group:"friture"},
  spring:{base:1.5,extra:.3,group:"froid"},
  mango:{base:2,extra:.5,group:"dessert"},
  drink:{base:.5,extra:.2,group:"boisson"}
};

let cart=[],orders=[],selectedSpice={};
const euro=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const $=s=>document.querySelector(s);

function renderMenu(){
  $("#menu-grid").innerHTML=dishes.map(d=>{
    const qty=cart.filter(i=>i.id===d.id).reduce((s,i)=>s+i.qty,0);
    const spice=selectedSpice[d.id]||0;
    return `<article class="card"><div class="pic">${d.emoji}</div><div class="cardbody"><div class="dish-title"><h3>${d.name}</h3><b>${euro(d.price)}</b></div><p>${d.desc}</p>${d.spicy?`<div class="spice-row"><span class="control-label">Épicé</span><button class="mini" onclick="changeSpice('${d.id}',-1)">−</button><span class="peppers">${[0,1,2].map(n=>`<span class="${n<spice?'active':''}">🌶️</span>`).join("")}</span><button class="mini" onclick="changeSpice('${d.id}',1)">+</button><span class="spice-level">${spice}/3</span></div>`:""}<div class="qty-row"><span class="control-label">Quantité</span><button class="qty" onclick="removeOne('${d.id}')">−</button><strong>${qty}</strong><button class="qty" onclick="add('${d.id}')">+</button></div></div></article>`
  }).join("")
}

function changeSpice(id,delta){selectedSpice[id]=Math.max(0,Math.min(3,(selectedSpice[id]||0)+delta));renderMenu()}
function add(id){const spice=selectedSpice[id]||0;const existing=cart.find(i=>i.id===id&&i.spice===spice);if(existing)existing.qty++;else cart.push({id,qty:1,spice});renderAll();toast("Plat ajouté au panier")}
function removeOne(id){const items=cart.filter(i=>i.id===id).sort((a,b)=>b.spice-a.spice);const item=items[0];if(!item)return;item.qty--;if(item.qty<=0)cart=cart.filter(i=>i!==item);renderAll()}
function cartTotal(){return cart.reduce((s,i)=>s+dishes.find(d=>d.id===i.id).price*i.qty,0)}
function cartCount(){return cart.reduce((s,i)=>s+i.qty,0)}
function renderCart(){const total=cartTotal(),count=cartCount();$("#top-total").textContent=euro(total);$("#top-count").textContent=`${count} article${count>1?"s":""}`}
function renderAll(){renderMenu();renderCart()}

function getCurrentService(){const now=new Date(),minutes=now.getHours()*60+now.getMinutes();return SERVICE_WINDOWS.find(w=>{const [sh,sm]=w.start.split(":").map(Number),[eh,em]=w.end.split(":").map(Number);return minutes>=sh*60+sm&&minutes<eh*60+em})}
function getNextService(){const now=new Date(),minutes=now.getHours()*60+now.getMinutes();return SERVICE_WINDOWS.find(w=>{const [sh,sm]=w.start.split(":").map(Number);return minutes<sh*60+sm})||SERVICE_WINDOWS[0]}
function makeSlots(service){const slots=[];let[h,m]=service.start.split(":").map(Number);const[eh,em]=service.end.split(":").map(Number),end=eh*60+em;while(h*60+m<=end-15){slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);m+=15;if(m>=60){h++;m-=60}}return slots}

function workloadForOrder(order,previousOrders=[]){
  const previousDishCounts={};
  previousOrders.filter(o=>o.status!=="ready").forEach(o=>o.items.forEach(i=>previousDishCounts[i.id]=(previousDishCounts[i.id]||0)+i.qty));
  let minutes=0;
  order.items.forEach(item=>{
    const p=PREP[item.id]||{base:3,extra:1,group:"other"};
    const qty=item.qty||1;
    const shared=previousDishCounts[item.id]>0;
    // Le premier exemplaire d'un plat déjà présent dans la file bénéficie
    // d'un petit gain de temps car Tammy peut mutualiser la préparation.
    minutes += (shared ? p.base*.7 : p.base) + Math.max(0,qty-1)*p.extra;
  });
  return Math.max(1,Math.ceil(minutes));
}

function queueProjection(){
  let elapsed=0;
  const active=orders.filter(o=>o.status!=="ready").sort((a,b)=>a.createdAt-b.createdAt);
  return active.map((order,index)=>{
    const previous=active.slice(0,index);
    const work=workloadForOrder(order,previous);
    elapsed+=work;
    return {order,work,wait:Math.ceil(elapsed)};
  });
}

function estimateMinutesForCart(){
  const temp={items:cart};
  const waiting=orders.filter(o=>o.status!=="ready");
  return Math.max(1,workloadForOrder(temp,waiting)+queueProjection().reduce((s,x)=>s+x.work,0));
}

function openCheckout(){
  if(!cart.length){toast("Votre panier est vide");return}
  const modal=$("#checkout-modal"),service=getCurrentService()||getNextService(),current=getCurrentService();
  $("#modal-total").textContent=euro(cartTotal());
  $("#modal-wait").textContent=`~${estimateMinutesForCart()} min`;
  $("#service-info").textContent=current?`Service en cours : ${service.label}, jusqu'à ${service.end}.`:`Prochain service : ${service.label}, ${service.start}–${service.end}.`;
  $("#slot").innerHTML=makeSlots(service).map(s=>`<option value="${s}">${s}</option>`).join("");
  modal.classList.add("show");modal.setAttribute("aria-hidden","false")
}
function closeCheckout(){const modal=$("#checkout-modal");modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}

function placeOrder(){
  const slot=$("#slot").value,id="#"+String(Date.now()).slice(-4);
  const estimatedMinutes=estimateMinutesForCart();
  const order={id,status:"waiting",slot,estimatedMinutes,createdAt:Date.now(),total:cartTotal(),items:cart.map(i=>({...i,name:dishes.find(d=>d.id===i.id).name}))};
  orders.push(order);cart=[];closeCheckout();renderAll();renderQueue();renderTracking(order);toast(`✅ ${id} commandée — créneau ${slot}`);setTimeout(()=>$("#suivi").scrollIntoView({behavior:"smooth"}),200)
}

function renderTracking(order){
  if(!order){$("#client-status").textContent="Aucune commande";$("#client-tracking").innerHTML='<p class="muted">Votre commande apparaîtra ici après validation.</p>';return}
  const projection=queueProjection().find(x=>x.order===order);
  const text={waiting:"En attente",cooking:"🔥 Tammy prépare votre commande",ready:"✅ Votre commande est prête"}[order.status];
  const steps=[["waiting","En attente"],["cooking","Préparation"],["ready","Prête"]],current=["waiting","cooking","ready"].indexOf(order.status);
  $("#client-status").textContent=text;
  $("#client-tracking").innerHTML=`<div class="tracking-top"><div><span>Commande ${order.id}</span><h3>${text}</h3></div><strong>Retrait ${order.slot}</strong></div><div class="progress">${steps.map((s,i)=>`<div class="${i<=current?'done':''}"><span>${i<=current?'✓':i+1}</span><small>${s[1]}</small></div>`).join("")}</div><div class="tracking-message">${order.status==="waiting"?`⏱️ Position dans la file : <b>${projection?queueProjection().indexOf(projection)+1:"—"}</b>. Temps estimé : <b>~${projection?projection.wait:order.estimatedMinutes} min</b>.`:order.status==="cooking"?`🔥 <b>Votre commande est en cours de préparation.</b> Tammy est en cuisine.`:`🟢 <b>Votre commande est prête.</b> Vous pouvez venir la récupérer.`}</div>`
}

function renderQueue(){
  const q=$("#queue"),projection=queueProjection();
  if(!orders.length)q.innerHTML='<p class="muted">La file de préparation apparaîtra ici.</p>';
  else q.innerHTML=orders.map(o=>{
    const p=projection.find(x=>x.order===o),text={waiting:"En attente",cooking:"En préparation",ready:"Prête"}[o.status];
    const items=o.items.map(i=>`${i.qty} × ${i.name}${i.spice?` · ${i.spice}/3 🌶️`:""}`).join(" · ");
    const action=o.status==="waiting"?`<button class="btn" onclick="start('${o.id}')">Commencer</button>`:o.status==="cooking"?`<button class="btn" onclick="ready('${o.id}')">Commande prête</button>`:`<span class="pill">Client prévenu</span>`;
    const estimate=p?`Position ${projection.indexOf(p)+1} · charge cuisine ~${p.work} min · estimation cumulée ~${p.wait} min`:`Terminée`;
    return `<div class="order ${o.status}"><div><b>${o.id} · ${text}</b><div>${items}</div><small>Retrait : ${o.slot} · ${euro(o.total)} · ${estimate}</small></div><div class="actions">${action}</div></div>`
  }).join("");
  $("#waiting").textContent=orders.filter(o=>o.status==="waiting").length;$("#cooking").textContent=orders.filter(o=>o.status==="cooking").length;$("#ready").textContent=orders.filter(o=>o.status==="ready").length;$("#count").textContent=`${orders.length} commande${orders.length>1?"s":""}`
}

function start(id){const o=orders.find(x=>x.id===id);if(!o)return;o.status="cooking";o.startedAt=Date.now();renderQueue();renderTracking(o);toast("🔥 "+id+" — préparation commencée")}
function ready(id){const o=orders.find(x=>x.id===id);if(!o)return;o.status="ready";renderQueue();renderTracking(o);toast("✅ "+id+" — commande prête")}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2300)}

renderAll();renderQueue();
