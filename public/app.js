// Paste the Square Payment Link for The Original here when it is ready.
const CHECKOUT_LINK = "";
const PRODUCT = { name: "The Original", colour: "Natural oat", price: 79 };
const state = { quantity: 0 };

const bagButton = document.querySelector(".bag-button");
const bagCount = document.querySelector(".bag-count");
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".cart-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartFooter = document.querySelector(".cart-footer");
const setupDialog = document.querySelector(".setup-dialog");

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

function renderCart() {
  cartItems.innerHTML = state.quantity
    ? `<div class="cart-row"><span class="cart-thumb" aria-hidden="true"></span><div><h3>${PRODUCT.name}</h3><p>${PRODUCT.colour} · Qty ${state.quantity} · $${PRODUCT.price * state.quantity} AUD</p></div><button class="remove-item" type="button">Remove</button></div>`
    : "";
  bagCount.textContent = state.quantity;
  document.querySelector(".cart-title-count").textContent = `(${state.quantity})`;
  document.querySelector(".cart-total").textContent = `$${PRODUCT.price * state.quantity} AUD`;
  cartEmpty.hidden = state.quantity > 0;
  cartFooter.hidden = state.quantity === 0;
}

document.querySelectorAll("[data-add-product]").forEach((button) => button.addEventListener("click", () => {
  state.quantity += 1;
  renderCart();
  openCart();
}));
cartItems.addEventListener("click", (event) => {
  if (!event.target.closest(".remove-item")) return;
  state.quantity = Math.max(0, state.quantity - 1);
  renderCart();
});
bagButton.addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", () => closeCart());
document.querySelector(".cart-shop").addEventListener("click", () => closeCart({ restoreFocus: false }));
backdrop.addEventListener("click", () => closeCart());
document.querySelector(".checkout-button").addEventListener("click", () => {
  if (CHECKOUT_LINK) return void (window.location.href = CHECKOUT_LINK);
  closeCart({ restoreFocus: false });
  setupDialog.showModal();
});
document.querySelector(".dialog-close").addEventListener("click", () => setupDialog.close());
setupDialog.addEventListener("click", (event) => { if (event.target === setupDialog) setupDialog.close(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && cart.classList.contains("open")) closeCart(); });

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const mobileBuy = document.querySelector(".mobile-buy");
function updateMobileBuy() {
  const section = document.querySelector("#original").getBoundingClientRect();
  const show = window.innerWidth <= 700 && window.scrollY > window.innerHeight * .65 && (section.bottom < 0 || section.top > window.innerHeight);
  mobileBuy.classList.toggle("visible", show);
  mobileBuy.setAttribute("aria-hidden", String(!show));
}
window.addEventListener("scroll", updateMobileBuy, { passive: true });
window.addEventListener("resize", updateMobileBuy);
document.querySelector("#year").textContent = new Date().getFullYear();
renderCart();
updateMobileBuy();
