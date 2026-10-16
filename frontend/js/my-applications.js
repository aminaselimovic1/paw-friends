// My applications page (user only).
// Milestone 1: sample data instead of the backend. From M4 the same list
// comes from the REST API (through a service file), and this array goes.
//
// Reuses: sampleUser (profile.js) and samplePets (pets.js).

// Every adoption application, from every user: the same columns as the
// planned adoption_applications table. This page shows only the logged-in
// user's (sampleUser, id 7: Lejla); the admin pages show and review all of
// them (manage-applications.js), so a decision there shows up here too.
// reviewed_by = the id of the admin who decided (null while pending).
const sampleAdoptionApplications = [
  {
    id: 1, pet_id: 2, user_id: 7, status: "pending", reviewed_by: null, created_at: "2026-10-12",
    message: "I work from home and have a quiet flat, which would suit a calm cat like Luna."
  },
  {
    id: 2, pet_id: 3, user_id: 7, status: "pending", reviewed_by: null, created_at: "2026-10-05",
    message: "We have a garden and two children who would love to take Rocky on walks."
  },
  {
    id: 3, pet_id: 1, user_id: 7, status: "rejected", reviewed_by: 1, created_at: "2026-09-28",
    message: "Max looks like the perfect running partner for me."
  },
  {
    id: 4, pet_id: 11, user_id: 3, status: "approved", reviewed_by: 1, created_at: "2026-08-20",
    message: "Our family has had cocker spaniels before and we have a big garden."
  },
  {
    id: 5, pet_id: 12, user_id: 5, status: "approved", reviewed_by: 1, created_at: "2026-09-10",
    message: "Coco would be our first cat, and we've prepared a cosy corner for her."
  },
  {
    id: 6, pet_id: 8, user_id: 6, status: "pending", reviewed_by: null, created_at: "2026-10-08",
    message: "I live alone in a calm flat and I'm patient with shy animals."
  },
  {
    id: 7, pet_id: 9, user_id: 8, status: "pending", reviewed_by: null, created_at: "2026-10-10",
    message: "I'm retired and can give Charlie short walks and lots of company."
  },
  {
    id: 8, pet_id: 10, user_id: 3, status: "pending", reviewed_by: null, created_at: "2026-10-14",
    message: "Mia would have plenty of shelves to climb in our house."
  },
  {
    id: 9, pet_id: 2, user_id: 8, status: "pending", reviewed_by: null, created_at: "2026-10-13",
    message: null
  },
  {
    id: 10, pet_id: 4, user_id: 6, status: "rejected", reviewed_by: 1, created_at: "2026-09-15",
    message: "I'd like a puppy, but I work long hours."
  }
];

// The logged-in user's applications, newest first, with the pet's name, photo
// and shelter added from samplePets (in M4 the API returns them like this)
function getMyApplications() {
  return sampleAdoptionApplications
    .filter(function (application) { return application.user_id === sampleUser.id; })
    .sort(function (a, b) { return b.created_at.localeCompare(a.created_at); })
    .map(function (application) {
      const pet = samplePets.find(function (p) { return p.id === application.pet_id; });
      return {
        id: application.id, pet_id: application.pet_id, status: application.status,
        created_at: application.created_at, pet_name: pet.name,
        pet_photo_url: pet.photo_url, shelter_name: pet.shelter_name
      };
    });
}

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
  const myApplications = getMyApplications();
  const shown = myApplications.filter(function (application) {
    return status === "all" || application.status === status;
  });

  const list = $("#applicationList").empty();
  shown.forEach(function (application) {
    list.append(createApplicationCard(application));
  });

  $("#applicationCount").text(getCountText(shown.length, myApplications.length));

  // Empty state: no applications at all, or none with this status
  $("#emptyState").toggleClass("d-none", shown.length > 0);
  if (myApplications.length === 0) {
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
