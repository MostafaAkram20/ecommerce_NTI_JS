import { getStoredUser, requireAuth, signOut } from "../shared/auth.js";

requireAuth("../registration/register.html");

const yearSpan = document.getElementById("yearSpan");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

getStoredUser();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut();
    window.location.replace("../registration/register.html");
  });
}