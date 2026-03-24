const yearSpan = document.getElementById("yearSpan");
if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

const goBackBtn = document.getElementById("goBackBtn");
if (goBackBtn) {
  goBackBtn.addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "./home_page/home.html";
  });
}

const missingPath = document.getElementById("missingPath");
const missingPathWrap = document.getElementById("missingPathWrap");
try {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");
  if (from && missingPath && missingPathWrap) {
    missingPath.textContent = from;
    missingPathWrap.classList.remove("d-none");
  }
} catch {
  // ignore
}

