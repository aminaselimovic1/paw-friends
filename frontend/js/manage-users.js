// Manage users page (admin): every account, with search, a role filter, and
// add / edit / delete in modals.
// Milestone 1: sample data, kept until the page is reloaded. From M4 the list
// comes from the REST API, and saving and deleting become requests to it.
//
// Reuses: getNextId (admin-dashboard.js), sampleAdoptionApplications
// (my-applications.js), sampleVetRecords and sampleVaccinations
// (pet-details.js), capitalizeFirstLetter (pets.js) and resetForm (auth.js).

// Same columns as the planned users table, without password_hash: a password
// (even a hashed one) is never sent to the browser. phone and city are shown
// on Profile; they aren't in the planned table yet (a schema decision for M2).
// The emails match the demo login: admin@example.com = admin, emina.vet@... = vet.
// The vets' ids match vet_id on the health records.
const sampleUsers = [
  { id: 1, name: "Selma Hodžić", email: "admin@example.com", role: "admin", phone: "+387 33 111 222", city: "Sarajevo" },
  { id: 2, name: "Emina Mehić", email: "emina.vet@example.com", role: "vet", phone: "+387 61 222 333", city: "Sarajevo" },
  { id: 3, name: "Amar Hadžić", email: "amar@example.com", role: "user", phone: null, city: null },
  { id: 4, name: "Adnan Begić", email: "adnan.vet@example.com", role: "vet", phone: null, city: null },
  { id: 5, name: "Sara Kovačević", email: "sara@example.com", role: "user", phone: null, city: null },
  { id: 6, name: "Tarik Delić", email: "tarik@example.com", role: "user", phone: null, city: null },
  { id: 7, name: "Lejla Kovač", email: "lejla@example.com", role: "user", phone: "+387 61 123 456", city: "Sarajevo" },
  { id: 8, name: "Ivana Marić", email: "ivana@example.com", role: "user", phone: null, city: null }
];

// The accounts that are "logged in" in the demo: the admin (Selma) and the
// user (Lejla); the vet is demoVet (pet-details.js). In M4 the logged-in
// user comes from the JWT token. See getDemoAccount() in roles.js.
const demoAdminId = 1;
const demoUserId = 7;

function findUserById(userId) {
  return sampleUsers.find(function (user) {
    return user.id === userId;
  });
}

// How many records point to this user: their applications, the applications
// they reviewed (admins) and the health records they wrote (vets).
// Deleting the user would leave those without an owner, so it isn't allowed
// (a database with foreign keys would refuse it too).
function countUserHistory(userId) {
  const applications = sampleAdoptionApplications.filter(function (application) {
    return application.user_id === userId || application.reviewed_by === userId;
  });
  const visits = sampleVetRecords.filter(function (record) { return record.vet_id === userId; });
  const vaccinations = sampleVaccinations.filter(function (vaccination) { return vaccination.vet_id === userId; });
  return applications.length + visits.length + vaccinations.length;
}

// The users that match the search (name or email) AND the role filter
function getFilteredUsers() {
  const search = $("#userSearch").val().trim().toLowerCase();
  const role = $("#userRoleFilter").val(); // "all", "user", "vet" or "admin"
  return sampleUsers.filter(function (user) {
    const matchesSearch = user.name.toLowerCase().includes(search)
      || user.email.toLowerCase().includes(search);
    return matchesSearch && (role === "all" || user.role === role);
  });
}

// One table row, from the <template> in manage-users.html.
// .text() and .attr() put the data in as plain text, never as HTML.
// data-id on the buttons tells the click handlers which user it is.
function createUserRow(user) {
  const row = $($("#userRowTemplate").html());
  row.find(".user-name").text(user.name);
  row.find(".user-you").toggleClass("d-none", user.id !== demoAdminId);
  row.find(".user-email").text(user.email);
  row.find(".user-role").text(capitalizeFirstLetter(user.role));
  row.find(".edit-user").attr("data-id", user.id).attr("aria-label", "Edit " + user.name);
  row.find(".delete-user").attr("data-id", user.id).attr("aria-label", "Delete " + user.name);
  return row;
}

// The table, the count, or the empty message
function renderManageUsers() {
  const shown = getFilteredUsers();
  const body = $("#userTableBody").empty();
  shown.forEach(function (user) {
    body.append(createUserRow(user));
  });

  const word = sampleUsers.length === 1 ? "user" : "users";
  $("#userCount").text(shown.length === sampleUsers.length
    ? sampleUsers.length + " " + word
    : "Showing " + shown.length + " of " + sampleUsers.length + " " + word);
  $("#userTableWrapper").toggleClass("d-none", shown.length === 0);
  $("#userEmpty").toggleClass("d-none", shown.length > 0);
}

// After a save or delete: the message above the table, and the table again
function showUserSaved(message) {
  $("#userSaved").text(message).removeClass("d-none");
  renderManageUsers();
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "manage-users") {
    renderManageUsers();
  }
});

// Search and filter
$(document).on("input", "#userSearch", renderManageUsers);
$(document).on("change", "#userRoleFilter", renderManageUsers);
$(document).on("submit", "#userFilters", function (e) {
  e.preventDefault(); // Enter in the search box would reload the page
});
$(document).on("click", "#userClearFilters", function () {
  document.getElementById("userFilters").reset();
  renderManageUsers();
});


// ---------- Add and edit (one modal) ----------

// Fills the form and opens it: an empty form for a new user, or the user's values
function openUserForm(user) {
  const isNew = user === undefined;
  const isYou = !isNew && user.id === demoAdminId;
  $("#userFormTitle").text(isNew ? "Add user" : "Edit " + user.name);
  $("#userId").val(isNew ? "" : user.id);
  $("#userName").val(isNew ? "" : user.name);
  $("#userEmail").val(isNew ? "" : user.email);
  $("#userRole").val(isNew ? "user" : user.role);
  // You can't change your own role (otherwise the last admin could lock themselves out)
  $("#userRole").prop("disabled", isYou);
  $("#userRoleNote").toggleClass("d-none", !isYou);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("userFormModal")).show();
}

$(document).on("click", "#addUserButton", function () {
  openUserForm();
});

$(document).on("click", ".edit-user", function () {
  openUserForm(findUserById(Number($(this).attr("data-id"))));
});

// users.email is unique: true when an account other than ownId already uses
// this email (compared lowercased). Also used by the Profile page.
function isEmailUsedByOther(email, ownId) {
  const wanted = email.trim().toLowerCase();
  return sampleUsers.some(function (user) {
    return user.id !== ownId && user.email.toLowerCase() === wanted;
  });
}

// setCustomValidity() marks the field invalid, like the password match on register.
function checkUserEmailIsFree() {
  const field = document.getElementById("userEmail");
  const editedId = Number($("#userId").val()); // 0 for a new user, so it matches nobody
  const usedByOther = isEmailUsedByOther(field.value, editedId);
  field.setCustomValidity(usedByOther ? "This email is already used by another account." : "");
  // The error text under the field: "already used", or the normal one
  $("#userEmailFeedback").text(usedByOther
    ? "This email is already used by another account."
    : "Enter a valid email address, e.g. name@example.com.");
}

$(document).on("input", "#userEmail", checkUserEmailIsFree);

$(document).on("submit", "#userForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this); // from auth.js
  checkUserEmailIsFree();
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  const id = $("#userId").val(); // "" for a new user
  const name = $("#userName").val().trim();
  const email = $("#userEmail").val().trim();
  const role = $("#userRole").val();

  // Demo (M1): saved in sampleUsers. In M4: POST /users or PUT /users/{id}.
  if (id === "") {
    sampleUsers.push({ id: getNextId(sampleUsers), name: name, email: email, role: role });
    showUserSaved(name + " was added.");
  } else {
    const user = findUserById(Number(id));
    user.name = name;
    user.email = email;
    // Your own role stays: the field is only disabled, and a script could still change its value
    if (user.id !== demoAdminId) {
      user.role = role;
    }
    showUserSaved("Changes to " + name + " were saved.");
  }
  bootstrap.Modal.getInstance(document.getElementById("userFormModal")).hide();
});

// The form closed (saved, Cancel, X or Esc): empty it for next time
$(document).on("hidden.bs.modal", "#userFormModal", function () {
  resetForm(document.getElementById("userForm")); // from auth.js
});


// ---------- Delete ----------

// Why this user can't be deleted, or "" if they can
function getUserDeleteBlockReason(user) {
  const historyCount = countUserHistory(user.id);
  if (user.id === demoAdminId) {
    return "You can't delete your own account.";
  }
  if (historyCount > 0) {
    return user.name + " can't be deleted: " + historyCount
      + " application(s) or health record(s) belong to this account and would lose their owner.";
  }
  return "";
}

// Opens the delete modal: it asks first, or explains why the user can't be deleted
$(document).on("click", ".delete-user", function () {
  const user = findUserById(Number($(this).attr("data-id")));
  const reason = getUserDeleteBlockReason(user);

  $("#userDeleteTitle").text("Delete " + user.name + "?");
  $("#userDeleteText").text(reason || "This removes the account. It can't be undone.");
  // Only a user that can be deleted gets the red Delete button
  $("#confirmDeleteUser").attr("data-id", user.id).toggleClass("d-none", reason !== "");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("userDeleteModal")).show();
});

$(document).on("click", "#confirmDeleteUser", function () {
  const user = findUserById(Number($(this).attr("data-id")));
  // Check again: when the user can't be deleted the button is only hidden
  // (d-none), so a script could still click it. From M4 the backend checks this too.
  if (user === undefined || getUserDeleteBlockReason(user) !== "") {
    return;
  }
  // splice(index, 1) removes one item from the array at that position
  sampleUsers.splice(sampleUsers.indexOf(user), 1);
  bootstrap.Modal.getInstance(document.getElementById("userDeleteModal")).hide();
  showUserSaved(user.name + " was deleted.");
});
