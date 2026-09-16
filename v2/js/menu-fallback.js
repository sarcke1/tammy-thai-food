// Emergency fallback renderer: guarantees that the menu is visible even if the main UI module fails.
import { dishes } from './data.js';

const euro = n => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

function renderFallback() {
  const grid = document.querySelector('#menu-grid');
  if (!grid || grid.children.length) return;

  grid.innerHTML = dishes.map(dish => `
    <article class="dish-card" data-dish-id="${dish.id}" data-category="${dish.category}">
      <div class="dish-photo" style="background-image:url('${dish.photo}');background-position:${dish.position || 'center'};background-size:${dish.photo.endsWith('.webp') ? '400% 300%' : 'cover'}"></div>
      <div class="dish-card-body">
        <div class="dish-title-row"><h3>${dish.name}</h3><span class="price">${euro(dish.price)}</span></div>
        <p>${dish.desc || ''}</p>
        <button class="button dish-action" type="button" disabled>Menu temporairement indisponible</button>
      </div>
    </article>`).join('');
}

setTimeout(renderFallback, 800);
