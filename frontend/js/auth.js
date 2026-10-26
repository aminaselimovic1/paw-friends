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

  // Back to the page that sent you here (#login?next=my-applications), or
  // home. Only the part after # changes, so "next" can't lead to another
  // site, and the router still checks that the new role may open the page.
  const next = getHashParam("next"); // from router.js
  window.location.hash = next ? "#" + next : "#home";
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

// ---------- Spaces at the start and end don't count (every form) ----------

// The browser's required and minlength look at the value as typed, so a name
// of only spaces passes them. This checks the trimmed value instead: "   "
// counts as empty, and " a " as 1 character. A field that fails gets a
// custom error (setCustomValidity, like the password match), so Bootstrap
// shows its normal message. The save code trims the values too (.trim()).
// (We can't just trim the field and check again: minlength only checks
// values typed by the user, not values set by JavaScript.)
// Passwords aren't included: a space can be part of a password, so it's
// never trimmed. pattern=".*\S.*" on the new-password fields refuses only spaces.
function checkTrimmedField(field) {
  const length = field.value.trim().length;
  let tooShort = false;
  if (length === 0) {
    tooShort = field.required; // only spaces = empty
  } else if (field.minLength > 0) { // minLength is -1 when there's no minlength
    tooShort = length < field.minLength;
  }
  field.setCustomValidity(tooShort ? "Too short" : "");
}

const trimmedFieldSelector = 'input[type="text"], input[type="tel"], textarea';

// Checks every text field of a form. Call it before form.checkValidity().
function checkTrimmedFields(form) {
  $(form).find(trimmedFieldSelector).each(function () {
    checkTrimmedField(this);
  });
}

// While typing, so the red/green style follows the trimmed value
$(document).on("input", trimmedFieldSelector, function () {
  checkTrimmedField(this);
});


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
  checkTrimmedFields(this);
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
