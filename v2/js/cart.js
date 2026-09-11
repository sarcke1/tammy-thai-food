// V2 — CART MODULE
// Cart state is isolated from the visual renderer.

const STORAGE_KEY = 'tammy-v2-cart';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }));
}

export function getCart() {
  return [...items];
}

export function addToCart(dish, spice = 0) {
  const key = `${dish.id}::${spice}`;
  const existing = items.find(item => item.key === key);
  if (existing) existing.quantity += 1;
  else items.push({ key, id: dish.id, name: dish.name, price: dish.price, spice, quantity: 1 });
  persist();
}

export function changeQuantity(key, delta) {
  const item = items.find(entry => entry.key === key);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) items = items.filter(entry => entry.key !== key);
  persist();
}

export function clearCart() {
  items = [];
  persist();
}

export function cartCount() {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal() {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
