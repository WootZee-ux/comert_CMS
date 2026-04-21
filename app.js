(function () {
  const CART_KEY = 'audiohub-cart';

  const parsePrice = (value) => Number(value) || 0;

  const readCart = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const formatPrice = (value) => `${value.toLocaleString('ro-RO')} lei`;

  const cartCountNode = document.querySelector('.js-cart-count');
  const cartListNode = document.querySelector('.js-cart-items');
  const cartTotalNode = document.querySelector('.js-cart-total');
  const paymentStatusNode = document.querySelector('.js-payment-status');
  const checkoutButton = document.querySelector('.js-checkout');
  const clearButton = document.querySelector('.js-clear-cart');

  const renderCart = () => {
    const cart = readCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cartCountNode) {
      cartCountNode.textContent = `Coș (${count})`;
    }

    if (cartListNode) {
      if (cart.length === 0) {
        cartListNode.innerHTML = '<li>Coșul este gol momentan.</li>';
      } else {
        cartListNode.innerHTML = cart
          .map(
            (item) =>
              `<li><span>${item.name} <small>(${item.type})</small></span><strong>${item.quantity} x ${formatPrice(item.price)}</strong></li>`
          )
          .join('');
      }
    }

    if (cartTotalNode) {
      cartTotalNode.textContent = formatPrice(total);
    }

    if (checkoutButton) {
      checkoutButton.disabled = cart.length === 0;
    }

    if (clearButton) {
      clearButton.disabled = cart.length === 0;
    }
  };

  const addToCart = (button) => {
    const name = button.dataset.name;
    const type = button.dataset.type;
    const price = parsePrice(button.dataset.price);

    if (!name || !type || !price) return;

    const cart = readCart();
    const existingItem = cart.find((item) => item.name === name && item.type === type);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name,
        type,
        price,
        quantity: 1,
      });
    }

    saveCart(cart);
    renderCart();
  };

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(button));
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const cart = readCart();
      if (cart.length === 0) return;

      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      if (paymentStatusNode) {
        paymentStatusNode.textContent = `Plată simulată cu succes pentru ${formatPrice(total)}. Îți mulțumim!`;
      }

      saveCart([]);
      renderCart();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      saveCart([]);
      if (paymentStatusNode) {
        paymentStatusNode.textContent = 'Coșul a fost golit.';
      }
      renderCart();
    });
  }

  renderCart();
})();
