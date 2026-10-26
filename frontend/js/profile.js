// Profile page (user, vet and admin; the role badge shows which one).
// Milestone 1: sample data instead of the backend. It shows the account of
// the current demo role from sampleUsers (getDemoAccount() in roles.js), so
// a change here also shows on Manage users and the dashboards, until the
// page is reloaded. From M4 the data comes from the API.
//
// Reuses: getDemoAccount (roles.js), isEmailUsedByOther (manage-users.js),
// resetForm and checkTrimmedFields (auth.js).

// "Lejla Kovač" -> "LK" (the first letters of the first two words)
function getInitials(name) {
  return name.split(" ")
    .filter(function (word) { return word !== ""; })
    .slice(0, 2)
    .map(function (word) { return word[0]; })
    .join("")
    .toUpperCase();
}

// Fills the header and the read-only personal information.
// .text() puts the values in as plain text, never as HTML.
function renderProfile() {
  const role = getRole(); // from roles.js: "user", "vet", ...
  const account = getDemoAccount();
  $("#profileInitials").text(getInitials(account.name));
  $("#profileName").text(account.name);
  $("#profileRole").text(role.charAt(0).toUpperCase() + role.slice(1));

  $("#infoName").text(account.name);
  $("#infoEmail").text(account.email);
  $("#infoPhone").text(account.phone || "Not provided");
  $("#infoCity").text(account.city || "Not provided");
  $("#securityEmail").text(account.email);
}

// Switches the personal information card between showing and editing
function showProfileForm(editing) {
  $("#profileInfo").toggleClass("d-none", editing);
  $("#editProfileButton").toggleClass("d-none", editing);
  $("#profileForm").toggleClass("d-none", !editing);
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "profile") {
    renderProfile();
  }
});

// A different role picked in the demo bar while on this page: show that
// role's account. (roles.js handles the same event first, so getRole() is
// new. Switching to Guest has already left this page then.)
$(document).on("change", "#roleSelect", function () {
  if (getRouteFromHash() === "profile") { // from router.js
    // An open edit form and the "saved" message belonged to the old account
    resetForm(document.getElementById("profileForm"));
    showProfileForm(false);
    $("#profileSaved").addClass("d-none");
    renderProfile();
  }
});


// ---------- B. Personal information: Edit / Save changes ----------

// "Edit": copy the current values into the form and show it
$(document).on("click", "#editProfileButton", function () {
  const account = getDemoAccount();
  $("#profileSaved").addClass("d-none");
  $("#editName").val(account.name);
  $("#editEmail").val(account.email);
  $("#editPhone").val(account.phone);
  $("#editCity").val(account.city);
  showProfileForm(true);
});

// users.email is unique, so the email can't be another account's
// (the same rule as on Manage users)
function checkProfileEmailIsFree() {
  const field = document.getElementById("editEmail");
  const usedByOther = isEmailUsedByOther(field.value, getDemoAccount().id);
  field.setCustomValidity(usedByOther ? "This email is already used by another account." : "");
  $("#editEmailFeedback").text(usedByOther
    ? "This email is already used by another account."
    : "Enter a valid email address, e.g. name@example.com.");
}

$(document).on("input", "#editEmail", checkProfileEmailIsFree);

// "Cancel": throw the changes away and show the saved values again
$(document).on("click", "#cancelProfileButton", function () {
  resetForm(document.getElementById("profileForm")); // from auth.js
  showProfileForm(false);
});

// "Save changes"
$(document).on("submit", "#profileForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this); // from auth.js: a name of only spaces counts as empty
  checkProfileEmailIsFree();

  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // invalid: stop here, the errors are shown
  }

  // Demo (M1): saved in the account in sampleUsers. In M4 this becomes a
  // request to the API. Values are trimmed; empty optional fields become null.
  const account = getDemoAccount();
  account.name = $("#editName").val().trim();
  account.email = $("#editEmail").val().trim();
  account.phone = $("#editPhone").val().trim() || null;
  account.city = $("#editCity").val().trim() || null;

  resetForm(this);
  showProfileForm(false);
  renderProfile();
  $("#profileSaved").removeClass("d-none");
});


// ---------- C. Account security: change password ----------

// "Confirm new password" must match "New password" (same idea as register)
function checkNewPasswordsMatch() {
  const confirmField = document.getElementById("confirmNewPassword");
  const matches = confirmField.value === $("#newPassword").val();
  confirmField.setCustomValidity(matches ? "" : "Passwords don't match");
}

$(document).on("input", "#newPassword, #confirmNewPassword", checkNewPasswordsMatch);

$(document).on("submit", "#passwordForm", function (e) {
  e.preventDefault();
  checkNewPasswordsMatch();

  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  // Demo (M1): nothing is checked or saved. In M4 the backend checks the
  // current password against the stored hash (password_verify) and saves
  // only a hash of the new one (password_hash), never the password itself.
  resetForm(this); // also hides any revealed password again
  $("#passwordChanged").removeClass("d-none");
});
