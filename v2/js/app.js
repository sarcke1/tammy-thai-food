function renderCart(){

  const items=getCart();

  if(cartCountEl) cartCountEl.textContent=cartCount();

  if(!cartContent) return;

  if(!items.length){
    cartContent.innerHTML='<p class="empty-cart">Votre panier est vide.</p>';
    return;
  }

  cartContent.innerHTML=
    items.map((item,index)=>`
      <div class="cart-line">

        ${item.photo ? `
        <div class="cart-photo" style="background-image:url('${item.photo}')"></div>
        ` : ''}

        <div class="cart-unit-info">

          <strong>${item.name}</strong>

          <small>Plat n°${index+1}</small>

          ${item.protein ? `<small>Viande : ${item.protein}</small>` : ''}

          ${item.spicy ? `
          <div class="cart-spice-control">
            <span>Piment</span>

            <button data-cart-key="${item.key}" data-spice-delta="-1">−</button>

            <b>${spiceLabel(item.spice)}</b>

            <button data-cart-key="${item.key}" data-spice-delta="1">+</button>

          </div>` : '<small>Sans piment</small>'}

          <span>${euro(item.price)}</span>

        </div>

        <button class="cart-remove" data-remove-key="${item.key}">×</button>

      </div>
    `).join('')

    +`

    <div class="cart-total">
      <strong>Total</strong>
      <strong>${euro(cartTotal())}</strong>
    </div>

    <div class="cart-actions">
      <button class="button cart-validate" data-validate-cart>
        Valider le panier
      </button>

      <button class="cart-clear secondary-cart-action" data-clear-cart>
        Vider le panier
      </button>
    </div>`;
}
