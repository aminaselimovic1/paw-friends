// Manage shelters page (admin): every shelter, with search, and add / edit /
// delete in modals.
// Milestone 1: sample data, kept until the page is reloaded. The shelters are
// sampleShelters from shelters.js, so changes show up on the Shelters pages too.
// From M4 saving and deleting become requests to the REST API.
//
// Reuses: sampleShelters (shelters.js), samplePets (pets.js), findShelterById
// (manage-pets.js), getNextId (admin-dashboard.js) and resetForm (auth.js).

// The pets of this shelter (all statuses)
function getShelterPets(shelterId) {
  return samplePets.filter(function (pet) {
    return pet.shelter_id === shelterId;
  });
}

// The shelters whose name or city contains the search text
function getFilteredManagedShelters() {
  const search = $("#manageShelterSearch").val().trim().toLowerCase();
  return sampleShelters.filter(function (shelter) {
    return shelter.name.toLowerCase().includes(search)
      || shelter.city.toLowerCase().includes(search);
  });
}

// One table row, from the <template> in manage-shelters.html.
// .text() and .attr() put the data in as plain text, never as HTML.
function createManagedShelterRow(shelter) {
  const row = $($("#manageShelterRowTemplate").html());
  row.find(".managed-shelter-name").text(shelter.name).attr("href", "#shelter-details?id=" + shelter.id);
  row.find(".managed-shelter-city").text(shelter.city);
  row.find(".managed-shelter-phone").text(shelter.phone);
  row.find(".managed-shelter-email").text(shelter.email);
  row.find(".managed-shelter-pets").text(getShelterPets(shelter.id).length);
  row.find(".edit-shelter").attr("data-id", shelter.id).attr("aria-label", "Edit " + shelter.name);
  row.find(".delete-shelter").attr("data-id", shelter.id).attr("aria-label", "Delete " + shelter.name);
  return row;
}

// The table, the count, or the empty message
function renderManageShelters() {
  const shown = getFilteredManagedShelters();
  const body = $("#manageShelterTableBody").empty();
  shown.forEach(function (shelter) {
    body.append(createManagedShelterRow(shelter));
  });

  const word = sampleShelters.length === 1 ? "shelter" : "shelters";
  $("#manageShelterCount").text(shown.length === sampleShelters.length
    ? sampleShelters.length + " " + word
    : "Showing " + shown.length + " of " + sampleShelters.length + " " + word);
  $("#manageShelterTableWrapper").toggleClass("d-none", shown.length === 0);
  $("#manageShelterEmpty").toggleClass("d-none", shown.length > 0);
}

// After a save or delete: the message above the table, and the table again
function showManageShelterSaved(message) {
  $("#manageShelterSaved").text(message).removeClass("d-none");
  renderManageShelters();
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "manage-shelters") {
    renderManageShelters();
  }
});

// Search
$(document).on("input", "#manageShelterSearch", renderManageShelters);
$(document).on("submit", "#manageShelterFilters", function (e) {
  e.preventDefault(); // Enter in the search box would reload the page
});
$(document).on("click", "#manageShelterClear", function () {
  document.getElementById("manageShelterFilters").reset();
  renderManageShelters();
});


// ---------- Add and edit (one modal) ----------

// Fills the form and opens it: an empty form for a new shelter, or its values
function openShelterForm(shelter) {
  const isNew = shelter === undefined;
  $("#shelterFormTitle").text(isNew ? "Add shelter" : "Edit " + shelter.name);
  $("#manageShelterId").val(isNew ? "" : shelter.id);
  $("#shelterFormName").val(isNew ? "" : shelter.name);
  $("#shelterFormAddress").val(isNew ? "" : shelter.address);
  $("#shelterFormCity").val(isNew ? "" : shelter.city);
  $("#shelterFormPhone").val(isNew ? "" : shelter.phone);
  $("#shelterFormEmail").val(isNew ? "" : shelter.email);
  $("#shelterFormDescription").val(isNew ? "" : shelter.description || "");
  $("#shelterFormHours").val(isNew ? "" : shelter.opening_hours || "");
  // null (no coordinates) becomes an empty field
  $("#shelterFormLatitude").val(isNew || shelter.latitude === null ? "" : shelter.latitude);
  $("#shelterFormLongitude").val(isNew || shelter.longitude === null ? "" : shelter.longitude);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("shelterFormModal")).show();
}

$(document).on("click", "#addShelterButton", function () {
  openShelterForm();
});

$(document).on("click", ".edit-shelter", function () {
  openShelterForm(findShelterById(Number($(this).attr("data-id"))));
});

// Latitude and longitude: both or neither (the map needs both).
// setCustomValidity() marks the latitude field invalid, like the password match on register.
function checkShelterCoordinates() {
  const latitudeField = document.getElementById("shelterFormLatitude");
  const latitude = latitudeField.value;
  const longitude = $("#shelterFormLongitude").val();
  const onlyOne = (latitude === "") !== (longitude === ""); // one is empty, the other isn't
  latitudeField.setCustomValidity(onlyOne ? "Fill in both coordinates, or neither." : "");
  $("#shelterLatitudeFeedback").text(onlyOne
    ? "Fill in both coordinates, or neither."
    : "Enter a number from -90 to 90.");
}

$(document).on("input", "#shelterFormLatitude, #shelterFormLongitude", checkShelterCoordinates);

$(document).on("submit", "#shelterForm", function (e) {
  e.preventDefault();
  checkShelterCoordinates();
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  const id = $("#manageShelterId").val(); // "" for a new shelter
  const latitude = $("#shelterFormLatitude").val();
  const longitude = $("#shelterFormLongitude").val();
  const values = {
    name: $("#shelterFormName").val().trim(),
    address: $("#shelterFormAddress").val().trim(),
    city: $("#shelterFormCity").val().trim(),
    phone: $("#shelterFormPhone").val().trim(),
    email: $("#shelterFormEmail").val().trim(),
    description: $("#shelterFormDescription").val().trim() || null,
    opening_hours: $("#shelterFormHours").val().trim() || null,
    // A number field's value is text: Number() makes it a number; empty = null
    latitude: latitude === "" ? null : Number(latitude),
    longitude: longitude === "" ? null : Number(longitude)
  };

  // Demo (M1): saved in sampleShelters. In M4: POST /shelters or PUT /shelters/{id}.
  if (id === "") {
    values.id = getNextId(sampleShelters);
    sampleShelters.push(values);
    showManageShelterSaved(values.name + " was added.");
  } else {
    const shelter = findShelterById(Number(id));
    Object.assign(shelter, values); // copies every value into the existing shelter
    // The pets keep a copy of their shelter's name (shelter_name), so update it.
    // In M4 the API joins the name from the shelters table, so this goes.
    getShelterPets(shelter.id).forEach(function (pet) {
      pet.shelter_name = shelter.name;
    });
    showManageShelterSaved("Changes to " + values.name + " were saved.");
  }
  bootstrap.Modal.getInstance(document.getElementById("shelterFormModal")).hide();
});

// The form closed (saved, Cancel, X or Esc): empty it for next time
$(document).on("hidden.bs.modal", "#shelterFormModal", function () {
  resetForm(document.getElementById("shelterForm")); // from auth.js
});


// ---------- Delete ----------

// Opens the delete modal: it asks first, or explains why the shelter can't be
// deleted (its pets would have no shelter)
$(document).on("click", ".delete-shelter", function () {
  const shelter = findShelterById(Number($(this).attr("data-id")));
  const petCount = getShelterPets(shelter.id).length;
  const canDelete = petCount === 0;

  $("#shelterDeleteTitle").text("Delete " + shelter.name + "?");
  $("#shelterDeleteText").text(canDelete
    ? "This removes " + shelter.name + " from PawFriends. It can't be undone."
    : shelter.name + " can't be deleted: it still has " + petCount
      + " pet(s). Move them to another shelter first.");
  $("#confirmDeleteShelter").attr("data-id", shelter.id).toggleClass("d-none", !canDelete);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("shelterDeleteModal")).show();
});

$(document).on("click", "#confirmDeleteShelter", function () {
  const shelter = findShelterById(Number($(this).attr("data-id")));
  // Check again: for a shelter with pets the button is only hidden (d-none),
  // so a script could still click it. From M4 the backend checks this too.
  if (shelter === undefined || getShelterPets(shelter.id).length > 0) {
    return;
  }
  // splice(index, 1) removes one item from the array at that position
  sampleShelters.splice(sampleShelters.indexOf(shelter), 1);
  bootstrap.Modal.getInstance(document.getElementById("shelterDeleteModal")).hide();
  showManageShelterSaved(shelter.name + " was deleted.");
});
