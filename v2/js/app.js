// V2 — UI RENDERER ONLY
// Product content lives in ./data.js. Ordering/cart logic will be added as separate modules.
import { dishes, categories } from './data.js';

const euro = n => n.toLocaleString('fr-FR', { style:'currency', currency:'EUR' });
const grid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.category-row button')];

function photoStyle(d){
  if(!d.photo) return `background:linear-gradient(135deg,#e8dfca,#d5dfd2)`;
  if(d.photo.endsWith('.webp')) return `background-image:url('${d.photo}');background-size:400% 300%;background-position:${d.position||'center'}`;
  return `background-image:url('${d.photo}')`;
}

function renderMenu(category='Tous'){
  if(!grid) return;
  const visible = category === 'Tous' ? dishes : dishes.filter(d => d.category === category);
  grid.innerHTML = visible.map(d => `
    <article class="dish-card" data-dish-id="${d.id}" data-category="${d.category}">
      <div class="dish-photo" style="${photoStyle(d)}">
        ${d.spicy ? '<span class="dish-badge">🌶️ Piment au choix</span>' : ''}
      </div>
      <div class="dish-card-body">
        <div class="dish-title-row">
          <h3>${d.name}</h3>
          <span class="price">${euro(d.price)}</span>
        </div>
        <p>${d.desc}</p>
        ${d.spicy ? '<div class="spice-module">🌶️ Choix du niveau de piment</div>' : ''}
        <button class="button dish-action" type="button" data-action="add" data-dish-id="${d.id}">Ajouter au panier</button>
      </div>
    </article>
  `).join('');
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    renderMenu(button.textContent.trim());
  });
});

renderMenu();
