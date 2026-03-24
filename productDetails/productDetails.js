const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

const detailsEl = document.getElementById("productDetails");
const loadingEl = document.getElementById("detailsLoading");
const alertEl = document.getElementById("detailsAlert");

function showError(message) {
  if (alertEl) {
    alertEl.textContent = message;
    alertEl.classList.remove("d-none");
  }
  if (loadingEl) loadingEl.classList.add("d-none");
  if (detailsEl) detailsEl.classList.add("d-none");
}

function showDetails(product) {
  if (!detailsEl) return;

  const mainImg =
    (Array.isArray(product.images) && product.images[0]) ||
    product.imageCover ||
    "";

  document.title = product.title ? `${product.title} | Details` : "Product Details";

  detailsEl.innerHTML = `
    <div class="card shadow-sm details-card">
      <div class="row g-0">
        <div class="col-12 col-md-6 p-3 bg-white">
          <img class="details-img" src="${mainImg}" alt="${product.title || "Product"}" />
        </div>
        <div class="col-12 col-md-6 p-4">
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${product.category?.name ? `<span class="meta-pill">${product.category.name}</span>` : ""}
            ${product.brand?.name ? `<span class="meta-pill">${product.brand.name}</span>` : ""}
            ${typeof product.ratingsAverage === "number" ? `<span class="meta-pill">⭐ ${product.ratingsAverage.toFixed(1)}</span>` : ""}
          </div>

          <h2 class="fw-bold mb-2">${product.title || "Untitled product"}</h2>
          <div class="price text-primary mb-3">$${product.price ?? "-"}</div>

          <p class="text-muted mb-4">${product.description || "No description available."}</p>

          <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary" href="../carts/carts.html">Back</a>
            <button class="btn btn-primary" id="addToCartFromDetails" type="button">Add to Cart</button>
          </div>
          <div id="detailsMsg" class="small text-success mt-3"></div>
        </div>
      </div>
    </div>
  `;

  const addBtn = document.getElementById("addToCartFromDetails");
  const msg = document.getElementById("detailsMsg");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const saved = localStorage.getItem("simple_cart");
      let cart = [];
      try {
        cart = saved ? JSON.parse(saved) : [];
      } catch {
        cart = [];
      }

      const existing = cart.find((item) => item.id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product._id,
          title: product.title,
          price: product.price,
          imageCover: product.imageCover,
          quantity: 1,
        });
      }

      localStorage.setItem("simple_cart", JSON.stringify(cart));
      if (msg) msg.textContent = "Added to cart.";
    });
  }

  if (loadingEl) loadingEl.classList.add("d-none");
  detailsEl.classList.remove("d-none");
}

async function fetchProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`);
  if (!res.ok) {
    throw new Error(`Failed to load product (${res.status})`);
  }
  const data = await res.json();
  return data?.data;
}

function redirectTo404() {
  const from = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`../Error404.html?from=${from}`);
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) {
    redirectTo404();
    return;
  }

  try {
    const product = await fetchProduct(productId);
    if (!product) {
      redirectTo404();
      return;
    }
    showDetails(product);
  } catch (e) {
    const msg = String(e?.message || "");
    if (msg.includes("(404)")) {
      redirectTo404();
      return;
    }
    showError(e?.message || "Failed to load product details.");
  }
}

init();

