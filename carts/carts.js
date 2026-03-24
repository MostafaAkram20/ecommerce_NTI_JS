const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

const productsRow = document.getElementById("productsRow");
const loadingEl = document.getElementById("loading");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const ordersBtn = document.getElementById("ordersBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const yearSpan = document.getElementById("yearSpan");
const logoutBtn = document.getElementById("logoutBtn");

yearSpan.textContent = new Date().getFullYear();

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false");

    window.location.replace("../registration/register.html");
  });
}

function getCart() {
  const saved = localStorage.getItem("simple_cart");
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("simple_cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1; // UPDATE
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      imageCover: product.imageCover,
      quantity: 1, // CREATE
    });
  }
  saveCart(cart);
  renderCart();
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    // DELETE
    const filtered = cart.filter((p) => p.id !== id);
    saveCart(filtered);
  } else {
    saveCart(cart);
  }
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  const data = await res.json();
  return data.data || [];
}

async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  const data = await res.json();
  return data.data || [];
}

let allProducts = [];
let allCategories = [];

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm";
  card.style.cursor = "pointer";
  card.addEventListener("click", function () {
    window.location.href = `../productDetails/productDetails.html?id=${encodeURIComponent(
      product._id
    )}`;
  });

  const img = document.createElement("img");
  img.src = product.imageCover;
  img.className = "card-img-top object-fit-contain p-3";
  img.alt = product.title;
  img.style.height = "200px";

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const title = document.createElement("h6");
  title.className = "card-title";
  title.textContent = product.title;

  const category = document.createElement("p");
  category.className = "card-text text-muted small mb-1";
  if (product.category && product.category.name) {
    category.textContent = product.category.name;
  }

  const price = document.createElement("p");
  price.className = "fw-bold mb-2";
  price.textContent = `$${product.price}`;

  const btn = document.createElement("button");
  btn.className = "btn btn-primary mt-auto w-100";
  btn.textContent = "Add to Cart";
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      imageCover: product.imageCover,
    });
  });

  body.appendChild(title);
  body.appendChild(category);
  body.appendChild(price);
  body.appendChild(btn);

  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryId = categoryFilter.value;

  const filtered = allProducts.filter((product) => {
    let ok = true;
    if (searchValue) {
      ok =
        ok &&
        product.title.toLowerCase().includes(searchValue);
    }
    if (categoryId) {
      ok =
        ok &&
        product.category &&
        product.category._id === categoryId;
    }
    return ok;
  });

  renderProducts(filtered);
}

function renderProducts(products) {
  productsRow.innerHTML = "";
  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-center text-muted py-5";
    empty.textContent = "No products found.";
    productsRow.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    productsRow.appendChild(createProductCard(product));
  });
}

function renderCategories() {
  categoryFilter.innerHTML = `<option value="">All categories</option>`;
  allCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat._id;
    option.textContent = cat.name;
    categoryFilter.appendChild(option);
  });
}

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = "";

  if (ordersBtn) {
    ordersBtn.disabled = cart.length === 0;
  }

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<p class="text-muted mb-0">Your cart is empty.</p>';
    cartTotalEl.textContent = "$0";
    cartCountEl.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className =
      "d-flex align-items-center justify-content-between mb-2 border-bottom pb-2";

    const left = document.createElement("div");
    left.className = "d-flex align-items-center gap-2";

    const img = document.createElement("img");
    img.src = item.imageCover;
    img.alt = item.title;
    img.className = "rounded";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.objectFit = "cover";

    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "small fw-semibold";
    title.textContent = item.title;
    const price = document.createElement("div");
    price.className = "small text-muted";
    price.textContent = `$${item.price}`;
    info.appendChild(title);
    info.appendChild(price);

    left.appendChild(img);
    left.appendChild(info);

    const right = document.createElement("div");
    right.className =
      "d-flex align-items-center gap-1";

    const minusBtn = document.createElement("button");
    minusBtn.className =
      "btn btn-sm btn-outline-secondary";
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", function () {
      changeQuantity(item.id, -1);
    });

    const qty = document.createElement("span");
    qty.className = "px-2";
    qty.textContent = item.quantity;

    const plusBtn = document.createElement("button");
    plusBtn.className =
      "btn btn-sm btn-outline-secondary";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", function () {
      changeQuantity(item.id, 1);
    });

    right.appendChild(minusBtn);
    right.appendChild(qty);
    right.appendChild(plusBtn);

    row.appendChild(left);
    row.appendChild(right);

    cartItemsEl.appendChild(row);

    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartTotalEl.textContent = "$" + total.toFixed(2);
  cartCountEl.textContent = String(count);
}

async function init() {
  renderCart();

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);
    allProducts = products;
    allCategories = categories;
    renderCategories();
    renderProducts(allProducts);
  } catch (error) {
    productsRow.innerHTML =
      '<p class="text-danger text-center py-5">Failed to load products. Please try again later.</p>';
  } finally {
    loadingEl.style.display = "none";
  }
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
clearCartBtn.addEventListener("click", clearCart);
if (ordersBtn) {
  ordersBtn.addEventListener("click", () => {
    window.location.href = "../orders/order.html";
  });
}

init();

