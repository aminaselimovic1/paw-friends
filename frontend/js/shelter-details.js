// Shelter details page (everyone): one shelter, chosen by the link
// (#shelter-details?id=2), with its description, contact details, opening
// hours, a map and the pets it has available for adoption.
// Milestone 1: sample data. From M4 the shelter and its pets come from the
// REST API through a service file.
//
// Reuses (all scripts share one global scope): sampleShelters,
// getAvailableShelterPets, getShelterPetCounts, getShelterPetsText,
// getTelHref (shelters.js), createPetCard (pets.js), getInitials (profile.js)
// and getHashParam (router.js). The map uses L, the global object of Leaflet.

// The Leaflet map of the shelter shown now, or null. Kept so the old map can
// be removed before a new one is made: every visit to the page loads a new
// map <div>, so a new map is needed each time.
let shelterMap = null;

// The shelter from the link: "#shelter-details?id=2" -> the shelter with id 2.
// The same idea as getDetailPet() on pet-details: the id from the link is a
// string, so it's turned into a number first. undefined when not found.
function getDetailShelter() {
  const id = Number(getHashParam("id"));
  return sampleShelters.find(function (shelter) {
    return shelter.id === id;
  });
}

// "Monday–Friday: 9:00–17:00\nSunday: closed" -> one list item per line.
// The whole block is hidden when the shelter has no opening hours.
function renderShelterHours(shelter) {
  const list = $("#shelterHoursList").empty();
  if (shelter.opening_hours) {
    shelter.opening_hours.split("\n").forEach(function (line) {
      list.append($("<li>").text(line));
    });
  }
  $("#shelterHours").toggleClass("d-none", !shelter.opening_hours);
}

// A map with a pin at the shelter's coordinates (Leaflet + OpenStreetMap).
// The section is hidden when the shelter has no coordinates, or when Leaflet
// couldn't be loaded from the CDN (then L doesn't exist).
function renderShelterMap(shelter) {
  const canShowMap = typeof L !== "undefined"
    && typeof shelter.latitude === "number"
    && typeof shelter.longitude === "number";
  $("#shelterLocation").toggleClass("d-none", !canShowMap);

  if (shelterMap !== null) {
    shelterMap.remove(); // frees the previous map (its events and layers)
    shelterMap = null;
  }
  if (!canShowMap) {
    return;
  }

  // Leaflet uses [latitude, longitude]; 15 = zoomed in to street level.
  // scrollWheelZoom: false, so scrolling down the page doesn't zoom the map.
  const position = [shelter.latitude, shelter.longitude];
  shelterMap = L.map("shelterMap", { scrollWheelZoom: false }).setView(position, 15);

  // The map images ("tiles") come from OpenStreetMap. Its rules require
  // this credit, which Leaflet shows in the corner of the map.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(shelterMap);

  // The pin's popup. It's built with .text() and given to Leaflet as an
  // element: a plain string would be read as HTML.
  const popup = $("<div>");
  $("<strong>").text(shelter.name).appendTo(popup);
  $("<div>").text(shelter.address + ", " + shelter.city).appendTo(popup);
  L.marker(position).addTo(shelterMap).bindPopup(popup[0]);
}

// The shelter's available pets, as the same cards as on the Pets page
function renderShelterPets(shelter) {
  const pets = getAvailableShelterPets(shelter.id);

  const list = $("#shelterPetList").empty();
  pets.forEach(function (pet) {
    list.append(createPetCard(pet)); // from pets.js
  });

  // "1 dog and 1 cat available", or the empty state when there are none
  $("#shelterPetsCount").text(pets.length > 0 ? getShelterPetsText(getShelterPetCounts(shelter.id)) : "");
  $("#shelterPetsEmpty").toggleClass("d-none", pets.length > 0);
}

// Fills the whole page for the shelter in the link, or shows "Shelter not found".
// .text() and .attr() put the data in as plain text, never as HTML.
function renderShelterDetails() {
  const shelter = getDetailShelter();
  $("#shelterNotFound").toggleClass("d-none", shelter !== undefined);
  $("#shelterContent").toggleClass("d-none", shelter === undefined);
  if (shelter === undefined) {
    return;
  }

  $("#shelterDetailLogo").text(getInitials(shelter.name)); // "Happy Paws Shelter" -> "HP"
  $("#shelterDetailName").text(shelter.name);
  $(".shelter-detail-name").text(shelter.name); // in "About Happy Paws Shelter"
  $("#shelterDetailCity").text(shelter.city);

  // The full description, only when there is one
  $("#shelterDetailDescription").text(shelter.description || "");
  $("#shelterAbout").toggleClass("d-none", !shelter.description);

  $("#shelterDetailAddress").text(shelter.address + ", " + shelter.city);
  $("#shelterDetailPhone").text(shelter.phone).attr("href", getTelHref(shelter.phone));
  $("#shelterDetailEmail").text(shelter.email).attr("href", "mailto:" + shelter.email);

  renderShelterHours(shelter);
  renderShelterMap(shelter);
  renderShelterPets(shelter);
}

// The router announces every loaded view; fill the page when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "shelter-details") {
    renderShelterDetails();
  }
});
