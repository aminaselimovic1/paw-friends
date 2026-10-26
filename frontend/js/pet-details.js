// Pet details page (everyone): one pet, chosen by the link (#pet-details?id=2).
// Milestone 1: sample data instead of the backend. The pets are samplePets
// from pets.js; the health records are below. From M4 everything comes from
// the REST API through a service file, and these arrays go.
//
// Reuses functions from other scripts (they all share one global scope):
// samplePets, petStatusBadges, capitalizeFirstLetter, getPetAgeInMonths,
// formatPetAge (pets.js), formatDate (my-applications.js), resetForm
// (auth.js) and getHashParam (router.js).

// Same field names as the planned vet_records and vaccinations tables.
// vet_name is not a column: it comes from the users table (the vet), like
// shelter_name on the pets. null = no value (NULL in the database); those
// fields are never shown. Oliver, Mia, Buddy and Coco have no records yet.
// Some next_due_date values are close to October 2026, so the vet dashboard
// has follow-ups to show (they become overdue as time passes).
const sampleVetRecords = [
  {
    id: 1, pet_id: 1, vet_id: 2, vet_name: "Dr. Emina Mehić", visit_date: "2026-08-14",
    reason: "Yearly check-up", diagnosis: "Healthy, normal weight",
    treatment: "Deworming tablet", notes: null
  },
  {
    id: 2, pet_id: 2, vet_id: 2, vet_name: "Dr. Emina Mehić", visit_date: "2026-05-03",
    reason: "Health check on arrival at the shelter", diagnosis: "Healthy",
    treatment: null, notes: "Calm during the examination."
  },
  {
    id: 3, pet_id: 3, vet_id: 4, vet_name: "Dr. Adnan Begić", visit_date: "2025-08-01",
    reason: "First check-up as a puppy", diagnosis: "Healthy",
    treatment: null, notes: null
  },
  {
    id: 4, pet_id: 3, vet_id: 4, vet_name: "Dr. Adnan Begić", visit_date: "2026-09-22",
    reason: "Scratching his left ear", diagnosis: "Mild ear infection",
    treatment: "Ear drops twice a day for 7 days", notes: "Check again if it comes back."
  },
  {
    id: 5, pet_id: 5, vet_id: 2, vet_name: "Dr. Emina Mehić", visit_date: "2026-07-10",
    reason: "Kitten check-up", diagnosis: "Healthy",
    treatment: null, notes: "Booster vaccine due in three months."
  },
  {
    id: 6, pet_id: 9, vet_id: 4, vet_name: "Dr. Adnan Begić", visit_date: "2026-09-30",
    reason: "Stiff back legs in the morning", diagnosis: "Mild arthritis (age-related)",
    treatment: "Joint supplement once a day", notes: "Short walks only."
  },
  {
    id: 7, pet_id: 4, vet_id: 2, vet_name: "Dr. Emina Mehić", visit_date: "2026-10-02",
    reason: "Puppy check-up", diagnosis: "Healthy",
    treatment: "Deworming tablet", notes: null
  },
  {
    id: 8, pet_id: 8, vet_id: 2, vet_name: "Dr. Emina Mehić", visit_date: "2026-10-12",
    reason: "Watery left eye", diagnosis: "Mild conjunctivitis",
    treatment: "Eye drops twice a day for 5 days", notes: null
  }
];

const sampleVaccinations = [
  {
    id: 1, pet_id: 1, vet_id: 2, vet_name: "Dr. Emina Mehić", vaccine_name: "Rabies",
    date_given: "2026-08-14", next_due_date: "2027-08-14"
  },
  {
    id: 2, pet_id: 1, vet_id: 2, vet_name: "Dr. Emina Mehić",
    vaccine_name: "DHPP (distemper, hepatitis, parvovirus, parainfluenza)",
    date_given: "2026-08-14", next_due_date: "2027-08-14"
  },
  {
    id: 3, pet_id: 2, vet_id: 2, vet_name: "Dr. Emina Mehić",
    vaccine_name: "FVRCP (cat flu and feline distemper)",
    date_given: "2026-05-03", next_due_date: "2027-05-03"
  },
  {
    id: 4, pet_id: 3, vet_id: 4, vet_name: "Dr. Adnan Begić",
    vaccine_name: "DHPP (distemper, hepatitis, parvovirus, parainfluenza)",
    date_given: "2025-08-01", next_due_date: null
  },
  {
    id: 5, pet_id: 5, vet_id: 2, vet_name: "Dr. Emina Mehić",
    vaccine_name: "FVRCP (cat flu and feline distemper)",
    date_given: "2026-07-10", next_due_date: "2026-10-10"
  },
  {
    id: 6, pet_id: 4, vet_id: 2, vet_name: "Dr. Emina Mehić",
    vaccine_name: "DHPP (distemper, hepatitis, parvovirus, parainfluenza)",
    date_given: "2026-07-25", next_due_date: "2026-10-24"
  },
  {
    id: 7, pet_id: 9, vet_id: 4, vet_name: "Dr. Adnan Begić", vaccine_name: "Rabies",
    date_given: "2025-11-05", next_due_date: "2026-11-05"
  },
  {
    id: 8, pet_id: 6, vet_id: 4, vet_name: "Dr. Adnan Begić", vaccine_name: "Rabies",
    date_given: "2026-03-15", next_due_date: "2027-03-15"
  }
];

// The vet who is "logged in" in the demo; new records are saved under this
// vet. In M4 the backend takes vet_id from the JWT token, never from the
// form, so a vet can't add records in someone else's name.
const demoVet = { id: 2, name: "Dr. Emina Mehić" };

// The pet from the link: "#pet-details?id=2" -> the pet with id 2.
// getHashParam gives a string ("2"), so it's turned into a number first.
// Returns undefined when there's no id or no pet has it.
function getDetailPet() {
  const id = Number(getHashParam("id"));
  return samplePets.find(function (pet) {
    return pet.id === id;
  });
}

// Today as "YYYY-MM-DD" in local time, for the max of the date fields.
// (toISOString() would give the date in UTC, which can be yesterday or tomorrow.)
function getTodayIsoDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() counts from 0
  const day = String(today.getDate()).padStart(2, "0");
  return today.getFullYear() + "-" + month + "-" + day;
}

// Puts a value into one line of a health record, or removes the line when
// there's no value, so empty fields are never shown
function fillHealthLine(item, selector, value) {
  if (value) {
    item.find(selector).text(value);
  } else {
    item.find(selector).closest("li").remove();
  }
}

// One vaccination, made from the <template> in pet-details.html.
// .text() puts the data in as plain text, never as HTML.
function createVaccinationItem(vaccination) {
  const item = $($("#vaccinationTemplate").html());
  item.find(".vaccination-name").text(vaccination.vaccine_name);
  item.find(".vaccination-date").text(formatDate(vaccination.date_given));
  fillHealthLine(item, ".vaccination-due",
    vaccination.next_due_date ? formatDate(vaccination.next_due_date) : null);
  item.find(".vaccination-vet").text(vaccination.vet_name);
  return item;
}

// One vet visit, made from the <template> in pet-details.html
function createVetRecordItem(record) {
  const item = $($("#vetRecordTemplate").html());
  item.find(".record-date").text(formatDate(record.visit_date));
  item.find(".record-reason").text(record.reason);
  fillHealthLine(item, ".record-diagnosis", record.diagnosis);
  fillHealthLine(item, ".record-treatment", record.treatment);
  fillHealthLine(item, ".record-notes", record.notes);
  item.find(".record-vet").text(record.vet_name);
  return item;
}

// The pet's vaccinations and vet visits, newest first. Each list is hidden
// when it's empty, and the whole section when both are.
function renderHealthHistory(pet) {
  // "YYYY-MM-DD" dates sort correctly as text; b before a = newest first.
  // filter() makes a new array, so sort() doesn't change the sample arrays.
  const vaccinations = sampleVaccinations
    .filter(function (vaccination) { return vaccination.pet_id === pet.id; })
    .sort(function (a, b) { return b.date_given.localeCompare(a.date_given); });
  const vetRecords = sampleVetRecords
    .filter(function (record) { return record.pet_id === pet.id; })
    .sort(function (a, b) { return b.visit_date.localeCompare(a.visit_date); });

  const vaccinationList = $("#vaccinationList").empty();
  vaccinations.forEach(function (vaccination) {
    vaccinationList.append(createVaccinationItem(vaccination));
  });
  const vetRecordList = $("#vetRecordList").empty();
  vetRecords.forEach(function (record) {
    vetRecordList.append(createVetRecordItem(record));
  });

  $("#vaccinationBlock").toggleClass("d-none", vaccinations.length === 0);
  $("#vetRecordBlock").toggleClass("d-none", vetRecords.length === 0);
  $("#healthSection").toggleClass("d-none", vaccinations.length + vetRecords.length === 0);
}

// The adoption box: one sentence for the status, and the call to action for
// every pet that isn't adopted yet (inside it, data-roles decides between user
// and guest). A pending pet can get more applications: when the admin approves
// one, the others are rejected (manage-applications.js).
function renderAdoption(pet) {
  const adoptionTexts = {
    available: pet.name + " is looking for a loving home.",
    pending: "An adoption application for " + pet.name + " is being reviewed. You can still apply.",
    adopted: pet.name + " has already found a home."
  };
  $("#adoptionText").text(adoptionTexts[pet.status]);
  $("#adoptionCta").toggleClass("d-none", pet.status === "adopted");
}

// Fills the whole page for the pet in the link, or shows "Pet not found"
function renderPetDetails() {
  const pet = getDetailPet();
  $("#detailNotFound").toggleClass("d-none", pet !== undefined);
  $("#detailContent").toggleClass("d-none", pet === undefined);
  if (pet === undefined) {
    return;
  }

  const badge = petStatusBadges[pet.status];
  // The name also appears in headings, the guest text and the modal titles
  $(".detail-pet-name").text(pet.name);
  // The vet forms save their records for this pet
  $("#vetRecordPetId, #vaccinationPetId").val(pet.id);
  $(".detail-breed-name").text(pet.breed_name);
  $("#detailName").text(pet.name);
  // attr("class") replaces all classes, so an old colour can't stay after an edit
  $("#detailStatus").text(badge.label).attr("class", "badge " + badge.cssClass);
  $("#detailBreed").text(capitalizeFirstLetter(pet.species) + " · " + pet.breed_name);

  // The photo, or the "Photo coming soon" box
  $("#detailPhoto")
    .attr("src", pet.photo_url || "")
    .attr("alt", pet.name + ", a " + pet.breed_name + " " + pet.species)
    .toggleClass("d-none", !pet.photo_url);
  $("#detailPhotoPlaceholder").toggleClass("d-none", Boolean(pet.photo_url));

  $("#detailAge").text(formatPetAge(getPetAgeInMonths(pet.birth_date)));
  $("#detailBirthDate").text(formatDate(pet.birth_date));
  $("#detailSex").text(capitalizeFirstLetter(pet.sex));
  $("#detailShelter")
    .text(pet.shelter_name)
    .attr("href", "#shelter-details?id=" + pet.shelter_id);

  // "About Max", only when there's a description
  $("#detailDescription").text(pet.description || "");
  $("#detailAbout").toggleClass("d-none", !pet.description);

  renderAdoption(pet);
  renderHealthHistory(pet);

  // The species decides which API the backend will call for the breed info
  $("#breedApiName").text(pet.species === "dog" ? "TheDogAPI" : "TheCatAPI");
}

// The router announces every loaded view; fill the page when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "pet-details") {
    // Visits, vaccinations and birth dates can't be in the future
    $("#visitDate, #vaccineDateGiven, #editPetBirthDate").attr("max", getTodayIsoDate());
    renderPetDetails();
  }
});

// "Apply to adopt" (user): applications need the backend, so for now it only
// explains that. Nothing is sent or saved.
$(document).on("click", "#applyButton", function () {
  $("#applyPlaceholder").removeClass("d-none");
});


// ---------- Vet and admin forms (Bootstrap modals) ----------
// The buttons open the modals by themselves (data-bs-toggle="modal").

// Closes the modal around a saved form, redraws the page and shows a message
// under the vet/admin buttons
function finishDetailForm(form, message) {
  bootstrap.Modal.getInstance($(form).closest(".modal")[0]).hide();
  renderPetDetails();
  $("#detailSaved").text(message).removeClass("d-none");
}

// The two vet forms are on this page AND on the vet dashboard (same ids), so
// the code below saves them for both. After saving it closes the form and
// announces "healthRecordSaved" (our own event, like the router's viewLoaded):
// the page that is open redraws itself and shows the message.
function finishHealthForm(form, message) {
  bootstrap.Modal.getInstance($(form).closest(".modal")[0]).hide();
  $(document).trigger("healthRecordSaved", [message]);
}

// This page's answer to "healthRecordSaved" (the vet dashboard has its own)
$(document).on("healthRecordSaved", function (e, message) {
  if (getRouteFromHash() === "pet-details") { // from router.js
    renderPetDetails();
    $("#detailSaved").text(message).removeClass("d-none");
  }
});

// The pet a vet form is for: its id is in the form's hidden field
function getHealthFormPet(hiddenFieldSelector) {
  const petId = Number($(hiddenFieldSelector).val());
  return samplePets.find(function (pet) {
    return pet.id === petId;
  });
}

// Whenever a modal closes (saved, Cancel, X, Esc or a click outside it):
// empty its form, so it opens clean next time
$(document).on("hidden.bs.modal", ".pet-modal", function () {
  resetForm($(this).find("form")[0]); // from auth.js
});

// Vet: "Add vet record"
$(document).on("submit", "#vetRecordForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this); // from auth.js: a field of only spaces counts as empty
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // invalid: stop here, the errors are shown
  }

  // Demo (M1): added to the sample array, kept until the page is reloaded.
  // In M4 this becomes a request to the API, and the database gives the id.
  // Optional fields left empty become null ("" || null -> null).
  const pet = getHealthFormPet("#vetRecordPetId");
  sampleVetRecords.push({
    id: sampleVetRecords.length + 1,
    pet_id: pet.id,
    vet_id: demoVet.id,
    vet_name: demoVet.name,
    visit_date: $("#visitDate").val(),
    reason: $("#visitReason").val().trim(),
    diagnosis: $("#visitDiagnosis").val().trim() || null,
    treatment: $("#visitTreatment").val().trim() || null,
    notes: $("#visitNotes").val().trim() || null
  });
  finishHealthForm(this, "Vet record added for " + pet.name + ".");
});

// "Next due" (optional) must be after "Date given". The same idea as the
// password match on register: setCustomValidity() marks the field invalid.
// "YYYY-MM-DD" dates can be compared as text.
function checkNextDueDate() {
  const nextDueField = document.getElementById("vaccineNextDue");
  const dateGiven = $("#vaccineDateGiven").val();
  const isValid = nextDueField.value === "" || dateGiven === "" || nextDueField.value > dateGiven;
  nextDueField.setCustomValidity(isValid ? "" : "Must be after the date given");
}

$(document).on("input", "#vaccineDateGiven, #vaccineNextDue", checkNextDueDate);

// Vet: "Add vaccination"
$(document).on("submit", "#vaccinationForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this);
  checkNextDueDate();
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  // Demo (M1): added to the sample array (see "Add vet record")
  const pet = getHealthFormPet("#vaccinationPetId");
  sampleVaccinations.push({
    id: sampleVaccinations.length + 1,
    pet_id: pet.id,
    vet_id: demoVet.id,
    vet_name: demoVet.name,
    vaccine_name: $("#vaccineName").val().trim(),
    date_given: $("#vaccineDateGiven").val(),
    next_due_date: $("#vaccineNextDue").val() || null
  });
  finishHealthForm(this, "Vaccination added for " + pet.name + ".");
});

// A warning when the chosen status doesn't fit the pet's applications
// (updateStatusWarning in manage-applications.js). Saving is still allowed.
function updateEditPetStatusWarning() {
  updateStatusWarning("#editPetStatus", "#editPetStatusWarning", getDetailPet().id);
}

$(document).on("change", "#editPetStatus", updateEditPetStatusWarning);

// Admin: "Edit pet details" opens, so copy the pet's current values into the form
$(document).on("show.bs.modal", "#editPetModal", function () {
  const pet = getDetailPet();
  $("#editPetName").val(pet.name);
  $("#editPetSpecies").val(pet.species);
  $("#editPetBreed").val(pet.breed_name);
  $("#editPetSex").val(pet.sex);
  $("#editPetBirthDate").val(pet.birth_date);
  $("#editPetStatus").val(pet.status);
  updateEditPetStatusWarning();
  $("#editPetDescription").val(pet.description || "");
});

// Admin: "Save changes"
$(document).on("submit", "#editPetForm", function (e) {
  e.preventDefault();
  checkTrimmedFields(this);
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return;
  }

  // Demo (M1): this changes the pet object inside samplePets, so the Pets
  // list shows the new values too (until a reload). In M4: a PUT request.
  const pet = getDetailPet();
  pet.name = $("#editPetName").val().trim();
  pet.species = $("#editPetSpecies").val();
  pet.breed_name = $("#editPetBreed").val().trim();
  pet.sex = $("#editPetSex").val();
  pet.birth_date = $("#editPetBirthDate").val();
  pet.status = $("#editPetStatus").val();
  pet.description = $("#editPetDescription").val().trim() || null;
  finishDetailForm(this, "Pet details saved.");
});
