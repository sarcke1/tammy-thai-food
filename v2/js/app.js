// ===== TAMMY THAI FOOD V3.10 =====
// UI Renderer + Event Wiring

import { dishes as localDishes } from "./data.js?v=20260923-14";
import { spiceLabel } from "./spice.js";
import { supabase } from "./supabase.js";
import {
  addToCart,
  getCart,
  updateSpice,
  removeItem,
  clearCart,
  cartCount,
  cartTotal
} from "./cart.js?v=20260923-08";

let dishes = [...localDishes];

const euro = n =>
  Number(n).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR"
  });

const grid = document.querySelector("#menu-grid");
const categoryButtons = [...document.querySelectorAll(".category-row button")];

const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector("#cart-panel");
const cartContent = document.querySelector("#cart-content");
const cartCountEl = document.querySelector("#cart-count");

const cardStates = new Map();

const categoryOrder = {
  Plats: 1,
  Entrées: 2,
  Desserts: 3,
  Boissons: 4
};

// ===== Chargement Supabase =====

async function loadProductsFromSupabase(){

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      description,
      image_url,
      preparation_minutes,
      supports_spice,
      protein_options,
      product_categories(name)
    `)
    .eq("active", true);
  console.log("SUPABASE ERROR :", error);
console.table(data);

  if(error){
    console.warn("Fallback data.js :", error.message);
    return;
  }

  if(!data?.length){
    return;
  }

  dishes = data
    .map(product => {

     const local = localDishes.find(
  d => d.name.trim().toLowerCase() === product.name.trim().toLowerCase()
);
     return {
      id: product.id, // UUID Supabase à conserver
      name: product.name,
      price: Number(product.price),
      category: product.product_categories?.name || local?.category || "Plats",
      emoji: local?.emoji || "🍽️",
      photo: local?.photo ?? product.image_url ?? "",
      position: local?.position,
      desc: product.description || local?.desc || "",
      spicy: Boolean(product.supports_spice),
      proteinOptions: product.protein_options || local?.proteinOptions || [],
      preparation_minutes:
        product.preparation_minutes ??
        local?.preparation_minutes ??
        null,
      menuPosition: local ? localDishes.indexOf(local) : 999
    };

    })
    .sort((a,b)=>
      (categoryOrder[a.category]||99)-
      (categoryOrder[b.category]||99)||
      a.menuPosition-b.menuPosition
    );

  renderMenu(
    document.querySelector(".category-row .active")?.textContent.trim() ||
    "Tous"
  );
}

// ===== Photos =====

function photoStyle(d){

  if(!d.photo){
    return "background:linear-gradient(135deg,#e8dfca,#d5dfd2)";
  }

  return `
    background-image:url(${d.photo});
    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;
  `;
}
// ===== État des cartes =====

function getState(dish){

  if(!cardStates.has(dish.id)){
    cardStates.set(dish.id,{
      quantity:0,
      spices:[],
      protein:"",
      proteinQuantities:{}
    });
  }

  return cardStates.get(dish.id);
}

function syncSpices(state){

  while(state.spices.length<state.quantity){
    state.spices.push(0);
  }

  state.spices.length=state.quantity;
}

function setQuantity(dish,q){

  const state=getState(dish);

  state.quantity=Math.max(0,Math.min(20,q));

  syncSpices(state);
}

function setProteinQuantity(dish,protein,q){

  const state=getState(dish);

  state.proteinQuantities[protein]=Math.max(0,Math.min(20,q));

  state.quantity=Object.values(state.proteinQuantities)
    .reduce((a,b)=>a+Number(b),0);

  syncSpices(state);
}

// ===== Sélecteurs =====

function proteinSelector(dish){

  if(!dish.proteinOptions?.length){
    return "";
  }

  const state=getState(dish);

  return `
    <div class="spice-box protein-box">

      <div class="spice-box-title">
        Choix de la viande
      </div>

      ${dish.proteinOptions.map(option=>`

        <div class="spice-row protein-row" data-protein-row="${option}">

          <span>${option}</span>

          <div class="spice-row-controls">

            <button type="button" data-protein-delta="-1">−</button>

            <b>${state.proteinQuantities[option]||0}</b>

            <button type="button" data-protein-delta="1">+</button>

          </div>

        </div>

      `).join("")}

    </div>
  `;
}

function spiceRows(dish){

  if(!dish.spicy){
    return "";
  }

  const state=getState(dish);

  if(state.quantity===0){
    return `
      <div class="spice-box spice-box-empty">
        Sélectionnez une quantité.
      </div>
    `;
  }

  return `
    <div class="spice-box">

      <div class="spice-box-title">
        Choisissez le piment
      </div>

      ${state.spices.map((level,i)=>`

        <div class="spice-row" data-spice-row="${i}">

          <span>Plat ${i+1}</span>

          <div class="spice-row-controls">

            <button type="button" data-spice-delta="-1">−</button>

            <b>${spiceLabel(level)}</b>

            <button type="button" data-spice-delta="1">+</button>

          </div>

        </div>

      `).join("")}

    </div>
  `;
}

function quantityControl(dish){

  const state=getState(dish);

  return `
    <div class="quantity-row">

      <span>Quantité</span>

      <div class="quantity-controls">

        <button type="button" data-quantity-delta="-1">−</button>

        <b>${state.quantity}</b>

        <button type="button" data-quantity-delta="1">+</button>

      </div>

    </div>
  `;
}

// ===== Rendu menu =====

function renderMenu(category="Tous"){

  const visible=(category==="Tous"
    ? dishes
    : dishes.filter(d=>d.category===category)
  ).filter(Boolean);

  grid.innerHTML=visible.map(d=>{

    const state=getState(d);

    return `
      <article class="dish-card" data-dish-id="${d.id}">

        <div class="dish-photo" style="${photoStyle(d)}">

          ${d.spicy
            ? '<span class="dish-badge">🌶️ Piment au choix</span>'
            : ""}

        </div>

        <div class="dish-card-body">

          <div class="dish-title-row">

            <h3>${d.name}</h3>

            <span class="price">${euro(d.price)}</span>

          </div>

          <p>${d.desc}</p>

          ${proteinSelector(d)}

          ${quantityControl(d)}

          ${spiceRows(d)}

          <button
            class="button dish-action ${state.quantity===0?"is-disabled":""}"
            type="button"
            data-action="add"
            ${state.quantity===0?"disabled":""}>

            Ajouter au panier

          </button>

        </div>

      </article>
    `;

  }).join("");
}
// ===== Rendu panier =====

function renderCart(){

  const items=getCart();

  if(cartCountEl){
    cartCountEl.textContent=cartCount();
  }

  if(!items.length){

    cartContent.innerHTML=`
      <p class="empty-cart">
        Votre panier est vide.
      </p>
    `;

    document.dispatchEvent(
      new CustomEvent("checkout:mount")
    );

    return;
  }

  cartContent.innerHTML=
    items.map((item,index)=>`

      <div class="cart-line">

        <div class="cart-photo"
             style="background-image:url(${item.photo||""})">
        </div>

        <div class="cart-unit-info">

          <strong>${item.name}</strong>

          <small>#${index+1}</small>

          ${item.protein
            ? `<small>Viande : ${item.protein}</small>`
            : ""}

          ${item.spicy
            ? `
              <div class="cart-spice-control">

                <span>Piment</span>

                <button data-cart-key="${item.key}" data-spice-delta="-1">−</button>

                <b>${spiceLabel(item.spice)}</b>

                <button data-cart-key="${item.key}" data-spice-delta="1">+</button>

              </div>
            `
            : "<small>Sans piment</small>"}

          <span>${euro(item.price)}</span>

        </div>

        <button
          class="cart-remove"
          data-remove-key="${item.key}">
          ×
        </button>

      </div>

    `).join("")+

    `
      <div class="cart-total">

        <strong>Total</strong>

        <strong>${euro(cartTotal())}</strong>

      </div>

      <div class="cart-actions">

        <button
          class="button cart-validate"
          data-validate-cart>

          Valider le panier

        </button>

        <button
          class="secondary-cart-action"
          data-clear-cart>

          Vider le panier

        </button>

      </div>
    `;

  document.dispatchEvent(
    new CustomEvent("checkout:mount")
  );
}
// ===== Catégories =====

categoryButtons.forEach(button=>{

  button.addEventListener("click",()=>{

    categoryButtons.forEach(b=>b.classList.remove("active"));

    button.classList.add("active");

    renderMenu(button.textContent.trim());

  });

});

// ===== Clic sur une carte =====

grid?.addEventListener("click",event=>{

  const card=event.target.closest(".dish-card");
  if(!card)return;

  const dish=dishes.find(d=>String(d.id)===card.dataset.dishId);
  if(!dish)return;

  const state=getState(dish);

  const proteinBtn=event.target.closest("[data-protein-delta]");
  if(proteinBtn){

    const row=proteinBtn.closest("[data-protein-row]");

    const protein=row.dataset.proteinRow;

    setProteinQuantity(
      dish,
      protein,
      Number(state.proteinQuantities[protein]||0)+
      Number(proteinBtn.dataset.proteinDelta)
    );

    renderMenu(document.querySelector(".category-row .active").textContent.trim());

    return;
  }

  const qtyBtn=event.target.closest("[data-quantity-delta]");
  if(qtyBtn){

    setQuantity(
      dish,
      state.quantity+Number(qtyBtn.dataset.quantityDelta)
    );

    renderMenu(document.querySelector(".category-row .active").textContent.trim());

    return;
  }

  const spiceBtn=event.target.closest("[data-spice-delta]");
  if(spiceBtn){

    const row=spiceBtn.closest("[data-spice-row]");
    const index=Number(row.dataset.spiceRow);

    state.spices[index]=Math.max(
      0,
      Math.min(3,state.spices[index]+Number(spiceBtn.dataset.spiceDelta))
    );

    renderMenu(document.querySelector(".category-row .active").textContent.trim());

    return;
  }

  if(event.target.closest('[data-action="add"]')){

    let spiceIndex=0;

    if(dish.proteinOptions?.length){

      dish.proteinOptions.forEach(protein=>{

        const qty=Number(state.proteinQuantities[protein]||0);

        for(let i=0;i<qty;i++){

          addToCart(dish,state.spices[spiceIndex]||0,protein);

          spiceIndex++;

        }

      });

    }else{

      for(let i=0;i<state.quantity;i++){

        addToCart(dish,state.spices[i]||0);

      }

    }

    renderCart();

    cartPanel.classList.add("open");

  }

});

// ===== Boutons panier =====

cartContent?.addEventListener("click",event=>{

  const remove=event.target.closest("[data-remove-key]");
  if(remove){

    removeItem(remove.dataset.removeKey);

    renderCart();

    return;
  }

  const spice=event.target.closest("[data-spice-delta]");
  if(spice){

    const item=getCart().find(x=>x.key===spice.dataset.cartKey);

    if(item){
      updateSpice(item.key,item.spice+Number(spice.dataset.spiceDelta));
    }

    renderCart();

    return;
  }

  const clear=event.target.closest("[data-clear-cart]");
  if(clear){

    if(confirm("Vider complètement le panier ?")){

      clearCart();

      renderCart();

    }

    return;
  }

  const validate=event.target.closest("[data-validate-cart]");
  if(validate){

    document.dispatchEvent(
      new CustomEvent("checkout:open")
    );

    return;
  }

});

// ===== Ouverture/Fermeture panier =====

cartButton?.addEventListener("click",()=>{

  renderCart();

  cartPanel.classList.toggle("open");

});

document.querySelector("[data-cart-close]")?.addEventListener("click",()=>{

  cartPanel.classList.remove("open");

});

// ===== Synchronisation =====

document.addEventListener("cart:updated",()=>{

  renderCart();

  if(!getCart().length){

    cardStates.clear();

    renderMenu(
      document.querySelector(".category-row .active")?.textContent.trim() ||
      "Tous"
    );

  }

});

// ===== Initialisation =====

renderMenu();

renderCart();

loadProductsFromSupabase();
