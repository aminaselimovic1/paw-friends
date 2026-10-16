// Vet dashboard (vets): an overview of the pets in the shelters and their
// health records: summary numbers, follow-ups, a searchable pet table,
// recent activity and quick actions.
// Milestone 1: sample data. From M4 it comes from the REST API through a
// service file, and the vet comes from the JWT token instead of demoVet.
//
// Reuses (all scripts share one global scope): samplePets and
// capitalizeFirstLetter (pets.js), sampleVetRecords, sampleVaccinations,
// demoVet and getTodayIsoDate (pet-details.js), formatDate
// (my-applications.js) and resetForm (auth.js).
// The two vet forms in vet-dashboard.html are saved by pet-details.js, which
// then announces "healthRecordSaved"; this file opens them and redraws after.


// ---------- Working out the data ----------

// Whole days from today to a "YYYY-MM-DD" date: 0 = today, 8 = in 8 days,
// -6 = six days ago. Both dates are at midnight; Math.round evens out the
// days with 23 or 25 hours (when summer time starts or ends).
function getDaysFromToday(isoDate) {
  const today = new Date(getTodayIsoDate() + "T00:00:00");
  const date = new Date(isoDate + "T00:00:00");
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((date - today) / millisecondsPerDay);
}

// 1 -> "1 day", 6 -> "6 days"
function formatDays(count) {
  return count + (count === 1 ? " day" : " days");
}

function findPetById(petId) {
  return samplePets.find(function (pet) {
    return pet.id === petId;
  });
}

// The pets a shelter vet looks after: every pet still in a shelter
// (adopted pets have gone home)
function getPetsInShelters() {
  return samplePets.filter(function (pet) {
    return pet.status !== "adopted";
  });
}

// "Your patient" = a pet that this vet has written a vet record or a
// vaccination for. (The data has no "assigned vet", so this is worked out.)
function isVetPatient(petId) {
  const isByThisVet = function (item) {
    return item.pet_id === petId && item.vet_id === demoVet.id;
  };
  return sampleVetRecords.some(isByThisVet) || sampleVaccinations.some(isByThisVet);
}

// The pet's newest vet visit, or undefined when it has none
function getLatestVisit(petId) {
  return sampleVetRecords
    .filter(function (record) { return record.pet_id === petId; })
    .sort(function (a, b) { return b.visit_date.localeCompare(a.visit_date); })[0];
}

// True when the pet got the same vaccine again later, so this dose's
// "next due" date has been dealt with. The names are compared without
// capitals and spaces at the ends ("rabies " = "Rabies").
function hasNewerDose(vaccination) {
  const name = vaccination.vaccine_name.trim().toLowerCase();
  return sampleVaccinations.some(function (other) {
    return other.pet_id === vaccination.pet_id
      && other.vaccine_name.trim().toLowerCase() === name
      && other.date_given > vaccination.date_given;
  });
}

// Follow-ups: vaccinations of pets in shelters whose next dose is overdue or
// due in the next 30 days, and that haven't been given again since.
// The most urgent (the earliest date) comes first.
function getFollowUps() {
  const petsInShelters = getPetsInShelters();
  return sampleVaccinations
    .filter(function (vaccination) {
      return vaccination.next_due_date
        && getDaysFromToday(vaccination.next_due_date) <= 30
        && !hasNewerDose(vaccination)
        && petsInShelters.some(function (pet) { return pet.id === vaccination.pet_id; });
    })
    .sort(function (a, b) { return a.next_due_date.localeCompare(b.next_due_date); });
}

// The ids of the pets that need a follow-up, each only once
// (a pet with two vaccinations due is still one pet)
function getFollowUpPetIds() {
  const petIds = [];
  getFollowUps().forEach(function (vaccination) {
    if (!petIds.includes(vaccination.pet_id)) {
      petIds.push(vaccination.pet_id);
    }
  });
  return petIds;
}

// How many visits and vaccinations this vet added in the last 30 days
function countRecentRecordsByVet() {
  const isRecentByThisVet = function (date, vetId) {
    return vetId === demoVet.id && getDaysFromToday(date) >= -30;
  };
  const visits = sampleVetRecords.filter(function (record) {
    return isRecentByThisVet(record.visit_date, record.vet_id);
  });
  const vaccinations = sampleVaccinations.filter(function (vaccination) {
    return isRecentByThisVet(vaccination.date_given, vaccination.vet_id);
  });
  return visits.length + vaccinations.length;
}

// The 5 newest visits and vaccinations together, by any vet, newest first.
// Both kinds are turned into the same shape first, so they can be sorted together.
function getRecentActivity() {
  const visits = sampleVetRecords.map(function (record) {
    return {
      kind: "visit", date: record.visit_date, pet_id: record.pet_id,
      vet_id: record.vet_id, vet_name: record.vet_name, text: "Vet visit: " + record.reason
    };
  });
  const vaccinations = sampleVaccinations.map(function (vaccination) {
    return {
      kind: "vaccination", date: vaccination.date_given, pet_id: vaccination.pet_id,
      vet_id: vaccination.vet_id, vet_name: vaccination.vet_name,
      text: "Vaccination: " + vaccination.vaccine_name
    };
  });
  return visits.concat(vaccinations)
    .sort(function (a, b) { return b.date.localeCompare(a.date); })
    .slice(0, 5);
}


// ---------- Drawing the page ----------
// .text() and .attr() put the data in as plain text, never as HTML.

// "Overdue by 6 days", "Due today", "Due tomorrow" or "Due in 8 days"
function getDueText(days) {
  if (days < 0) {
    return "Overdue by " + formatDays(-days);
  }
  if (days === 0) {
    return "Due today";
  }
  if (days === 1) {
    return "Due tomorrow";
  }
  return "Due in " + formatDays(days);
}

// One follow-up, made from the <template> in vet-dashboard.html
function createFollowUpItem(vaccination) {
  const item = $($("#vetFollowUpTemplate").html());
  const pet = findPetById(vaccination.pet_id);
  const days = getDaysFromToday(vaccination.next_due_date);

  item.find(".followup-pet").text(pet.name).attr("href", "#pet-details?id=" + pet.id);
  item.find(".followup-vaccine").text(vaccination.vaccine_name);
  item.find(".followup-date").text(formatDate(vaccination.next_due_date));
  item.find(".followup-shelter").text(pet.shelter_name);
  // Red when overdue, yellow when due soon
  item.find(".followup-badge")
    .text(getDueText(days))
    .addClass(days < 0 ? "text-bg-danger" : "text-bg-warning");
  // Opens "Add vaccination" for this pet, with this vaccine's name filled in
  // (so the new dose matches the old one and the follow-up is done)
  item.find(".followup-add")
    .attr("data-id", pet.id)
    .attr("data-vaccine", vaccination.vaccine_name)
    .attr("aria-label", "Add a vaccination for " + pet.name);
  return item;
}

// One row of the pet records table
function createVetPetRow(pet, needsFollowUp) {
  const row = $($("#vetPetRowTemplate").html());
  const latestVisit = getLatestVisit(pet.id);

  row.find(".vet-pet-name").text(pet.name).attr("href", "#pet-details?id=" + pet.id);
  row.find(".vet-pet-followup").toggleClass("d-none", !needsFollowUp);
  row.find(".vet-pet-species").text(capitalizeFirstLetter(pet.species));
  row.find(".vet-pet-breed").text(pet.breed_name);
  row.find(".vet-pet-shelter").text(pet.shelter_name);
  row.find(".vet-pet-visit").text(latestVisit ? formatDate(latestVisit.visit_date) : "No visits yet");
  // Opens "Add vet record" for this pet, here on the dashboard
  row.find(".vet-pet-add")
    .attr("data-id", pet.id)
    .attr("aria-label", "Add a vet record for " + pet.name);
  return row;
}

// One recent activity: a visit or a vaccination
function createActivityItem(activity) {
  const item = $($("#vetActivityTemplate").html());
  const pet = findPetById(activity.pet_id);

  item.find(".activity-icon").addClass(activity.kind === "visit" ? "bi-clipboard2-pulse" : "bi-shield-plus");
  item.find(".activity-pet").text(pet.name).attr("href", "#pet-details?id=" + pet.id);
  item.find(".activity-text").text(activity.text);
  item.find(".activity-date").text(formatDate(activity.date));
  item.find(".activity-vet").text(activity.vet_id === demoVet.id ? "You" : activity.vet_name);
  return item;
}

// The pets in shelters that match the search AND both filters
function getFilteredVetPets() {
  const search = $("#vetPetSearch").val().trim().toLowerCase();
  const species = $("#vetSpeciesFilter").val(); // "all", "dog" or "cat"
  const show = $("#vetShowFilter").val();       // "all", "mine" or "followup"
  const followUpPetIds = getFollowUpPetIds();

  return getPetsInShelters().filter(function (pet) {
    const matchesSearch = pet.name.toLowerCase().includes(search)
      || pet.breed_name.toLowerCase().includes(search);
    const matchesShow = show === "all"
      || (show === "mine" && isVetPatient(pet.id))
      || (show === "followup" && followUpPetIds.includes(pet.id));
    return matchesSearch && (species === "all" || pet.species === species) && matchesShow;
  });
}

// The pet records table: the matching rows and the count, or the empty message
function renderVetPetTable() {
  const shown = getFilteredVetPets();
  const totalCount = getPetsInShelters().length;
  const followUpPetIds = getFollowUpPetIds();

  const body = $("#vetPetTableBody").empty();
  shown.forEach(function (pet) {
    body.append(createVetPetRow(pet, followUpPetIds.includes(pet.id)));
  });

  const word = totalCount === 1 ? "pet" : "pets";
  $("#vetPetCount").text(shown.length === totalCount
    ? totalCount + " " + word
    : "Showing " + shown.length + " of " + totalCount + " " + word);
  $("#vetPetTableWrapper").toggleClass("d-none", shown.length === 0);
  $("#vetPetEmpty").toggleClass("d-none", shown.length > 0);
}

// The pets in the "Add a health record" form, by name
function fillVetRecordPetOptions() {
  const select = $("#vetRecordPet");
  getPetsInShelters()
    .slice() // a copy, so sort() doesn't reorder samplePets
    .sort(function (a, b) { return a.name.localeCompare(b.name); })
    .forEach(function (pet) {
      const label = pet.name + " (" + capitalizeFirstLetter(pet.species) + ", " + pet.shelter_name + ")";
      select.append($("<option>").val(pet.id).text(label));
    });
}

// The whole dashboard
function renderVetDashboard() {
  const followUps = getFollowUps();
  const followUpPetCount = getFollowUpPetIds().length;

  // Header: "Welcome back, Dr. Emina Mehić" and today's overview
  $("#vetName").text(demoVet.name);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  let followUpText = followUpPetCount + " pets need a follow-up.";
  if (followUpPetCount === 0) {
    followUpText = "No pets need a follow-up.";
  } else if (followUpPetCount === 1) {
    followUpText = "1 pet needs a follow-up.";
  }
  $("#vetOverview").text(today + " · " + followUpText);

  // Summary cards
  const patientCount = getPetsInShelters().filter(function (pet) {
    return isVetPatient(pet.id);
  }).length;
  $("#vetPatientCount").text(patientCount);
  $("#vetRecentRecordCount").text(countRecentRecordsByVet());
  $("#vetFollowUpCount").text(followUpPetCount);

  // Follow-ups
  const followUpList = $("#vetFollowUpList").empty();
  followUps.forEach(function (vaccination) {
    followUpList.append(createFollowUpItem(vaccination));
  });
  $("#vetNoFollowUps").toggleClass("d-none", followUps.length > 0);

  // Recent activity
  const activityList = $("#vetActivityList").empty();
  getRecentActivity().forEach(function (activity) {
    activityList.append(createActivityItem(activity));
  });

  renderVetPetTable();
}

// The router announces every loaded view; fill the page when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "vet-dashboard") {
    fillVetRecordPetOptions();
    // Visits and vaccinations can't be in the future
    $("#visitDate, #vaccineDateGiven").attr("max", getTodayIsoDate());
    renderVetDashboard();
  }
});


// ---------- Adding health records here ----------

// Opens "Add vet record" (kind "record") or "Add vaccination" for one pet.
// The form saves its record for the pet in its hidden field (pet-details.js).
// vaccineName (optional) fills in the vaccine, e.g. from a follow-up.
function openVetHealthForm(petId, kind, vaccineName) {
  const pet = findPetById(petId);
  $("#vetRecordPetId, #vaccinationPetId").val(pet.id);
  $(".detail-pet-name").text(pet.name); // the form's title: "... for Milo"
  let modalId = "vetRecordModal";
  if (kind === "vaccination") {
    modalId = "vaccinationModal";
    $("#vaccineName").val(vaccineName || "");
  }
  bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId)).show();
}

// "Add record" in a table row
$(document).on("click", ".vet-pet-add", function () {
  openVetHealthForm(Number($(this).attr("data-id")), "record");
});

// "Add vaccination" in a follow-up
$(document).on("click", ".followup-add", function () {
  openVetHealthForm(Number($(this).attr("data-id")), "vaccination", $(this).attr("data-vaccine"));
});

// A vet form was saved (pet-details.js): redraw the dashboard and say so
$(document).on("healthRecordSaved", function (e, message) {
  if (getRouteFromHash() === "vet-dashboard") { // from router.js
    renderVetDashboard();
    $("#vetSaved").text(message).removeClass("d-none");
  }
});


// ---------- Search, filters and quick actions ----------

$(document).on("input", "#vetPetSearch", renderVetPetTable);
$(document).on("change", "#vetPetFilters select", renderVetPetTable);

// Enter in the search box would send the form and reload the page: stop it
$(document).on("submit", "#vetPetFilters", function (e) {
  e.preventDefault();
});

// "Clear filters": reset() puts the fields back to their values in the HTML
$(document).on("click", "#vetClearFilters", function () {
  document.getElementById("vetPetFilters").reset();
  renderVetPetTable();
});

// Scrolls to the pet records box (scroll-margin-top in CSS keeps it below the navbar)
function scrollToVetPetRecords() {
  document.getElementById("vetPetRecords").scrollIntoView();
}

// Quick action "Find a pet": go to the table and put the cursor in the search box.
// preventScroll: focus() would jump there at once, instead of the smooth scroll.
$(document).on("click", "#vetFindPetButton", function () {
  scrollToVetPetRecords();
  document.getElementById("vetPetSearch").focus({ preventScroll: true });
});

// Quick action "View your patients": the table with only your patients
$(document).on("click", "#vetShowPatientsButton", function () {
  document.getElementById("vetPetFilters").reset();
  $("#vetShowFilter").val("mine");
  renderVetPetTable();
  scrollToVetPetRecords();
});

// Quick action "Add a health record": after choosing the pet and the kind of
// record, this modal closes and the chosen form opens, here on the dashboard
$(document).on("submit", "#vetAddRecordForm", function (e) {
  e.preventDefault();
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // no pet chosen: the error is shown
  }

  const petId = Number($("#vetRecordPet").val());
  const kind = $("#vetRecordType").val(); // "record" or "vaccination"
  const modalElement = document.getElementById("vetAddRecordModal");
  // Open the form only after this modal has closed, so the two don't
  // overlap (Bootstrap shows one modal at a time). .one() = run this only once.
  $(modalElement).one("hidden.bs.modal", function () {
    openVetHealthForm(petId, kind);
  });
  bootstrap.Modal.getInstance(modalElement).hide();
});

// The modal closed (Continue, Cancel, X or Esc): empty its form for next time
$(document).on("hidden.bs.modal", "#vetAddRecordModal", function () {
  resetForm(document.getElementById("vetAddRecordForm")); // from auth.js
});
