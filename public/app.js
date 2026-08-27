// Paste your Square Payment Link URLs here. Leave blank until your products exist in Square.
const CHECKOUT_LINKS = {
  "The Dune": "",
  "The Coal": "",
  "The Ember": "",
};

const state = { cart: [] };
const bagButton = document.querySelector(".bag-button");
const bagCount = document.querySelector(".bag-count");
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".cart-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartFooter = document.querySelector(".cart-footer");
const cartTotal = document.querySelector(".cart-total");
const setupDialog = document.querySelector(".setup-dialog");

function openCart() {
  cart.classList.add("open");
  cart.setAttribute("aria-hidden", "false");
  bagButton.setAttribute("aria-expanded", "true");
  backdrop.hidden = false;
  document.body.classList.add("cart-open");
  document.querySelector(".cart-close").focus();
}

function closeCart() {
  cart.classList.remove("open");
  cart.setAttribute("aria-hidden", "true");
  bagButton.setAttribute("aria-expanded", "false");
  backdrop.hidden = true;
  document.body.classList.remove("cart-open");
  bagButton.focus();
}

function renderCart() {
  const quantities = state.cart.reduce((items, product) => {
    items[product.name] ??= { ...product, quantity: 0 };
    items[product.name].quantity += 1;
    return items;
  }, {});

  cartItems.innerHTML = Object.values(quantities).map((item) => `
    <div class="cart-row">
      <div><h3>${item.name}</h3><p>Qty ${item.quantity} · $${item.price * item.quantity} AUD</p></div>
      <button class="remove-item" type="button" data-remove="${item.name}">Remove</button>
    </div>
  `).join("");

  bagCount.textContent = state.cart.length;
  cartTotal.textContent = `$${state.cart.reduce((sum, item) => sum + item.price, 0)} AUD`;
  cartEmpty.hidden = state.cart.length > 0;
  cartFooter.hidden = state.cart.length === 0;
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.cart.push({ name: button.dataset.product, price: Number(button.dataset.price) });
    renderCart();
    openCart();
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const index = state.cart.findIndex((item) => item.name === button.dataset.remove);
  if (index > -1) state.cart.splice(index, 1);
  renderCart();
});

bagButton.addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
document.querySelector(".cart-shop").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

document.querySelector(".checkout-button").addEventListener("click", () => {
  const uniqueProducts = [...new Set(state.cart.map((item) => item.name))];
  const directLink = uniqueProducts.length === 1 ? CHECKOUT_LINKS[uniqueProducts[0]] : "";
  if (directLink) {
    window.location.href = directLink;
    return;
  }
  closeCart();
  setupDialog.showModal();
});

document.querySelector(".dialog-close").addEventListener("click", () => setupDialog.close());
setupDialog.addEventListener("click", (event) => {
  if (event.target === setupDialog) setupDialog.close();
});

document.querySelector(".signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector(".form-status");
  status.textContent = "You’re on the list. See you in the heat.";
  form.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cart.classList.contains("open")) closeCart();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderCart();
