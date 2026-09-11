// V2 — UI RENDERER ONLY
// Product content lives in ./data.js. Ordering/cart logic will be added as separate modules.
import { dishes } from './data.js';

const euro = n => n.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
const grid = document.querySelector('#menu-grid');

if (grid) {
  grid.innerHTML = dishes.map(d => `
    <article class="dish-card" data-dish-id="${d.id}">
      <div class="dish-placeholder" aria-hidden="true">${d.emoji}</div>
      <div class="dish-card-body">
        <div class="dish-title-row">
          <h3>${d.name}</h3>
          <span class="price">${euro(d.price)}</span>
        </div>
        <p>${d.desc}</p>
        ${d.spicy ? '<div class="spice-module" data-spice-for="'+d.id+'">🌶️ Piment — module à reconnecter</div>' : ''}
        <button class="button dish-action" type="button" data-action="add" data-dish-id="${d.id}">Ajouter</button>
      </div>
    </article>
  `).join('');
}
