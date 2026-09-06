(() => {
  const cartDrawer = document.querySelector("[data-cart-drawer]");
  const backdrop = document.querySelector("[data-cart-backdrop]");
  const bagButton = document.querySelector("[data-cart-open]");
  const cartItems = document.querySelector("[data-cart-items]");
  const cartEmpty = document.querySelector("[data-cart-empty]");
  const cartFooter = document.querySelector("[data-cart-footer]");

  let currency = "AUD";

  function money(cents) {
    if (window.Shopify?.formatMoney && window.themeMoneyFormat) {
      return Shopify.formatMoney(cents, window.themeMoneyFormat);
    }
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(Number(cents) / 100);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    bagButton?.setAttribute("aria-expanded", "true");
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add("cart-open");
  }

  function closeCart({ restoreFocus = true } = {}) {
    if (!cartDrawer) return;
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    bagButton?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("cart-open");
    if (restoreFocus) bagButton?.focus();
  }

  function renderCart(cart) {
    if (cart.currency) currency = cart.currency;
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(cart.item_count);
    });
    const titleCount = document.querySelector("[data-cart-title-count]");
    const total = document.querySelector("[data-cart-total]");
    if (titleCount) titleCount.textContent = `(${cart.item_count})`;
    if (total) total.textContent = money(cart.total_price);

    if (cartItems) {
      cartItems.innerHTML = cart.items
        .map((item) => {
          const image = item.image
            ? `<img class="cart-thumb" src="${item.image}" alt="${escapeHtml(item.product_title)}" width="72" height="72" loading="lazy">`
            : `<span class="cart-thumb cart-thumb--empty" aria-hidden="true"></span>`;
          const variant =
            item.variant_title && item.variant_title !== "Default Title"
              ? `${escapeHtml(item.variant_title)} · `
              : "";
          return `<div class="cart-row" data-key="${item.key}">${image}<div><h3>${escapeHtml(item.product_title)}</h3><p>${variant}Qty ${item.quantity} · ${money(item.final_line_price)}</p></div><button class="remove-item" type="button" data-remove-item="${item.key}">Remove</button></div>`;
        })
        .join("");
    }

    if (cartEmpty) cartEmpty.hidden = cart.item_count > 0;
    if (cartFooter) cartFooter.hidden = cart.item_count === 0;
  }

  async function fetchCart() {
    const response = await fetch("/cart.js");
    return response.json();
  }

  async function refreshCart({ open = false } = {}) {
    const cart = await fetchCart();
    renderCart(cart);
    if (open) openCart();
    return cart;
  }

  async function addToCart(variantId) {
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: Number(variantId), quantity: 1 }),
    });
    if (!response.ok) throw new Error("Unable to add to cart");
    await refreshCart({ open: true });
  }

  async function removeItem(key) {
    await fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity: 0 }),
    });
    await refreshCart();
  }

  function getProductData(section) {
    const node = section.querySelector("[data-product-json]");
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      return null;
    }
  }

  function findVariant(product, selectedOptions) {
    return product.variants.find((variant) =>
      variant.options.every((option, index) => option === selectedOptions[index])
    );
  }

  function initProductSection(section) {
    const product = getProductData(section);
    if (!product) return;

    const form = section.querySelector("[data-product-form]");
    const variantInput = section.querySelector("[data-variant-id]");
    const priceEl = section.querySelector("[data-product-price]");
    const addLabel = section.querySelector("[data-add-label]");
    const addButton = section.querySelector("[data-add-to-cart]");
    const colourEl = section.querySelector("[data-hero-colour]");
    const mobileLabel = section.querySelector("[data-mobile-buy-label]");
    const mobileAdd = section.querySelector("[data-mobile-add]");
    const optionSets = [...section.querySelectorAll("[data-option-index]")];

    let selectedOptions =
      product.variants.find((v) => String(v.id) === String(variantInput?.value))?.options ||
      product.variants.find((v) => v.available)?.options ||
      product.variants[0]?.options ||
      [];

    function updateUI(variant) {
      if (!variant) return;
      if (variantInput) variantInput.value = variant.id;
      if (priceEl) priceEl.innerHTML = `<strong class="price__regular">${money(variant.price)}</strong>`;
      if (addLabel) addLabel.textContent = variant.available ? "Add to bag" : "Sold out";
      if (addButton) addButton.disabled = !variant.available;
      if (mobileAdd) mobileAdd.disabled = !variant.available;
      if (colourEl) colourEl.textContent = variant.title === "Default Title" ? product.title : variant.title;
      if (mobileLabel) {
        const titlePart =
          variant.title === "Default Title" ? product.title : `${product.title} · ${variant.title}`;
        mobileLabel.textContent = `${titlePart} · ${money(variant.price)}`;
      }

      optionSets.forEach((fieldset, optionIndex) => {
        const selected = fieldset.querySelector("[data-selected-option]");
        if (selected) selected.textContent = selectedOptions[optionIndex];
        fieldset.querySelectorAll("[data-option-value]").forEach((button) => {
          const value = button.getAttribute("data-option-value");
          const active = selectedOptions[optionIndex] === value;
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
      });
    }

    optionSets.forEach((fieldset, optionIndex) => {
      fieldset.querySelectorAll("[data-option-value]").forEach((button) => {
        button.addEventListener("click", () => {
          selectedOptions = selectedOptions.map((value, index) =>
            index === optionIndex ? button.getAttribute("data-option-value") : value
          );
          updateUI(findVariant(product, selectedOptions));
        });
      });
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = variantInput?.value;
      if (!id) return;
      await addToCart(id);
    });

    mobileAdd?.addEventListener("click", async () => {
      const id = variantInput?.value;
      if (!id) return;
      await addToCart(id);
    });

    updateUI(findVariant(product, selectedOptions));
  }

  document.querySelectorAll("[data-product-section]").forEach(initProductSection);

  bagButton?.addEventListener("click", () => openCart());
  document.querySelectorAll("[data-cart-close]").forEach((button) => {
    button.addEventListener("click", () => closeCart());
  });
  backdrop?.addEventListener("click", () => closeCart());
  cartItems?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-remove-item]");
    if (!button) return;
    await removeItem(button.getAttribute("data-remove-item"));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartDrawer?.classList.contains("open")) closeCart();
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const mobileBuy = document.querySelector("[data-mobile-buy]");
  function updateMobileBuy() {
    if (!mobileBuy) return;
    const section = document.querySelector("#original");
    if (!section) return;
    const box = section.getBoundingClientRect();
    const show =
      window.innerWidth <= 700 &&
      window.scrollY > window.innerHeight * 0.65 &&
      (box.bottom < 0 || box.top > window.innerHeight);
    mobileBuy.classList.toggle("visible", show);
    mobileBuy.setAttribute("aria-hidden", String(!show));
  }
  window.addEventListener("scroll", updateMobileBuy, { passive: true });
  window.addEventListener("resize", updateMobileBuy);
  updateMobileBuy();

  refreshCart().catch(() => {});
})();
