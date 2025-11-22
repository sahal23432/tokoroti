  const cartBtn = document.getElementById("cart-btn");
  const cartCount = document.getElementById("cart-count");
  const cartPopup = document.getElementById("cart-popup");
  const cartItemsList = document.getElementById("cart-items");
  const closeBtn = document.getElementById("cart-close");
  const cartTotal = document.getElementById("cart-total");
  const cartOrderBtn = document.getElementById("cart-order");

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Normalisasi harga Indonesia → angka
  function toNumber(str) {
    if (!str) return 0;
    return parseFloat(
      str.replace(/\./g, "").replace(",", ".")
    );
  }

  // Format angka → "Rp 30.000"
  function toRupiah(num) {
    return "Rp " + num.toLocaleString("id-ID");
  }

  function updateCartDisplay() {
    cartCount.textContent = cart.length;
    cartItemsList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
      const priceNum = toNumber(item.price);
      total += priceNum;

      const formattedPrice = toRupiah(priceNum);

      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";

      li.innerHTML = `
        <span>${item.name} - ${formattedPrice}</span>
        <button class="remove-item" data-index="${index}" style="
          background:#e53935;
          color:white;
          border:none;
          padding:2px 6px;
          border-radius:4px;
          cursor:pointer;
          font-size:.8rem;
        ">×</button>
      `;

      cartItemsList.appendChild(li);
    });

    // Show total in Rupiah
    cartTotal.textContent = "Total: " + toRupiah(total);

    // Save
    localStorage.setItem("cart", JSON.stringify(cart));

    // Rebind delete buttons
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.index;
        cart.splice(idx, 1);
        updateCartDisplay();
        cartPopup.style.display = "block";
      });
    });
  }

  // Add to cart button
  document.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;

      cart.push({ name, price });
      updateCartDisplay();

      btn.textContent = "Added ✓";
      setTimeout(() => btn.textContent = "Add to Cart", 900);
    });
  });

  // open/close popup
  cartBtn.addEventListener("click", () => {
    cartPopup.style.display =
      cartPopup.style.display === "block" ? "none" : "block";
  });

  closeBtn.addEventListener("click", () => {
    cartPopup.style.display = "none";
  });

  // Send WhatsApp Order
  cartOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    let message = "Halo, saya ingin pesan:%0A";

    cart.forEach(item => {
      const priceNum = toNumber(item.price);
      message += `- ${item.name} (${toRupiah(priceNum)})%0A`;
    });

    const totalText = cartTotal.textContent.replace("Total: ", "");
    message += `%0A${totalText}`;

    const phone = "6285640444923";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  });

  updateCartDisplay();