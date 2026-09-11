// V2 — CART MODULE
// Each added dish is an individual unit so every spicy dish can have its own level.

const STORAGE_KEY = 'tammy-v2-cart';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function normalizeItems() {
  // Old V2 grouped format is intentionally not reused: individual units are required.
  items = items.map((item, index) => ({
    ...item,
    key: item.key || `${item.id || 'item'}::${Date.now()}::${index}`,
    quantity: 1,
    spice: Number(item.spice || 0)
  }));
}
normalizeItems();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }));
}

export function getCart() {
  return [...items];
}

export function addToCart(dish, spice = 0) {
  items.push({
    key: `${dish.id}::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
    id: dish.id,
    name: dish.name,
    price: dish.price,
    spicy: Boolean(dish.spicy),
    spice: dish.spicy ? Math.max(0, Math.min(3, Number(spice) || 0)) : 0,
    quantity: 1
  });
  persist();
}

export function updateSpice(key, spice) {
  const item = items.find(entry => entry.key === key);
  if (!item || !item.spicy) return;
  item.spice = Math.max(0, Math.min(3, Number(spice) || 0));
  persist();
}

export function removeItem(key) {
  items = items.filter(entry => entry.key !== key);
  persist();
}

export function clearCart() {
  items = [];
  persist();
}

export function cartCount() {
  return items.length;
}

export function cartTotal() {
  return items.reduce((sum, item) => sum + item.price, 0);
}
