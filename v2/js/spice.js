// V2 — SPICE MODULE
// Independent reusable spice selector, compatible with the V1 behavior.

export const spiceLevels = [0, 1, 2, 3];

export function spiceLabel(level) {
  return level === 0 ? 'Sans piment' : '🌶️'.repeat(level);
}

export function renderSpiceControl(dishId, initial = 1) {
  const safe = Math.max(0, Math.min(3, Number(initial) || 0));
  return `<div class="spice-control" data-spice-control="${dishId}" data-level="${safe}">
    <span class="spice-caption">Piment</span>
    <button type="button" class="spice-minus" aria-label="Diminuer le piment">−</button>
    <span class="spice-value">${spiceLabel(safe)}</span>
    <button type="button" class="spice-plus" aria-label="Augmenter le piment">+</button>
  </div>`;
}

export function readSpiceControl(control) {
  return Number(control?.dataset.level || 0);
}
