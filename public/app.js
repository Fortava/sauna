// Paste your Square Payment Link URLs here. Leave blank until your products exist in Square.
const CHECKOUT_LINKS = {
  "The Dune": "",
  "The Coal": "",
  "The Ember": "",
};

const PRODUCTS = {
  "The Dune": { price: 79, colour: "Oat", tone: "oat" },
  "The Coal": { price: 79, colour: "Charcoal", tone: "coal" },
  "The Ember": { price: 79, colour: "Burnt clay", tone: "ember" },
};

const state = { selected: "The Dune", cart: [] };
const bagButton = document.querySelector(".bag-button");
const bagCount = document.querySelector(".bag-count");
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".cart-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartFooter = document.querySelector(".cart-footer");
const cartTotal = document.querySelector(".cart-total");
const setupDialog = document.querySelector(".setup-dialog");

function setSelected(productName) {
  state.selected = productName;
  const product = PRODUCTS[productName];
  document.querySelectorAll(".style-option").forEach((option) => {
    const active = option.dataset.product === productName;
    option.classList.toggle("active", active);
    option.setAttribute("aria-pressed", String(active));
  });
  document.querySelector(".selected-style").textContent = `${productName} — ${product.colour}`;
  document.querySelector(".primary-product-name").textContent = productName;
  document.querySelector(".mobile-product-name").textContent = `${productName} · $${product.price}`;
}

function openCart() {
  cart.classList.add("open");
  cart.setAttribute("aria-hidden", "false");
  bagButton.setAttribute("aria-expanded", "true");
  backdrop.hidden = false;
  document.body.classList.add("cart-open");
  document.querySelector(".cart-close").focus();
}

function closeCart({ restoreFocus = true } = {}) {
  cart.classList.remove("open");
  cart.setAttribute("aria-hidden", "true");
  bagButton.setAttribute("aria-expanded", "false");
  backdrop.hidden = true;
  document.body.classList.remove("cart-open");
  if (restoreFocus) bagButton.focus();
}

function addSelected() {
  const product = PRODUCTS[state.selected];
  state.cart.push({ name: state.selected, ...product });
  renderCart();
  openCart();
}

function renderCart() {
  const grouped = state.cart.reduce((items, product) => {
    items[product.name] ??= { ...product, quantity: 0 };
    items[product.name].quantity += 1;
    return items;
  }, {});
  cartItems.innerHTML = Object.values(grouped).map((item) => `
    <div class="cart-row">
      <span class="cart-thumb ${item.tone}" aria-hidden="true"></span>
      <div><h3>${item.name}</h3><p>${item.colour} · Qty ${item.quantity} · $${item.price * item.quantity} AUD</p></div>
      <button class="remove-item" type="button" data-remove="${item.name}">Remove</button>
    </div>
  `).join("");
  const count = state.cart.length;
  bagCount.textContent = count;
  document.querySelector(".cart-title-count").textContent = `(${count})`;
  cartTotal.textContent = `$${state.cart.reduce((sum, item) => sum + item.price, 0)} AUD`;
  cartEmpty.hidden = count > 0;
  cartFooter.hidden = count === 0;
}

document.querySelectorAll(".style-option").forEach((option) => option.addEventListener("click", () => setSelected(option.dataset.product)));
document.querySelectorAll("[data-add-selected]").forEach((button) => button.addEventListener("click", addSelected));
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const index = state.cart.findIndex((item) => item.name === button.dataset.remove);
  if (index > -1) state.cart.splice(index, 1);
  renderCart();
});
bagButton.addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", () => closeCart());
document.querySelector(".cart-shop").addEventListener("click", () => closeCart({ restoreFocus: false }));
backdrop.addEventListener("click", () => closeCart());

document.querySelector(".checkout-button").addEventListener("click", () => {
  const uniqueProducts = [...new Set(state.cart.map((item) => item.name))];
  const directLink = uniqueProducts.length === 1 ? CHECKOUT_LINKS[uniqueProducts[0]] : "";
  if (directLink) return void (window.location.href = directLink);
  closeCart({ restoreFocus: false });
  setupDialog.showModal();
});

document.querySelector(".dialog-close").addEventListener("click", () => setupDialog.close());
setupDialog.addEventListener("click", (event) => { if (event.target === setupDialog) setupDialog.close(); });
document.querySelector(".signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".form-status").textContent = "You’re on the hot list.";
  event.currentTarget.reset();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const mobileBuy = document.querySelector(".mobile-buy");
function updateMobileBuy() {
  const rect = document.querySelector("#shop").getBoundingClientRect();
  const shouldShow = window.innerWidth <= 720 && window.scrollY > window.innerHeight * .65 && (rect.bottom < 0 || rect.top > window.innerHeight);
  mobileBuy.classList.toggle("visible", shouldShow);
  mobileBuy.setAttribute("aria-hidden", String(!shouldShow));
}
window.addEventListener("scroll", updateMobileBuy, { passive: true });
window.addEventListener("resize", updateMobileBuy);

document.addEventListener("keydown", (event) => { if (event.key === "Escape" && cart.classList.contains("open")) closeCart(); });
document.querySelector("#year").textContent = new Date().getFullYear();
setSelected(state.selected);
renderCart();
updateMobileBuy();
