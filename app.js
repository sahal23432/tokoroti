/* ----------------------------------------------------
   GLOBAL CART STATE
---------------------------------------------------- */
let cart = [];

/* ----------------------------------------------------
   CART BUTTONS & POPUP
---------------------------------------------------- */
const cartBtn = document.getElementById("nav-cart-btn");
const cartPopup = document.getElementById("cart-popup");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const cartOrderBtn = document.getElementById("cart-order");

/* Toggle cart popup */
cartBtn.addEventListener("click", () => {
  const isOpen = cartPopup.getAttribute("aria-hidden") === "false";
  cartPopup.setAttribute("aria-hidden", isOpen ? "true" : "false");
});

/* Close cart popup */
cartClose.addEventListener("click", () => {
  cartPopup.setAttribute("aria-hidden", "true");
});

/* ----------------------------------------------------
   ADD TO CART
---------------------------------------------------- */
document.querySelectorAll(".add-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price, 10);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCart();
  });
});

/* ----------------------------------------------------
   UPDATE CART UI
---------------------------------------------------- */
function updateCart() {
  // Count
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalQty;

  // List Items
  cartItemsEl.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.qty} × ${item.name}</span>
      <strong>Rp ${numberFormat(item.price * item.qty)}</strong>
    `;
    cartItemsEl.appendChild(li);
  });

  // Total price
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = `Total: Rp ${numberFormat(totalPrice)}`;
}

/* ----------------------------------------------------
   NUMBER FORMATTER
---------------------------------------------------- */
function numberFormat(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ----------------------------------------------------
   SEND ORDER TO WHATSAPP
---------------------------------------------------- */
cartOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  let message = "Halo! Saya ingin memesan:\n\n";
  cart.forEach(item => {
    message += `${item.qty} × ${item.name} — Rp ${numberFormat(item.price * item.qty)}\n`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  message += `\nTotal: Rp ${numberFormat(total)}`;
  message += "\n\nTerima kasih!";

  const phone = "6285640444923";
  const waURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp
  window.open(waURL, "_blank");
});

/* ----------------------------------------------------
   YEAR AUTO-UPDATE
---------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ----------------------------------------------------
   CLOSE POPUP WHEN CLICKING OUTSIDE
---------------------------------------------------- */
document.addEventListener("click", e => {
  if (!cartPopup.contains(e.target) && !cartBtn.contains(e.target)) {
    cartPopup.setAttribute("aria-hidden", "true");
  }
});

/* ----------------------------------------------------
   PREVENT IMAGE PATH ERRORS
   (Auto console warning for missing assets)
---------------------------------------------------- */
document.querySelectorAll("img").forEach(img => {
  img.onerror = () => {
    console.warn("Missing image:", img.src);
    img.style.opacity = "0.4";
    img.style.border = "2px dashed #aaa";
  };
});