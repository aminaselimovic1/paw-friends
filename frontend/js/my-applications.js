// My applications page (user only).
// Milestone 1: sample data instead of the backend. From M4 the same list
// comes from the REST API (through a service file), and only this array goes.

// Same field names as the database and the API (snake_case)
const sampleApplications = [
  {
    id: 1, pet_id: 2, pet_name: "Luna", pet_photo_url: "assets/images/pet-luna.jpg",
    shelter_name: "Second Chance Rescue", status: "pending", created_at: "2026-10-12"
  },
  {
    id: 2, pet_id: 3, pet_name: "Rocky", pet_photo_url: "assets/images/pet-rocky.jpg",
    shelter_name: "Happy Paws Shelter", status: "pending", created_at: "2026-10-05"
  },
  {
    id: 3, pet_id: 1, pet_name: "Max", pet_photo_url: "assets/images/pet-max.jpg",
    shelter_name: "Happy Paws Shelter", status: "approved", created_at: "2026-09-28"
  }
];

// Text and Bootstrap colour class for each status badge
const statusBadges = {
  pending: { label: "Pending", cssClass: "text-bg-warning" },
  approved: { label: "Approved", cssClass: "text-bg-success" },
  rejected: { label: "Rejected", cssClass: "text-bg-danger" }
};

// "2026-10-12" -> "12 October 2026".
// "T00:00:00" makes it local time; without it the date is read as UTC
// midnight and can show the day before in some time zones.
function formatDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}

// Makes one card from the <template> in my-applications.html.
// .text() and .attr() put the data in as plain text, never as HTML,
// so a name like "<b>Max</b>" can't break or change the page.
function createApplicationCard(application) {
  const card = $($("#applicationCardTemplate").html());
  const badge = statusBadges[application.status];

  card.find(".application-photo")
    .attr("src", application.pet_photo_url)
    .attr("alt", application.pet_name);
  card.find(".application-pet-name").text(application.pet_name);
  card.find(".application-status").text(badge.label).addClass(badge.cssClass);
  card.find(".application-date").text(formatDate(application.created_at));
  card.find(".application-shelter").text(application.shelter_name);
  card.find(".application-details-link")
    .attr("href", "#pet-details?id=" + application.pet_id)
    .attr("aria-label", "View details about " + application.pet_name);
  return card;
}

// "3 applications" or, with a filter, "Showing 2 of 3 applications"
function getCountText(shownCount, totalCount) {
  const word = totalCount === 1 ? "application" : "applications";
  if (shownCount === totalCount) {
    return totalCount + " " + word;
  }
  return "Showing " + shownCount + " of " + totalCount + " " + word;
}

// Draws the cards that match the chosen status, the count and the empty state
function renderApplications() {
  const status = $("#statusFilter").val(); // "all", "pending", "approved" or "rejected"
  const shown = sampleApplications.filter(function (application) {
    return status === "all" || application.status === status;
  });

  const list = $("#applicationList").empty();
  shown.forEach(function (application) {
    list.append(createApplicationCard(application));
  });

  $("#applicationCount").text(getCountText(shown.length, sampleApplications.length));

  // Empty state: no applications at all, or none with this status
  $("#emptyState").toggleClass("d-none", shown.length > 0);
  if (sampleApplications.length === 0) {
    $("#emptyStateText").text("You haven't applied to adopt any pets yet.");
  } else {
    $("#emptyStateText").text("You have no " + status + " applications.");
  }
}

// The router announces every loaded view; draw the cards when it's this one
$(document).on("viewLoaded", function (e, route) {
  if (route === "my-applications") {
    renderApplications();
  }
});

// A different status is chosen in the filter
$(document).on("change", "#statusFilter", renderApplications);
