// Pets page (everyone): browse the pets, search by name, filter the list
// and move between pages of 6 pets.
// Milestone 1: sample data instead of the backend. pet-details.js will reuse
// samplePets later. From M4 the pets come from the REST API through a
// service file, and this array goes.
//
// All our scripts share one global scope, so every name here is unique
// (my-applications.js already has statusBadges, formatDate and getCountText),
// and so is every id in pets.html (my-applications.js listens to #statusFilter).

// Same field names as the planned pets table (snake_case). shelter_name is
// not a pets column: it comes from the shelters table, like in My applications.
// shelter_id is the id of a shelter in sampleShelters (shelters.js).
// There's no age column: the age is worked out from birth_date (see below),
// so it's never out of date. Pets without a photo have photo_url: null.
// status matches the applications (my-applications.js): "pending" while at
// least one application is waiting for review, "adopted" once one is approved.
const samplePets = [
  {
    id: 1, shelter_id: 1, shelter_name: "Happy Paws Shelter",
    name: "Max", species: "dog", breed_name: "Labrador Retriever", sex: "male",
    birth_date: "2023-06-12", photo_url: "assets/images/pet-max.jpg", status: "available",
    description: "A friendly, energetic dog who loves long walks and playing fetch. Great with children."
  },
  {
    id: 2, shelter_id: 2, shelter_name: "Second Chance Rescue",
    name: "Luna", species: "cat", breed_name: "British Shorthair", sex: "female",
    birth_date: "2024-03-08", photo_url: "assets/images/pet-luna.jpg", status: "pending",
    description: "A calm, affectionate cat who enjoys quiet afternoons on the windowsill. She loves gentle brushing."
  },
  {
    id: 3, shelter_id: 1, shelter_name: "Happy Paws Shelter",
    name: "Rocky", species: "dog", breed_name: "Beagle", sex: "male",
    birth_date: "2025-05-20", photo_url: "assets/images/pet-rocky.jpg", status: "pending",
    description: "A curious, playful young dog who follows his nose everywhere. He would love an active family."
  },
  {
    id: 4, shelter_id: 2, shelter_name: "Second Chance Rescue",
    name: "Bella", species: "dog", breed_name: "Golden Retriever", sex: "female",
    birth_date: "2026-02-14", photo_url: null, status: "available",
    description: "A sweet, cuddly puppy who is learning her first commands. She gets along well with other dogs."
  },
  {
    id: 5, shelter_id: 4, shelter_name: "Whisker Haven Cat Rescue",
    name: "Milo", species: "cat", breed_name: "Siamese", sex: "male",
    birth_date: "2026-04-03", photo_url: null, status: "available",
    description: "A chatty little kitten full of energy. He loves chasing toys and then curling up on a warm lap."
  },
  {
    id: 6, shelter_id: 3, shelter_name: "Safe Haven Shelter",
    name: "Daisy", species: "dog", breed_name: "Border Collie", sex: "female",
    birth_date: "2021-09-05", photo_url: null, status: "available",
    description: "A smart, hard-working dog who needs daily exercise and games. Best with an experienced owner."
  },
  {
    id: 7, shelter_id: 4, shelter_name: "Whisker Haven Cat Rescue",
    name: "Oliver", species: "cat", breed_name: "Maine Coon", sex: "male",
    birth_date: "2017-11-22", photo_url: null, status: "available",
    description: "A gentle senior cat who loves naps and soft blankets. He would be happiest in a quiet home."
  },
  {
    id: 8, shelter_id: 1, shelter_name: "Happy Paws Shelter",
    name: "Nala", species: "cat", breed_name: "Persian", sex: "female",
    birth_date: "2020-07-30", photo_url: null, status: "pending",
    description: "A shy but loving cat who warms up quickly once she trusts you. Perfect for a calm household."
  },
  {
    id: 9, shelter_id: 3, shelter_name: "Safe Haven Shelter",
    name: "Charlie", species: "dog", breed_name: "German Shepherd", sex: "male",
    birth_date: "2017-01-10", photo_url: null, status: "pending",
    description: "A loyal, well-trained older dog who knows many commands. He enjoys short walks and lots of attention."
  },
  {
    id: 10, shelter_id: 1, shelter_name: "Happy Paws Shelter",
    name: "Mia", species: "cat", breed_name: "Bengal", sex: "female",
    birth_date: "2025-08-15", photo_url: null, status: "pending",
    description: "A playful, adventurous cat who loves climbing and exploring. She needs plenty of toys."
  },
  {
    id: 11, shelter_id: 1, shelter_name: "Happy Paws Shelter",
    name: "Buddy", species: "dog", breed_name: "Cocker Spaniel", sex: "male",
    birth_date: "2022-04-18", photo_url: null, status: "adopted",
    description: "A happy, gentle dog who loves everyone he meets. His tail never stops wagging."
  },
  {
    id: 12, shelter_id: 4, shelter_name: "Whisker Haven Cat Rescue",
    name: "Coco", species: "cat", breed_name: "Ragdoll", sex: "female",
    birth_date: "2026-03-01", photo_url: null, status: "adopted",
    description: "A fluffy, relaxed kitten who loves being held. She purrs as soon as you pick her up."
  }
];

// Text and Bootstrap colour class for each status badge.
// Adopted is grey, so an adopted pet never looks available.
const petStatusBadges = {
  available: { label: "Available", cssClass: "text-bg-success" },
  pending: { label: "Pending", cssClass: "text-bg-warning" },
  adopted: { label: "Adopted", cssClass: "text-bg-secondary" }
};

// Pagination: how many cards one page shows, and the page shown now (1 = first).
// "let", because the page changes when a page button is clicked.
const petsPerPage = 6;
let currentPetPage = 1;

// "dog" -> "Dog", "female" -> "Female"
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Whole months from the birth date to today (the computer's date).
// "T00:00:00" makes it local time, like formatDate() in my-applications.js.
function getPetAgeInMonths(birthDate) {
  const birth = new Date(birthDate + "T00:00:00");
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12
    + (today.getMonth() - birth.getMonth());
  // This month's "birthday" hasn't come yet (e.g. born on the 20th, today is the 16th)
  if (today.getDate() < birth.getDate()) {
    months = months - 1;
  }
  return months;
}

// 8 -> "8 months", 16 -> "1 year", 40 -> "3 years" (whole years, rounded down)
function formatPetAge(months) {
  if (months < 12) {
    return months === 1 ? "1 month" : months + " months";
  }
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year" : years + " years";
}

// The age groups of the Age filter. The boundaries are set only here:
// baby = under 1 year, young = 1 to under 3, adult = 3 to under 8, senior = 8+
function getPetAgeGroup(months) {
  if (months < 1 * 12) {
    return "baby";
  }
  if (months < 3 * 12) {
    return "young";
  }
  if (months < 8 * 12) {
    return "adult";
  }
  return "senior";
}

// Makes one card from the <template> in pets.html.
// .text() and .attr() put the data in as plain text, never as HTML,
// so a name like "<b>Max</b>" can't break or change the page.
function createPetCard(pet) {
  const card = $($("#petCardTemplate").html());
  const badge = petStatusBadges[pet.status];

  // The photo if the pet has one, otherwise the "Photo coming soon" box
  if (pet.photo_url) {
    card.find(".pet-photo")
      .attr("src", pet.photo_url)
      .attr("alt", pet.name + ", a " + pet.breed_name + " " + pet.species);
    card.find(".pet-photo-placeholder").remove();
  } else {
    card.find(".pet-photo").remove();
  }

  card.find(".pet-name").text(pet.name);
  card.find(".pet-status").text(badge.label).addClass(badge.cssClass);
  card.find(".pet-breed").text(capitalizeFirstLetter(pet.species) + " · " + pet.breed_name);
  card.find(".pet-age").text(formatPetAge(getPetAgeInMonths(pet.birth_date)));
  card.find(".pet-sex").text(capitalizeFirstLetter(pet.sex));
  card.find(".pet-shelter").text(pet.shelter_name);
  card.find(".pet-description").text(pet.description);
  card.find(".pet-details-link")
    .attr("href", "#pet-details?id=" + pet.id)
    .attr("aria-label", "View details about " + pet.name);
  return card;
}

// The Shelter filter: one <option> per shelter in sampleShelters (shelters.js).
// A link from the Shelters page (#pets?shelter=2) chooses that shelter, but
// only if a shelter with that id exists; otherwise "All shelters" stays.
function fillPetShelterFilter() {
  const select = $("#petShelterFilter");
  sampleShelters.forEach(function (shelter) {
    select.append($("<option>").val(shelter.id).text(shelter.name));
  });

  const shelterId = getHashParam("shelter"); // from router.js: "2", or null
  const shelterExists = sampleShelters.some(function (shelter) {
    return String(shelter.id) === shelterId;
  });
  if (shelterExists) {
    select.val(shelterId);
  }
}

// The pets that match the search AND every filter
function getFilteredPets() {
  const search = $("#petSearch").val().trim().toLowerCase();
  const shelter = $("#petShelterFilter").val(); // "all" or a shelter id, e.g. "2"
  const species = $("#petSpeciesFilter").val(); // "all", "dog" or "cat"
  const ageGroup = $("#petAgeFilter").val();    // "all", "baby", "young", "adult" or "senior"
  const sex = $("#petSexFilter").val();         // "all", "male" or "female"
  const status = $("#petStatusFilter").val();   // "all", "available", "pending" or "adopted"

  return samplePets.filter(function (pet) {
    // An empty search ("") is part of every name, so it matches all pets
    // The select's value is text ("2") and shelter_id a number (2): Number() first
    return pet.name.toLowerCase().includes(search)
      && (shelter === "all" || pet.shelter_id === Number(shelter))
      && (species === "all" || pet.species === species)
      && (ageGroup === "all" || getPetAgeGroup(getPetAgeInMonths(pet.birth_date)) === ageGroup)
      && (sex === "all" || pet.sex === sex)
      && (status === "all" || pet.status === status);
  });
}

// "3 pets" when they all fit on one page, otherwise the pets on this page:
// "Showing 1–6 of 7 pets", and "Showing 7 of 7 pets" for a single one
function getPetCountText(start, shownCount, matchCount) {
  const word = matchCount === 1 ? "pet" : "pets";
  if (matchCount <= petsPerPage) {
    return matchCount + " " + word;
  }
  const first = start + 1; // start counts from 0, people count from 1
  const last = start + shownCount;
  const range = first === last ? first : first + "–" + last;
  return "Showing " + range + " of " + matchCount + " " + word;
}

// Makes one page button from the <template> in pets.html.
// data-page is the page the button goes to.
function createPetPageItem(label, page, isDisabled, isActive) {
  const item = $($("#petPageItemTemplate").html());
  const button = item.find(".page-link");

  item.toggleClass("disabled", isDisabled).toggleClass("active", isActive);
  button.text(label).attr("data-page", page).prop("disabled", isDisabled);
  if (isActive) {
    button.attr("aria-current", "page"); // screen readers: "this is the current page"
  }
  return item;
}

// Previous, one button per page, Next. Hidden when there's only one page.
// Previous is disabled on the first page, Next on the last.
function renderPetPagination(pageCount) {
  const list = $("#petPagination ul").empty();
  $("#petPagination").toggleClass("d-none", pageCount <= 1);

  list.append(createPetPageItem("Previous", currentPetPage - 1, currentPetPage === 1, false));
  for (let page = 1; page <= pageCount; page++) {
    list.append(createPetPageItem(page, page, false, page === currentPetPage));
  }
  list.append(createPetPageItem("Next", currentPetPage + 1, currentPetPage === pageCount, false));
}

// Draws one page of the matching cards, the count, the page buttons
// and (if nothing matches) the empty state
function renderPets() {
  const matching = getFilteredPets();
  const pageCount = Math.ceil(matching.length / petsPerPage); // 7 pets -> 2 pages

  // The pets of the current page. Page 2: start = 6, slice(6, 12) gives
  // the 7th to 12th pet (slice stops before its second number).
  const start = (currentPetPage - 1) * petsPerPage;
  const shown = matching.slice(start, start + petsPerPage);

  const list = $("#petList").empty();
  shown.forEach(function (pet) {
    list.append(createPetCard(pet));
  });

  $("#petCount").text(getPetCountText(start, shown.length, matching.length));
  renderPetPagination(pageCount);
  $("#petEmptyState").toggleClass("d-none", matching.length > 0);
}

// Back to page 1 and redraw. Used whenever the list of matching pets can
// change (the page opens, a filter changes): page 2 may not exist any more,
// for example when only 4 dogs match.
function showFirstPetPage() {
  currentPetPage = 1;
  renderPets();
}

// The router announces every loaded view; draw the cards when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "pets") {
    fillPetShelterFilter();
    showFirstPetPage();
  }
});

// The list updates while typing, and when any of the five selects changes
$(document).on("input", "#petSearch", showFirstPetPage);
$(document).on("change", "#petFilters select", showFirstPetPage);

// A page button: show that page, then scroll back up to the count above the
// cards, otherwise you'd stay down at the buttons, below the new cards.
// Disabled buttons (Previous on page 1, Next on the last page) can't be clicked.
$(document).on("click", "#petPagination .page-link", function () {
  currentPetPage = Number($(this).attr("data-page"));
  renderPets();
  document.getElementById("petResults").scrollIntoView();
});

// Enter in the search box would send the form and reload the page: stop it
$(document).on("submit", "#petFilters", function (e) {
  e.preventDefault();
});

// "Clear filters" (above the cards and in the empty state).
// reset() puts every field back to its value in the HTML: an empty search,
// "All ..." in four selects and "Available" in the status select.
// (Shelter goes back to "All shelters": an option chosen by JS doesn't count
// as the HTML value.)
// It doesn't fire "input" or "change", so the cards are redrawn here.
$(document).on("click", ".clear-pet-filters", function () {
  document.getElementById("petFilters").reset();
  showFirstPetPage();
});
