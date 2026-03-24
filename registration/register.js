import {
  completeSignUpAndSignIn,
  redirectIfAuthenticated,
  trySignIn,
} from "../shared/auth.js";

redirectIfAuthenticated("../home_page/home.html");

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

const regForm = document.getElementById("regForm");
const signinForm = document.getElementById("signinForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const pass = document.getElementById("pass");
const repeatPass = document.getElementById("repeatPass");
const terms = document.getElementById("terms");
const city = document.getElementById("city");

const signinEmail = document.getElementById("signinEmail");
const signinPass = document.getElementById("signinPass");

const nameMsg = document.getElementById("nameMsg");
const emailMsg = document.getElementById("emailMsg");
const passMsg = document.getElementById("passMsg");
const formFeedback = document.getElementById("formFeedback");
const signinFeedback = document.getElementById("signinFeedback");

function setStatus(input, msgDiv, isValid, message) {
  if (!msgDiv) return;

  if (!isValid) {
    input.style.border = "1px solid #ff4b2b";
    msgDiv.innerText = message;
  } else {
    input.style.border = "none";
    msgDiv.innerText = "";
  }
}

function clearFeedback() {
  if (formFeedback) formFeedback.innerText = "";
  if (signinFeedback) signinFeedback.innerText = "";
}

fullName.addEventListener("blur", () => {
  const val = fullName.value.trim();
  const ok = val.length >= 4;
  setStatus(fullName, nameMsg, ok, "Invalid name (min 4 chars)");
});

email.addEventListener("blur", () => {
  const val = email.value.trim();
  const ok = val.includes("@") && val.length >= 6;
  setStatus(email, emailMsg, ok, "Valid email required");
});

repeatPass.addEventListener("blur", () => {
  const ok = pass.value !== "" && pass.value === repeatPass.value;
  setStatus(repeatPass, passMsg, ok, "Passwords do not match");
});

regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearFeedback();

  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,29}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const fullNameVal = fullName.value.trim();
  const emailVal = email.value.trim();
  const passVal = pass.value;
  const repeatVal = repeatPass.value;
  const cityVal = city.value;

  const isNameValid = userNameRegex.test(fullNameVal);
  const isEmailValid = emailRegex.test(emailVal);
  const isPassValid = passwordRegex.test(passVal);
  const isMatch = passVal !== "" && passVal === repeatVal;
  const isCitySelected = Boolean(cityVal);
  const isTermsChecked = terms.checked;

  setStatus(fullName, nameMsg, isNameValid, "Invalid name (min 3 chars)");
  setStatus(email, emailMsg, isEmailValid, "Valid email required");
  setStatus(repeatPass, passMsg, isMatch, "Passwords do not match");

  if (!isPassValid && passMsg) {
    passMsg.innerText = "Password must be at least 8 chars and include a number.";
  }

  if (!isTermsChecked) {
    if (formFeedback) formFeedback.innerText = "You must accept the terms.";
    return;
  }
  if (!isCitySelected) {
    if (formFeedback) formFeedback.innerText = "Please select your city.";
    return;
  }

  if (!isNameValid || !isEmailValid || !isPassValid || !isMatch) {
    if (formFeedback) formFeedback.innerText = "Please complete all fields correctly.";
    return;
  }

  completeSignUpAndSignIn({
    fullName: fullNameVal,
    email: emailVal,
    password: passVal,
    city: cityVal,
    termsAccepted: true,
    
  });

  window.location.replace("../home_page/home.html");
});

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearFeedback();

  const emailVal = signinEmail.value.trim();
  const passVal = signinPass.value;
  const result = trySignIn(emailVal, passVal);
  if (!result.ok) {
    if (signinFeedback) signinFeedback.innerText = result.reason;
    return;
  }

  window.location.replace("../home_page/home.html");
});