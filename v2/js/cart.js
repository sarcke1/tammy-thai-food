// V2 — CART MODULE
// Chaque plat ajouté est une unité indépendante.

const STORAGE_KEY = 'tammy-v2-cart';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function normalizeItems() {
  items = items.map((item, index) => ({
    ...item,
    key: item.key || `${item.id || 'item'}::${Date.now()}::${index}`,
    quantity: 1,
    spice: Number(item.spice || 0),
    protein: item.protein || '',
    photo: item.photo || '',
    fixedSpice: item.fixedSpice ?? null
  }));
}

normalizeItems();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cart:updated', {
    detail: getCart()
  }));
}

export function isNemsPromo(item){
  return String(item?.name||"").trim().toLowerCase()==="nems maison";
}

export function promoBonus(quantity){
  const q=Math.max(0,Number(quantity)||0);
  return Math.floor(q/4);
}

export function promoDeliveredQuantity(quantity){
  const q=Math.max(0,Number(quantity)||0);
  return q+promoBonus(q);
}

export const getCart = () => [...items];

export function addToCart(dish, spice = 0, protein = '') {
  items.push({
    key: `${dish.id}::${Date.now()}::${Math.random().toString(36).slice(2,8)}`,
    id: dish.id,
    name: dish.name,
    price: dish.price,
    photo: dish.photo || '',
    spicy: Boolean(dish.spicy),
    spice: dish.spicy ? Math.max(0, Math.min(3, Number(spice)||0)) : 0,
    fixedSpice: dish.fixedSpice ?? null,
    protein,

    quantity: 1
  });

  persist();
}

export function updateSpice(key, spice) {
  const item = items.find(i => i.key === key);
  if (!item || !item.spicy || item.fixedSpice != null) return;
  item.spice = Math.max(0, Math.min(3, Number(spice)||0));
  persist();
}

export function removeItem(key) {
  items = items.filter(i => i.key !== key);
  persist();
}

export function clearCart() {
  items = [];
  persist();
}

export const cartCount = () => {
  const grouped=new Map();
  items.forEach(item=>{
    const key=String(item.id||item.name||'item');
    grouped.set(key,(grouped.get(key)||0)+1);
  });
  let total=0;
  grouped.forEach((quantity,key)=>{
    const item=items.find(i=>String(i.id||i.name||'item')===key);
    total += item && isNemsPromo(item)
      ? promoDeliveredQuantity(quantity)
      : quantity;
  });
  return total;
};
export const cartTotal = () => items.reduce((s,i)=>s+Number(i.price||0),0);
