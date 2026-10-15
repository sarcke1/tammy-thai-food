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
    select.innerHTML='<option value="" selected disabled>Choisissez une date de retrait</option>'+dates.map(date=>`<option value="${formatDateForDatabase(date)}">${getPickupLabel(date)} (midi)</option>`).join("");
    const details=checkoutForm.querySelector("#checkout-details");
    if(details)details.hidden=!select.value;
  }catch(error){
    select.innerHTML='<option value="" selected disabled>Aucune date disponible</option>';
    select.title=error.message;
    const details=checkoutForm.querySelector("#checkout-details");
    if(details)details.hidden=true;
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

      <label class="checkout-pickup">
        <strong>1. Choisissez votre date de retrait</strong>
        <select name="pickup_date" id="pickup-date" required>
          <option value="" selected disabled>Vérification des ouvertures…</option>
        </select>
      </label>

      <div id="checkout-details" hidden>
      <h3>2. Vos informations</h3>

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

    </div>
  `;

  panel.insertBefore(box, cartContent);
  checkoutForm = box;
  refreshPickupLabel();

  document.addEventListener("cart:updated", updateCheckoutVisibility);
  box.querySelector("#pickup-date")?.addEventListener("change", event => {
    const details=box.querySelector("#checkout-details");
    if(details)details.hidden=!event.target.value;
    if(event.target.value){
      // Garder le début du formulaire visible au-dessus du clavier mobile.
      requestAnimationFrame(()=>{
        panel.scrollTo({top:0,behavior:"smooth"});
        const nameField=box.querySelector('[name="customer_name"]');
        nameField?.focus({preventScroll:true});
        requestAnimationFrame(()=>panel.scrollTo({top:0,behavior:"smooth"}));
      });
    }
  });

  box.querySelector("[data-back-to-cart]")?.addEventListener("click", () => {
    checkoutForm.hidden = true;
    cartContent.hidden = false;
    panel.scrollTo({ top: 0, behavior: "smooth" });
  });

  box.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = box.querySelector("#order-status");
    if (status) {
      status.textContent = "Le panier V3 fonctionne, mais l’envoi des commandes publiques sera activé après la configuration des créneaux et du traitement des commandes.";
    }
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
    // Ne pas ouvrir le clavier avant que le client ait choisi son retrait.
    checkoutForm.querySelector("#pickup-date")?.focus({preventScroll:true});
  });
}

document.addEventListener("checkout:mount", () => {
  mountCheckout();
});

document.addEventListener("checkout:open", openCheckout);

mountCheckout();

