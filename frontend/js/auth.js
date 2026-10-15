// Login and register forms (Milestone 1: there is no backend yet).
// The router loads the views later, so every event is bound to document
// ("event delegation"): it also works for forms that don't exist yet.

// ---------- Show/hide password ----------

// Switches a password field between hidden (type="password") and visible (type="text")
function setPasswordVisible(button, visible) {
  $(button).siblings("input").attr("type", visible ? "text" : "password");
  $(button).attr("aria-label", visible ? "Hide password" : "Show password");
  $(button).find("i").attr("class", visible ? "bi bi-eye-slash" : "bi bi-eye");
}

$(document).on("click", ".password-toggle", function () {
  const isHidden = $(this).siblings("input").attr("type") === "password";
  setPasswordVisible(this, isHidden);
});


// ---------- Login ----------

// Demo login (M1): the email decides the role. In M4 the backend checks
// the password instead, and the role comes from the JWT token.
function getDemoRoleForEmail(email) {
  email = email.trim().toLowerCase();
  if (email === "admin@example.com") {
    return "admin";
  }
  if (email === "emina.vet@example.com") {
    return "vet";
  }
  return "user";
}

$(document).on("submit", "#loginForm", function (e) {
  // Stops the browser from sending the form and reloading the page
  e.preventDefault();

  // was-validated makes Bootstrap show the red/green styles and the errors
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // invalid: stop here, the errors are shown
  }

  setRole(getDemoRoleForEmail($("#loginEmail").val())); // from roles.js
  window.location.hash = "#home";
});


// ---------- Register ----------

// "Confirm password" must match "Password". An empty custom message means
// valid; any other text makes the field invalid, so its error is shown.
function checkPasswordsMatch() {
  const confirmField = document.getElementById("registerConfirmPassword");
  const matches = confirmField.value === $("#registerPassword").val();
  confirmField.setCustomValidity(matches ? "" : "Passwords don't match");
}

$(document).on("input", "#registerPassword, #registerConfirmPassword", checkPasswordsMatch);

// Empties a form and removes its validation styles
function resetForm(form) {
  form.reset();
  $(form).removeClass("was-validated");
  // form.reset() clears the values but not the attributes, so a revealed
  // password would stay type="text". Hide them all again.
  $(form).find(".password-toggle").each(function () {
    setPasswordVisible(this, false);
  });
}

$(document).on("submit", "#registerForm", function (e) {
  e.preventDefault();
  checkPasswordsMatch();

  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  // Demo (M1): nothing is saved yet. In M4 the data goes to the backend,
  // which creates the account with the role "user".
  resetForm(this);
  $("#registerSuccess").removeClass("d-none");
});
