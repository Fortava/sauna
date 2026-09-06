// Paste one Square Payment Link per colour here when they are ready.
const CHECKOUT_LINKS = { "Natural oat": "", Charcoal: "" };
const PRODUCT = { name: "The Original", price: 79 };
const state = { selectedColour: "Natural oat", items: [] };

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
  const grouped = Object.entries(state.items.reduce((items, colour) => {
    items[colour] = (items[colour] || 0) + 1;
    return items;
  }, {}));
  cartItems.innerHTML = grouped.map(([colour, quantity]) => `<div class="cart-row"><span class="cart-thumb ${colour === "Charcoal" ? "charcoal" : "oat"}" aria-hidden="true"></span><div><h3>${PRODUCT.name}</h3><p>${colour} · Qty ${quantity} · $${PRODUCT.price * quantity} AUD</p></div><button class="remove-item" type="button" data-colour="${colour}">Remove</button></div>`).join("");
  bagCount.textContent = state.items.length;
  document.querySelector(".cart-title-count").textContent = `(${state.items.length})`;
  document.querySelector(".cart-total").textContent = `$${PRODUCT.price * state.items.length} AUD`;
  cartEmpty.hidden = state.items.length > 0;
  cartFooter.hidden = state.items.length === 0;
}

document.querySelectorAll("[data-add-product]").forEach((button) => button.addEventListener("click", () => {
  state.items.push(state.selectedColour);
  renderCart();
  openCart();
}));
cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-item");
  if (!removeButton) return;
  const index = state.items.indexOf(removeButton.dataset.colour);
  if (index >= 0) state.items.splice(index, 1);
  renderCart();
});
document.querySelectorAll(".variant").forEach((button) => button.addEventListener("click", () => {
  state.selectedColour = button.dataset.variant;
  document.querySelectorAll(".variant").forEach((variant) => {
    const selected = variant === button;
    variant.classList.toggle("active", selected);
    variant.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector(".selected-variant").textContent = state.selectedColour;
  document.querySelector(".hero-colour").textContent = state.selectedColour;
  document.querySelector(".mobile-buy strong").textContent = `${PRODUCT.name} · ${state.selectedColour} · $${PRODUCT.price}`;
}));
bagButton.addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", () => closeCart());
document.querySelector(".cart-shop").addEventListener("click", () => closeCart({ restoreFocus: false }));
backdrop.addEventListener("click", () => closeCart());
document.querySelector(".checkout-button").addEventListener("click", () => {
  const colours = [...new Set(state.items)];
  if (colours.length === 1 && CHECKOUT_LINKS[colours[0]]) return void (window.location.href = CHECKOUT_LINKS[colours[0]]);
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
