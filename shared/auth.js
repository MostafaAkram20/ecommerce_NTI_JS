export function getStoredUser() {
  const email = localStorage.getItem("email") || "";
  const password = localStorage.getItem("pass") || "";
  const fullName = localStorage.getItem("name") || "";
  const city = localStorage.getItem("city") || "";

  if (!email || !password) return null;

  return { fullName, email, password, city };
}

export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function setAuthenticated(value) {
  localStorage.setItem("isLoggedIn", value ? "true" : "false");
}

export function clearUser() {
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("pass");
  localStorage.removeItem("city");
  localStorage.removeItem("terms");
  localStorage.removeItem("isLoggedIn");
}

export function signOut() {
  setAuthenticated(false);
}

export function trySignIn(email, password) {
  const user = getStoredUser();
  if (!user) return { ok: false, reason: "No account found. Please sign up first." };

  const ok = email === user.email && password === user.password;
  if (!ok) return { ok: false, reason: "Invalid email or password." };

  setAuthenticated(true);
  return { ok: true, user };
}

export function completeSignUpAndSignIn(user) {
  localStorage.setItem("name", user.fullName || "");
  localStorage.setItem("email", user.email || "");
  localStorage.setItem("pass", user.password || "");
  localStorage.setItem("city", user.city || "");
  localStorage.setItem("terms", String(Boolean(user.termsAccepted)));

  setAuthenticated(true);
}

export function redirectIfAuthenticated(toRelativeUrl) {
  if (isAuthenticated()) {
    window.location.replace(toRelativeUrl);
  }
}

export function requireAuth(orRedirectToRelativeUrl) {
  if (!isAuthenticated()) {
    window.location.replace(orRedirectToRelativeUrl);
    return false;
  }
  return true;
}

