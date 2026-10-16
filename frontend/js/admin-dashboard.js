// Admin dashboard (admin): an overview of the system, the applications
// waiting for review, and links to the manage pages.
// Milestone 1: sample data from the other pages' scripts. From M4 the numbers
// come from the REST API, and the admin from the JWT token.
//
// Reuses: samplePets (pets.js), sampleShelters (shelters.js), sampleUsers,
// findUserById and demoAdminId (manage-users.js), sampleAdoptionApplications
// and formatDate (my-applications.js), findPetById (vet-dashboard.js) and
// getApplicantName (manage-applications.js).

// The id for a new item on the manage pages: one more than the highest id so
// far. (Not length + 1: after a delete, that could give an id that is still
// in use.) In M4 the database does this itself (AUTO_INCREMENT).
function getNextId(items) {
  let highest = 0;
  items.forEach(function (item) {
    if (item.id > highest) {
      highest = item.id;
    }
  });
  return highest + 1;
}

// How many pets have this status ("available", "pending" or "adopted")
function countPetsWithStatus(status) {
  return samplePets.filter(function (pet) { return pet.status === status; }).length;
}

// The pending applications, oldest first (first come, first served)
function getPendingApplications() {
  return sampleAdoptionApplications
    .filter(function (application) { return application.status === "pending"; })
    .sort(function (a, b) { return a.created_at.localeCompare(b.created_at); });
}

// One row of the "waiting for review" table, from the <template>.
// .text() and .attr() put the data in as plain text, never as HTML.
function createPendingRow(application) {
  const row = $($("#adminPendingRowTemplate").html());
  const pet = findPetById(application.pet_id);
  row.find(".pending-applicant").text(getApplicantName(application));
  row.find(".pending-pet").text(pet.name).attr("href", "#pet-details?id=" + pet.id);
  row.find(".pending-date").text(formatDate(application.created_at));
  // Opens the applications page with this review open (manage-applications.js)
  row.find(".pending-review")
    .attr("href", "#manage-applications?review=" + application.id)
    .attr("aria-label", "Review " + getApplicantName(application) + "'s application for " + pet.name);
  return row;
}

function renderAdminDashboard() {
  const pending = getPendingApplications();

  // Header: "Welcome back, Selma" (the first word of the name) and today's overview
  $("#adminFirstName").text(findUserById(demoAdminId).name.split(" ")[0]);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  let pendingText = pending.length + " applications are waiting for review.";
  if (pending.length === 0) {
    pendingText = "No applications are waiting for review.";
  } else if (pending.length === 1) {
    pendingText = "1 application is waiting for review.";
  }
  $("#adminOverview").text(today + " · " + pendingText);

  // Summary cards
  $("#adminPendingCount").text(pending.length);
  $("#adminAvailableCount").text(countPetsWithStatus("available"));
  $("#adminAdoptedCount").text(countPetsWithStatus("adopted"));
  $("#adminUserCount").text(sampleUsers.filter(function (user) { return user.role === "user"; }).length);

  // The first 5 pending applications
  const body = $("#adminPendingTableBody").empty();
  pending.slice(0, 5).forEach(function (application) {
    body.append(createPendingRow(application));
  });
  $("#adminPendingTableWrapper").toggleClass("d-none", pending.length === 0);
  $("#adminNoPending").toggleClass("d-none", pending.length > 0);

  // How many items each manage page has
  $("#adminPetTotal").text(samplePets.length);
  $("#adminShelterTotal").text(sampleShelters.length);
  $("#adminAccountTotal").text(sampleUsers.length);
  $("#adminApplicationTotal").text(sampleAdoptionApplications.length);
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "admin-dashboard") {
    renderAdminDashboard();
  }
});
