// Shelters page (everyone): browse the partner shelters, search by name or
// location, and filter by the animals they have available.
// Milestone 1: sample data instead of the backend. pets.js (the Shelter
// filter) and shelter-details.js reuse sampleShelters. From M4 the
// shelters come from the REST API through a service file, and this array goes.
//
// Reuses: samplePets (pets.js) and getInitials (profile.js).

// Same field names as the planned shelters table (id, name, address, city,
// phone, email), plus description, opening_hours, latitude and longitude,
// which the table doesn't have yet: a schema decision for M2. The ids match
// shelter_id on the pets.
// opening_hours is one text with a line per day group ("\n" = new line), or
// null when the shelter hasn't given any; then it isn't shown.
// latitude/longitude place the pin on the map on shelter-details (null = no
// map). The addresses are made up, so the pins are near each city's centre.
const sampleShelters = [
  {
    id: 1, name: "Happy Paws Shelter", address: "Kestenova 12", city: "Sarajevo",
    phone: "+387 33 123 456", email: "info@happypaws.example",
    description: "A family-run shelter that has been finding homes for dogs and cats since 2015. " +
      "Our volunteers walk, feed and play with every animal each day, and we're happy to help " +
      "you find the pet that fits your home.",
    opening_hours: "Monday–Friday: 9:00–17:00\nSaturday: 10:00–14:00\nSunday: closed",
    latitude: 43.8563, longitude: 18.4131
  },
  {
    id: 2, name: "Second Chance Rescue", address: "Lipa 7", city: "Mostar",
    phone: "+387 36 234 567", email: "hello@secondchance.example",
    description: "A volunteer rescue that gives abandoned animals a second chance at a happy life. " +
      "We take in pets found on the streets and care for them until they find a family who will love them.",
    opening_hours: "Monday–Saturday: 10:00–18:00\nSunday: closed",
    latitude: 43.3438, longitude: 17.8078
  },
  {
    id: 3, name: "Safe Haven Shelter", address: "Brezova 3", city: "Tuzla",
    phone: "+387 35 345 678", email: "contact@safehaven.example",
    description: "A small shelter with a big garden, where the dogs get daily walks and lots of play time. " +
      "Visitors are welcome to meet the dogs and take them for a walk before deciding to adopt.",
    opening_hours: "Every day: 8:00–16:00",
    latitude: 44.5384, longitude: 18.6671
  },
  {
    id: 4, name: "Whisker Haven Cat Rescue", address: "Javorova 21", city: "Banja Luka",
    phone: "+387 51 456 789", email: "cats@whiskerhaven.example",
    description: "A rescue for cats of all ages, from playful kittens to calm seniors looking for a quiet home. " +
      "Our cats live together in bright, cosy rooms, so you can see how they get along with others.",
    opening_hours: null,
    latitude: 44.7722, longitude: 17.1910
  }
];

// This shelter's pets that can be adopted now (pending and adopted pets don't
// count). Worked out from samplePets every time, so it's always up to date,
// e.g. after an admin changes a pet's status on pet-details.
// Also used by shelter-details.js to show these pets.
function getAvailableShelterPets(shelterId) {
  return samplePets.filter(function (pet) {
    return pet.shelter_id === shelterId && pet.status === "available";
  });
}

// How many of this shelter's available pets are dogs and how many are cats
function getShelterPetCounts(shelterId) {
  const availablePets = getAvailableShelterPets(shelterId);
  return {
    dogs: availablePets.filter(function (pet) { return pet.species === "dog"; }).length,
    cats: availablePets.filter(function (pet) { return pet.species === "cat"; }).length
  };
}

// (1, "dog") -> "1 dog", (2, "dog") -> "2 dogs"
function formatAnimalCount(count, animal) {
  return count + " " + animal + (count === 1 ? "" : "s");
}

// "2 dogs and 1 cat available", "2 cats available" or "No pets available right now"
function getShelterPetsText(counts) {
  const parts = [];
  if (counts.dogs > 0) {
    parts.push(formatAnimalCount(counts.dogs, "dog"));
  }
  if (counts.cats > 0) {
    parts.push(formatAnimalCount(counts.cats, "cat"));
  }
  if (parts.length === 0) {
    return "No pets available right now";
  }
  return parts.join(" and ") + " available";
}

// The link for a phone number. A tel: link opens the phone app and can't have
// spaces: "+387 33 123 456" -> "tel:+38733123456". Also used by shelter-details.js.
function getTelHref(phone) {
  return "tel:" + phone.replaceAll(" ", "");
}

// Makes one card from the <template> in shelters.html.
// .text() and .attr() put the data in as plain text, never as HTML.
function createShelterCard(shelter) {
  const card = $($("#shelterCardTemplate").html());
  const counts = getShelterPetCounts(shelter.id);
  const hasPets = counts.dogs + counts.cats > 0;

  card.find(".shelter-logo").text(getInitials(shelter.name)); // "Happy Paws Shelter" -> "HP"
  card.find(".shelter-name").text(shelter.name);
  card.find(".shelter-city").text(shelter.city);
  card.find(".shelter-description").text(shelter.description);
  card.find(".shelter-address").text(shelter.address + ", " + shelter.city);
  // tel: and mailto: links open the phone app or the email app
  card.find(".shelter-phone")
    .text(shelter.phone)
    .attr("href", getTelHref(shelter.phone));
  card.find(".shelter-email")
    .text(shelter.email)
    .attr("href", "mailto:" + shelter.email);
  card.find(".shelter-pets").text(getShelterPetsText(counts));

  card.find(".shelter-details-link")
    .attr("href", "#shelter-details?id=" + shelter.id)
    .attr("aria-label", "View details about " + shelter.name);
  // Opens the Pets page with this shelter chosen in its Shelter filter
  card.find(".shelter-pets-link")
    .attr("href", "#pets?shelter=" + shelter.id)
    .attr("aria-label", "Browse pets from " + shelter.name)
    .toggleClass("d-none", !hasPets);
  return card;
}

// The shelters that match the search AND the animal filter
function getFilteredShelters() {
  const search = $("#shelterSearch").val().trim().toLowerCase();
  const animal = $("#shelterAnimalFilter").val(); // "all", "dog" or "cat"

  return sampleShelters.filter(function (shelter) {
    // "Location" = the city and the address, so "Mostar" and "Lipa" both work
    const searchText = (shelter.name + " " + shelter.city + " " + shelter.address).toLowerCase();
    const counts = getShelterPetCounts(shelter.id);
    const hasAnimal = animal === "all"
      || (animal === "dog" && counts.dogs > 0)
      || (animal === "cat" && counts.cats > 0);
    return searchText.includes(search) && hasAnimal;
  });
}

// "4 shelters" or, with filters, "Showing 2 of 4 shelters"
function getShelterCountText(shownCount, totalCount) {
  const word = totalCount === 1 ? "shelter" : "shelters";
  if (shownCount === totalCount) {
    return totalCount + " " + word;
  }
  return "Showing " + shownCount + " of " + totalCount + " " + word;
}

// Draws the matching cards, the count and (if nothing matches) the empty state
function renderShelters() {
  const shown = getFilteredShelters();

  const list = $("#shelterList").empty();
  shown.forEach(function (shelter) {
    list.append(createShelterCard(shelter));
  });

  $("#shelterCount").text(getShelterCountText(shown.length, sampleShelters.length));
  $("#shelterEmptyState").toggleClass("d-none", shown.length > 0);
}

// The router announces every loaded view; draw the cards when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "shelters") {
    renderShelters();
  }
});

// The list updates while typing, and when the animal filter changes
$(document).on("input", "#shelterSearch", renderShelters);
$(document).on("change", "#shelterAnimalFilter", renderShelters);

// Enter in the search box would send the form and reload the page: stop it
$(document).on("submit", "#shelterFilters", function (e) {
  e.preventDefault();
});

// "Clear filters" (above the cards and in the empty state). reset() puts the
// fields back to their values in the HTML but doesn't fire "input" or
// "change", so the cards are redrawn here.
$(document).on("click", ".clear-shelter-filters", function () {
  document.getElementById("shelterFilters").reset();
  renderShelters();
});
