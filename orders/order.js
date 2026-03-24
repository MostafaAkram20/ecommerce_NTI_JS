const yearSpan = document.getElementById("yearSpan");
const orderItemsEl = document.getElementById("orderItems");
const orderTotalEl = document.getElementById("orderTotal");
const orderCountEl = document.getElementById("orderCount");
const emptyStateEl = document.getElementById("emptyState");
const orderAlertEl = document.getElementById("orderAlert");

const orderForm = document.getElementById("orderForm");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const clearCartFromOrderBtn = document.getElementById("clearCartFromOrderBtn");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

function getCart() {
  const saved = localStorage.getItem("simple_cart");
  if (!saved) return [];
  try {
    return JSON.parse(saved) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("simple_cart", JSON.stringify(cart));
}

function getOrders() {
  const saved = localStorage.getItem("simple_orders");
  if (!saved) return [];
  try {
    return JSON.parse(saved) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("simple_orders", JSON.stringify(orders));
}

function setAlert(type, message) {
  if (!orderAlertEl) return;
  orderAlertEl.className = `alert alert-${type}`;
  orderAlertEl.textContent = message;
  orderAlertEl.classList.remove("d-none");
}

function clearAlert() {
  if (!orderAlertEl) return;
  orderAlertEl.classList.add("d-none");
  orderAlertEl.textContent = "";
}

function formatMoney(value) {
  return "$" + Number(value || 0).toFixed(2);
}

function render() {
  const cart = getCart();
  orderItemsEl.innerHTML = "";
  clearAlert();

  if (cart.length === 0) {
    emptyStateEl.classList.remove("d-none");
    orderCountEl.textContent = "0";
    orderTotalEl.textContent = formatMoney(0);
    placeOrderBtn.disabled = true;
    clearCartFromOrderBtn.disabled = true;
    return;
  }

  emptyStateEl.classList.add("d-none");
  placeOrderBtn.disabled = false;
  clearCartFromOrderBtn.disabled = false;

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    count += item.quantity;
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "d-flex gap-3 align-items-center py-2 border-bottom";

    const img = document.createElement("img");
    img.src = item.imageCover;
    img.alt = item.title;
    img.className = "rounded order-item-img";

    const middle = document.createElement("div");
    middle.className = "flex-grow-1";

    const title = document.createElement("div");
    title.className = "fw-semibold";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "text-muted small";
    meta.textContent = `${formatMoney(item.price)} × ${item.quantity}`;

    middle.appendChild(title);
    middle.appendChild(meta);

    const right = document.createElement("div");
    right.className = "text-end";
    right.innerHTML = `<div class="fw-bold">${formatMoney(
      item.price * item.quantity
    )}</div>`;

    row.appendChild(img);
    row.appendChild(middle);
    row.appendChild(right);

    orderItemsEl.appendChild(row);
  });

  orderCountEl.textContent = String(count);
  orderTotalEl.textContent = formatMoney(total);
}

function handleClearCart() {
  saveCart([]);
  setAlert("warning", "Cart cleared.");
  render();
}

function createOrderFromForm(cart) {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const note = document.getElementById("customerNote").value.trim();

  if (!name || !phone || !address) {
    return { error: "Please fill name, phone, and address." };
  }
  if (!Array.isArray(cart) || cart.length === 0) {
    return { error: "Your cart is empty." };
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: { name, phone, address },
    note: note || "",
    items: cart,
    total,
  };
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearAlert();

  const cart = getCart();
  const order = createOrderFromForm(cart);
  if (order.error) {
    setAlert("danger", order.error);
    return;
  }

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  saveCart([]);

  setAlert("success", "Order placed successfully. Redirecting to shop...");
  render();

  setTimeout(() => {
    window.location.href = "../carts/carts.html";
  }, 1200);
});

clearCartFromOrderBtn.addEventListener("click", handleClearCart);

render();

