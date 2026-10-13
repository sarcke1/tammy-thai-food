import { supabase } from './supabase.js';
import { getCart, clearCart } from './cart.js?v=20261013-01';

const panel = document.querySelector('#cart-panel');
const cartContent = document.querySelector('#cart-content');

let checkoutForm = null;

function updateCheckoutVisibility() {
  if(!checkoutForm)return;
  if(!getCart().length)checkoutForm.hidden=true;
  cartContent.hidden=Boolean(getCart().length&&!checkoutForm.hidden);
}

async function getAvailablePickupDates() {
  const { data, error } = await supabase.from("weekly_opening_hours").select("day_of_week,service_period,is_open");
  if (error) throw new Error("Impossible de vérifier les jours d’ouverture : " + error.message);
  const lunchRows = (data || []).filter(row => row.service_period === "midi");
  if (lunchRows.length !== 7) throw new Error("Le calendrier des ouvertures est incomplet. Réessayez plus tard.");
  const openLunchDays = new Set(lunchRows.filter(row => row.is_open).map(row => Number(row.day_of_week)));
  const now = new Date();
  const minimum = new Date(now);
  minimum.setHours(12,0,0,0);
  minimum.setDate(minimum.getDate() + (now.getHours() >= 18 ? 2 : 1));
  const monday = new Date(now);
  monday.setHours(12,0,0,0);
  monday.setDate(monday.getDate() - ((monday.getDay()+6)%7));
  const nextMonday = new Date(monday);
  nextMonday.setDate(nextMonday.getDate()+7);
  const dates=[];
  for(let candidate=new Date(monday);candidate<=nextMonday;candidate.setDate(candidate.getDate()+1)){
    const day=new Date(candidate);
    day.setHours(12,0,0,0);
    if(day>=minimum && openLunchDays.has(day.getDay())) dates.push(new Date(day));
  }
  if(!dates.length) throw new Error("Aucun retrait à midi n’est disponible dans la période proposée.");
  return dates;
}
function getPickupLabel(date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function formatDateForDatabase(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function refreshPickupLabel() {
  const select=checkoutForm?.querySelector("#pickup-date");
  if(!select)return;
  try{
    const dates=await getAvailablePickupDates();
    select.innerHTML=dates.map(date=>`<option value="${formatDateForDatabase(date)}">${getPickupLabel(date)} (midi)</option>`).join("");
  }catch(error){
    select.innerHTML='<option value="">Aucune date disponible</option>';
    select.title=error.message;
  }
}

function mountCheckout() {
  if (!panel || !cartContent || checkoutForm) return;

  const savedName = localStorage.getItem("customerName") || "";
  const savedEmail = localStorage.getItem("customerEmail") || "";

  const box = document.createElement("form");
  box.id = "order-form";
  box.hidden = true;

  box.innerHTML = `
    <div class="checkout-box">

      <h3>Vos informations</h3>

      <label class="checkout-pickup">
        Date de retrait
        <select name="pickup_date" id="pickup-date" required>
          <option value="">Vérification des ouvertures…</option>
        </select>
      </label>

      <input
        name="customer_name"
        placeholder="Nom"
        value="${savedName}"
        required
      >

      <input
        name="email"
        type="email"
        placeholder="Email personnel"
        value="${savedEmail}"
        required
      >
      
     <input
        name="phone"
        type="tel"
        placeholder="Téléphone (06 12 34 56 78)"
        value="${localStorage.getItem('customerPhone') || ''}"
        inputmode="tel"
        autocomplete="tel"
        required
        pattern="^(?:(?:[+]33|0033|0)[67](?: ?[0-9]){8})$"
        title="Entrez un numéro français valide (06 12 34 56 78 ou +33 6 12 34 56 78)."
      />
      <textarea
        name="comment"
        placeholder="Commentaire (facultatif)"
        rows="3"
      ></textarea>

      <button class="secondary-cart-action" type="button" data-back-to-cart>Retour au panier</button>

      <button class="button cart-submit" type="submit">
        Enregistrer la commande
      </button>

      <p id="order-status"></p>

    </div>
  `;

  panel.insertBefore(box, cartContent);
  checkoutForm = box;
  refreshPickupLabel();

  document.addEventListener("cart:updated", updateCheckoutVisibility);
  box.querySelector("[data-back-to-cart]")?.addEventListener("click", () => {
    checkoutForm.hidden = true;
    cartContent.hidden = false;
    panel.scrollTo({ top: 0, behavior: "smooth" });
  });

  box.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = box.querySelector("#order-status");
    const submit = box.querySelector("button");

    const formData = new FormData(box);
    const cartItems = getCart();

    if (!cartItems.length) {
      status.textContent = "Votre panier est vide.";
      updateCheckoutVisibility();
      return;
    }

    const customerName = String(formData.get("customer_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "")
      .replace(/\s+/g, "")
      .trim();
    const comment = String(formData.get("comment") || "").trim();
    
    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", phone);

    submit.disabled = true;
    status.textContent = "Vérification des jours d’ouverture…";
    let pickupDate;
    try{
      const dates=await getAvailablePickupDates();
      const selected=box.querySelector("#pickup-date").value;
      pickupDate=dates.find(date=>formatDateForDatabase(date)===selected);
      if(!pickupDate)throw new Error("Choisissez une date de retrait disponible.");
    }catch(error){
      status.textContent=error.message;
      submit.disabled=false;
      return;
    }
    const pickupLabel=`${getPickupLabel(pickupDate)} (midi)`;
    status.textContent = "Vérification des produits...";

    const { data: products, error: productsError } =
      await supabase
        .from("products")
        .select("id,name,protein_options");

    if (productsError) {
      status.textContent = "Erreur produits : " + productsError.message;
      submit.disabled = false;
      return;
    }

    const productsByName = new Map(
      (products || []).map(product => [
        product.name.trim().toLowerCase(),
        product
      ])
    );

    const items = [];

    for (const item of cartItems) {
      const product = productsByName.get(
        String(item.name).trim().toLowerCase()
      );

      if (!product) {
        status.textContent = "Produit introuvable : " + item.name;
        submit.disabled = false;
        return;
      }

      const spiceLevel = item.spicy
        ? Math.max(0, Math.min(3, Number(item.spice) || 0))
        : 0;
      const isNems = String(item.name).trim().toLowerCase().startsWith("nems maison");

      if (isNems) {
        const existingNems = items.find(entry => entry._nemsPromo && entry.product_id === product.id);
        if (existingNems) {
          existingNems.quantity += 1;
        } else {
          items.push({
            product_id: product.id,
            quantity: 1,
            spice_level: spiceLevel,
            protein: null,
            _nemsPromo: true
          });
        }
      } else {
        items.push({
          product_id: product.id,
          quantity: 1,
          spice_level: spiceLevel,
          protein: item.protein || (Array.isArray(product.protein_options) && product.protein_options.length === 1 ? product.protein_options[0] : null)
        });
      }
    }

    const rpcItems = items.map(({ _nemsPromo, ...item }) => item);
    status.textContent = "Enregistrement...";

    const { error } = await supabase.rpc(
      "create_pending_order",
      {
        p_first_name: customerName,
        p_last_name: "",
        p_email: email,
        p_phone: phone,
        p_service_slot_id: null,
        p_items: rpcItems,
        p_customer_note: comment,
        p_pickup_date: formatDateForDatabase(pickupDate)
      }
    );

    if (error) {
      status.textContent = "Erreur : " + error.message;
      submit.disabled = false;
      return;
    }
status.textContent = "Votre commande est transmise à Tammy.";

clearCart(); // Déclenche déjà cart:updated

// Message de confirmation
cartContent.innerHTML = `
  <div class="order-success">
    <div class="success-icon">✓</div>
    <h3>Commande transmise</h3>
    <p>Votre commande est en cours de préparation.</p>
    <p class="pickup-reminder">
      Retrait : <strong>${pickupLabel}</strong>
    </p>
  </div>
`;

box.reset();

box.querySelector('[name="customer_name"]').value = customerName;
box.querySelector('[name="email"]').value = email;
box.querySelector('[name="phone"]').value = phone;

submit.disabled = false;
box.hidden = true;

// Ferme le panier puis remet toute l'interface à zéro
setTimeout(() => {
  panel.classList.remove("open");
}, 2600);
});

updateCheckoutVisibility();
}


function openCheckout(){
  if (!getCart().length) return;

  // Le formulaire est créé une seule fois puis simplement affiché.
  // Cette fonction est volontairement indépendante du rendu du panier.
  if (!checkoutForm) {
    mountCheckout();
  }

  if (!checkoutForm) return;

  checkoutForm.hidden=false;
  cartContent.hidden=true;
  refreshPickupLabel();
  requestAnimationFrame(()=>{
    panel.scrollTo({top:0,behavior:"smooth"});
    checkoutForm.scrollIntoView({block:"start",behavior:"smooth"});
    checkoutForm.querySelector('[name="customer_name"]')?.focus();
  });
}

document.addEventListener("checkout:mount", () => {
  mountCheckout();
});

document.addEventListener("checkout:open", openCheckout);

mountCheckout();

