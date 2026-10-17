// Manage pets page (admin): every pet (also adopted ones), with search,
// filters, and add / edit / delete in modals.
// Milestone 1: sample data, kept until the page is reloaded. The pets are
// samplePets from pets.js, so changes show up on the Pets pages too.
// From M4 saving and deleting become requests to the REST API.
//
// Reuses: samplePets, petStatusBadges and capitalizeFirstLetter (pets.js),
// sampleShelters (shelters.js), sampleAdoptionApplications and formatDate
// (my-applications.js), sampleVetRecords, sampleVaccinations and
// getTodayIsoDate (pet-details.js), findPetById (vet-dashboard.js),
// getNextId (admin-dashboard.js), updateStatusWarning (manage-applications.js),
// and resetForm and checkTrimmedFields (auth.js).

function findShelterById(shelterId) {
  return sampleShelters.find(function (shelter) {
    return shelter.id === shelterId;
  });
}

// One <option> per shelter in the filter and in the form (options added by JS
// are not part of the HTML, so form.reset() goes back to the first option)
function fillManagePetShelterOptions() {
  sampleShelters.forEach(function (shelter) {
    $("#managePetShelter, #petFormShelter").append($("<option>").val(shelter.id).text(shelter.name));
  });
}

// How many records point to this pet: adoption applications and health
// records. Deleting the pet would lose them, so it isn't allowed then.
function countPetHistory(petId) {
  const isThisPet = function (item) { return item.pet_id === petId; };
  return sampleAdoptionApplications.filter(isThisPet).length
    + sampleVetRecords.filter(isThisPet).length
    + sampleVaccinations.filter(isThisPet).length;
}

// The pets that match the search (name or breed) AND every filter
function getFilteredManagedPets() {
  const search = $("#managePetSearch").val().trim().toLowerCase();
  const species = $("#managePetSpecies").val();
  const status = $("#managePetStatus").val();
  const shelter = $("#managePetShelter").val(); // "all" or a shelter id, e.g. "2"
  return samplePets.filter(function (pet) {
    const matchesSearch = pet.name.toLowerCase().includes(search)
      || pet.breed_name.toLowerCase().includes(search);
    return matchesSearch
      && (species === "all" || pet.species === species)
      && (status === "all" || pet.status === status)
      && (shelter === "all" || pet.shelter_id === Number(shelter));
  });
}

// One table row, from the <template> in manage-pets.html.
// .text() and .attr() put the data in as plain text, never as HTML.
function createManagedPetRow(pet) {
  const row = $($("#managePetRowTemplate").html());
  const badge = petStatusBadges[pet.status];
  row.find(".managed-pet-name").text(pet.name).attr("href", "#pet-details?id=" + pet.id);
  row.find(".managed-pet-species").text(capitalizeFirstLetter(pet.species));
  row.find(".managed-pet-breed").text(pet.breed_name);
  row.find(".managed-pet-shelter").text(pet.shelter_name);
  row.find(".managed-pet-born").text(formatDate(pet.birth_date));
  row.find(".managed-pet-status").text(badge.label).addClass(badge.cssClass);
  row.find(".edit-pet").attr("data-id", pet.id).attr("aria-label", "Edit " + pet.name);
  row.find(".delete-pet").attr("data-id", pet.id).attr("aria-label", "Delete " + pet.name);
  return row;
}

// The table, the count, or the empty message
function renderManagePets() {
  const shown = getFilteredManagedPets();
  const body = $("#managePetTableBody").empty();
  shown.forEach(function (pet) {
    body.append(createManagedPetRow(pet));
  });

  const word = samplePets.length === 1 ? "pet" : "pets";
  $("#managePetCount").text(shown.length === samplePets.length
    ? samplePets.length + " " + word
    : "Showing " + shown.length + " of " + samplePets.length + " " + word);
  $("#managePetTableWrapper").toggleClass("d-none", shown.length === 0);
  $("#managePetEmpty").toggleClass("d-none", shown.length > 0);
}

// After a save or delete: the message above the table, and the table again
function showManagePetSaved(message) {
  $("#managePetSaved").text(message).removeClass("d-none");
  renderManagePets();
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "manage-pets") {
    fillManagePetShelterOptions();
    $("#petFormBirthDate").attr("max", getTodayIsoDate()); // no birth dates in the future
    renderManagePets();
  }
});

// Search and filters
$(document).on("input", "#managePetSearch", renderManagePets);
$(document).on("change", "#managePetFilters select", renderManagePets);
$(document).on("submit", "#managePetFilters", function (e) {
  e.preventDefault(); // Enter in the search box would reload the page
});
$(document).on("click", "#managePetClear", function () {
  document.getElementById("managePetFilters").reset();
  renderManagePets();
});


// ---------- Add and edit (one modal) ----------

// Fills the form and opens it: an empty form for a new pet, or the pet's values
function openPetForm(pet) {
  const isNew = pet === undefined;
  $("#petFormTitle").text(isNew ? "Add pet" : "Edit " + pet.name);
  $("#managePetId").val(isNew ? "" : pet.id);
  $("#petFormName").val(isNew ? "" : pet.name);
  $("#petFormSpecies").val(isNew ? "dog" : pet.species);
  $("#petFormBreed").val(isNew ? "" : pet.breed_name);
  $("#petFormSex").val(isNew ? "male" : pet.sex);
  $("#petFormBirthDate").val(isNew ? "" : pet.birth_date);
  $("#petFormShelter").val(isNew ? "" : pet.shelter_id);
  $("#petFormStatus").val(isNew ? "available" : pet.status);
  updatePetFormStatusWarning();
  $("#petFormDescription").val(isNew ? "" : pet.description || "");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("petFormModal")).show();
}

// A warning when the chosen status doesn't fit the pet's applications
// (manage-applications.js). A new pet's id is "" -> 0, which has no applications.
function updatePetFormStatusWarning() {
  updateStatusWarning("#petFormStatus", "#petFormStatusWarning", Number($("#managePetId").val()));
}

$(document).on("change", "#petFormStatus", updatePetFormStatusWarning);

$(document).on("click", "#addPetButton", function () {
  openPetForm();
});

$(document).on("click", ".edit-pet", function () {
  openPetForm(findPetById(Number($(this).attr("data-id"))));
});

$(document).on("submit", "#petForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this); // from auth.js
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  const id = $("#managePetId").val(); // "" for a new pet
  const shelter = findShelterById(Number($("#petFormShelter").val()));
  // The new values. shelter_name is copied from the chosen shelter, because the
  // pet cards show it (in M4 the API joins it from the shelters table).
  const values = {
    name: $("#petFormName").val().trim(),
    species: $("#petFormSpecies").val(),
    breed_name: $("#petFormBreed").val().trim(),
    sex: $("#petFormSex").val(),
    birth_date: $("#petFormBirthDate").val(),
    shelter_id: shelter.id,
    shelter_name: shelter.name,
    status: $("#petFormStatus").val(),
    description: $("#petFormDescription").val().trim() || null
  };

  // Demo (M1): saved in samplePets. In M4: POST /pets or PUT /pets/{id}.
  if (id === "") {
    values.id = getNextId(samplePets);
    values.photo_url = null; // no photo uploads yet: "Photo coming soon"
    samplePets.push(values);
    showManagePetSaved(values.name + " was added.");
  } else {
    // Object.assign copies every value into the existing pet object
    Object.assign(findPetById(Number(id)), values);
    showManagePetSaved("Changes to " + values.name + " were saved.");
  }
  bootstrap.Modal.getInstance(document.getElementById("petFormModal")).hide();
});

// The form closed (saved, Cancel, X or Esc): empty it for next time
$(document).on("hidden.bs.modal", "#petFormModal", function () {
  resetForm(document.getElementById("petForm")); // from auth.js
});


// ---------- Delete ----------

// Opens the delete modal: it asks first, or explains why the pet can't be deleted
$(document).on("click", ".delete-pet", function () {
  const pet = findPetById(Number($(this).attr("data-id")));
  const historyCount = countPetHistory(pet.id);
  const canDelete = historyCount === 0;

  $("#petDeleteTitle").text("Delete " + pet.name + "?");
  $("#petDeleteText").text(canDelete
    ? "This removes " + pet.name + " from PawFriends. It can't be undone."
    : pet.name + " can't be deleted: " + historyCount + " application(s) or health record(s) "
      + "belong to this pet and would be lost. You can change its status instead.");
  $("#confirmDeletePet").attr("data-id", pet.id).toggleClass("d-none", !canDelete);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("petDeleteModal")).show();
});

$(document).on("click", "#confirmDeletePet", function () {
  const pet = findPetById(Number($(this).attr("data-id")));
  // Check again: for a pet with history the button is only hidden (d-none),
  // so a script could still click it. From M4 the backend checks this too.
  if (pet === undefined || countPetHistory(pet.id) > 0) {
    return;
  }
  // splice(index, 1) removes one item from the array at that position
  samplePets.splice(samplePets.indexOf(pet), 1);
  bootstrap.Modal.getInstance(document.getElementById("petDeleteModal")).hide();
  showManagePetSaved(pet.name + " was deleted.");
});
