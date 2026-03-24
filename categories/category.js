const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

const productsRow = document.getElementById("productsRow");
const loadingEl = document.getElementById("loading");
const titleEl = document.getElementById("pageTitle");
const subTitleEl = document.getElementById("pageSubtitle");
const alertEl = document.getElementById("pageAlert");
const yearSpan = document.getElementById("yearSpan");

if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

function showError(message) {
  if (alertEl) {
    alertEl.textContent = message;
    alertEl.classList.remove("d-none");
  }
  if (loadingEl) loadingEl.classList.add("d-none");
}

function redirectTo404() {
  const from = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`../Error404.html?from=${from}`);
}

function getCategoryName() {
  return (
    document.body?.dataset?.categoryName ||
    document.documentElement?.dataset?.categoryName ||
    ""
  ).trim();
}

async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  const data = await res.json();
  return data.data || [];
}

function getCart() {
  const saved = localStorage.getItem("simple_cart");
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("simple_cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart(cart);
}

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm product-card";
  card.addEventListener("click", () => {
    window.location.href = `../productDetails/productDetails.html?id=${encodeURIComponent(
      product._id
    )}`;
  });

  const img = document.createElement("img");
  img.src = product.imageCover;
  img.alt = product.title;
  img.className = "card-img-top p-3 product-img";

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const title = document.createElement("h6");
  title.className = "card-title";
  title.textContent = product.title;

  const price = document.createElement("div");
  price.className = "fw-bold mb-2";
  price.textContent = `$${product.price}`;

  const btn = document.createElement("button");
  btn.className = "btn btn-primary mt-auto w-100";
  btn.textContent = "Add to Cart";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      imageCover: product.imageCover,
    });
    btn.textContent = "Added";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.disabled = false;
    }, 800);
  });

  body.appendChild(title);
  body.appendChild(price);
  body.appendChild(btn);

  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function renderProducts(products) {
  if (!productsRow) return;
  productsRow.innerHTML = "";

  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-center text-muted py-5";
    empty.textContent = "No products found for this category.";
    productsRow.appendChild(empty);
    return;
  }

  products.forEach((p) => productsRow.appendChild(createProductCard(p)));
}

async function init() {
  const categoryName = getCategoryName();
  if (!categoryName) {
    redirectTo404();
    return;
  }

  if (titleEl) titleEl.textContent = categoryName;
  if (subTitleEl)
    subTitleEl.textContent = "Browse products in this category.";

  try {
    const all = await fetchProducts();
    const filtered = all.filter(
      (p) =>
        p?.category?.name &&
        p.category.name.toLowerCase() === categoryName.toLowerCase()
    );
    renderProducts(filtered);
  } catch (e) {
    showError(e?.message || "Failed to load products.");
  } finally {
    if (loadingEl) loadingEl.classList.add("d-none");
  }
}

init();

