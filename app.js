// script.js
// Minimal, robust cart + UI wiring and fixes (works on Android/iOS/Windows/macOS)
// Sets year, handles cart add/remove, opens WhatsApp with prefilled order

(function () {
  'use strict';

  // Utilities
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const formatRp = (value) => {
    // value in integer (e.g., 30000)
    return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Year
  const yearEl = q('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Elements
  const cartCountEl = q('#cart-count');
  const navCartBtn = q('#nav-cart-btn');
  const cartPopup = q('#cart-popup');
  const cartItemsList = q('#cart-items');
  const cartTotalEl = q('#cart-total');
  const addBtns = qa('.add-cart-btn');
  const cartOrderBtn = q('#cart-order');
  const cartCloseBtn = q('#cart-close');

  // Cart state
  const cart = [];

  function updateCartUI() {
    // count
    const totalItems = cart.reduce((s, it) => s + it.qty, 0);
    cartCountEl.textContent = totalItems;
    // list
    cartItemsList.innerHTML = '';
    let totalPrice = 0;
    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<div>${escapeHtml(item.name)} x ${item.qty}</div><div>${formatRp(item.price * item.qty)}</div>`;
      cartItemsList.appendChild(li);
      totalPrice += item.price * item.qty;
    });
    cartTotalEl.textContent = 'Total: ' + formatRp(totalPrice);
  }

  function addToCart(name, price) {
    // price expected as integer (e.g., 30000)
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    updateCartUI();
    showCartPopup();
  }

  function showCartPopup() {
    if (cartPopup) {
      cartPopup.setAttribute('aria-hidden', 'false');
      cartPopup.style.display = 'block';
      // focus trap optional
    }
  }

  function hideCartPopup() {
    if (cartPopup) {
      cartPopup.setAttribute('aria-hidden', 'true');
      cartPopup.style.display = 'none';
    }
  }

  // Add-to-cart buttons
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.getAttribute('data-name') || 'Item';
      let priceRaw = btn.getAttribute('data-price') || '0';
      // ensure it's numeric integer; handle "30000" or "30.000"
      priceRaw = priceRaw.replace(/[.,\s]/g, '');
      const price = parseInt(priceRaw, 10) || 0;
      addToCart(name, price);
    });
  });

  // Nav cart click toggles popup
  if (navCartBtn) {
    navCartBtn.addEventListener('click', (e) => {
      const visible = cartPopup && cartPopup.getAttribute('aria-hidden') === 'false';
      if (visible) hideCartPopup();
      else showCartPopup();
    });
  }

  // Close button
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', hideCartPopup);

  // WhatsApp order button: builds message and opens wa.me
  if (cartOrderBtn) {
    cartOrderBtn.addEventListener('click', (e) => {
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      const lines = cart.map(it => `${it.name} x${it.qty} - ${formatRp(it.price * it.qty)}`);
      const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
      const message = [
        'Halo Saheelle\'s Bakery, saya ingin memesan:',
        ...lines,
        '',
        `Total: ${formatRp(total)}`,
        '',
        'Nama: ',
        'Alamat / Pickup: ',
        'Tanggal & Waktu: ',
      ].join('\n');
      // phone number without plus or dashes
      const phone = '6285640444923';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // Escape HTML to avoid injection in cart list
  function escapeHtml(str) {
    return (str + '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Image fallback for broken <img> or background-image: attempt to use an assets fallback
  function ensureImagesLoad() {
    qa('img').forEach(img => {
      img.addEventListener('error', () => {
        // provide a lightweight placeholder or fallback
        const src = img.getAttribute('src') || '';
        // If image path seems incorrect (contains backslash), correct it
        let corrected = src.replace(/\\/g, '/');
        if (corrected === src) {
          // if still broken, try to swap to assets/img/placeholder.png (site owner should provide it)
          corrected = 'assets/img/placeholder.png';
        }
        img.setAttribute('src', corrected);
      });
    });

    // For gallery background-image fallback: check computed style
    qa('.gallery-item').forEach(item => {
      const bg = getComputedStyle(item).backgroundImage;
      if (!bg || bg === 'none') {
        item.style.backgroundImage = "url('assets/img/placeholder.png')";
      } else {
        // if URL seems relative but missing assets prefix, leave to CSS or owner
      }
    });
  }

  // Run on load
  window.addEventListener('DOMContentLoaded', () => {
    ensureImagesLoad();
    updateCartUI();
  });

  // Close popup on outside click
  document.addEventListener('click', (e) => {
    if (!cartPopup) return;
    const target = e.target;
    if (cartPopup.contains(target) || navCartBtn.contains(target)) return;
    // clicked outside
    hideCartPopup();
  });

})();