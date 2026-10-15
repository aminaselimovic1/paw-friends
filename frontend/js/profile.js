// Profile page (user, vet and admin; the role badge shows which one).
// Milestone 1: sample data instead of the backend. Changes are kept in this
// object until the page is reloaded. From M4 the data comes from the API.

// Same field names as the database (snake_case). The planned users table
// has no phone and city columns yet: that's a schema decision for M2.
const sampleUser = {
  id: 7,
  name: "Lejla Kovač",
  email: "lejla@example.com",
  phone: "+387 61 123 456",
  city: "Sarajevo"
};

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
  $("#profileInitials").text(getInitials(sampleUser.name));
  $("#profileName").text(sampleUser.name);
  $("#profileRole").text(role.charAt(0).toUpperCase() + role.slice(1));

  $("#infoName").text(sampleUser.name);
  $("#infoEmail").text(sampleUser.email);
  $("#infoPhone").text(sampleUser.phone || "Not provided");
  $("#infoCity").text(sampleUser.city || "Not provided");
  $("#securityEmail").text(sampleUser.email);
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

// A different role picked in the demo bar while on this page: update the
// role badge. (roles.js handles the same event first, so getRole() is new.)
$(document).on("change", "#roleSelect", function () {
  if (getRouteFromHash() === "profile") { // from router.js
    renderProfile();
  }
});


// ---------- B. Personal information: Edit / Save changes ----------

// "Edit": copy the current values into the form and show it
$(document).on("click", "#editProfileButton", function () {
  $("#profileSaved").addClass("d-none");
  $("#editName").val(sampleUser.name);
  $("#editEmail").val(sampleUser.email);
  $("#editPhone").val(sampleUser.phone);
  $("#editCity").val(sampleUser.city);
  showProfileForm(true);
});

// "Cancel": throw the changes away and show the saved values again
$(document).on("click", "#cancelProfileButton", function () {
  resetForm(document.getElementById("profileForm")); // from auth.js
  showProfileForm(false);
});

// "Save changes"
$(document).on("submit", "#profileForm", function (e) {
  e.preventDefault();

  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // invalid: stop here, the errors are shown
  }

  // Demo (M1): saved only in sampleUser. In M4 this becomes a request to the API.
  sampleUser.name = $("#editName").val();
  sampleUser.email = $("#editEmail").val();
  sampleUser.phone = $("#editPhone").val();
  sampleUser.city = $("#editCity").val();

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
