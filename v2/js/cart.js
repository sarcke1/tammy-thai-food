// V2 — CART MODULE
// Safe cart storage: a malformed localStorage value must never block the menu.

const STORAGE_KEY = 'tammy-v2-cart';
let items = [];

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  const parsed = saved ? JSON.parse(saved) : [];
  items = Array.isArray(parsed) ? parsed : [];
} catch (error) {
  console.warn('Cart storage reset:', error);
  items = [];
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

function normalizeItems() {
  items = items.map((item, index) => ({
    ...item,
    key: item.key || `${item.id || 'item'}::${Date.now()}::${index}`,
    quantity: 1,
    spice: Number(item.spice || 0)
  }));
}
normalizeItems();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }));
}

export function getCart() { return [...items]; }

export function addToCart(dish, spice = 0, nameOverride = null) {
  items.push({
    key: `${dish.id}::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`,
    id: dish.id,
    name: nameOverride || dish.name,
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
export function removeItem(key) { items = items.filter(entry => entry.key !== key); persist(); }
export function clearCart() { items = []; persist(); }
export function cartCount() { return items.length; }
export function cartTotal() { return items.reduce((sum, item) => sum + Number(item.price || 0), 0); }
