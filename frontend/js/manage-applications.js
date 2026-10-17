// Manage applications page (admin): every adoption application, with search
// and a status filter; "Review" opens a modal to approve or reject.
// Milestone 1: sample data, kept until the page is reloaded. From M4 this
// becomes requests to the REST API, and the backend applies the same rules.
//
// Reuses: sampleAdoptionApplications, statusBadges, formatDate
// (my-applications.js), findPetById and fillPetLink (vet-dashboard.js), findUserById and
// demoAdminId (manage-users.js) and getHashParam (router.js).

// The application shown in the review modal (its id), or null
let reviewedApplicationId = null;

function findApplicationById(applicationId) {
  return sampleAdoptionApplications.find(function (application) {
    return application.id === applicationId;
  });
}

// The applicant's name, or a placeholder if the account no longer exists
function getApplicantName(application) {
  const user = findUserById(application.user_id);
  return user ? user.name : "Unknown user";
}

// The pet's name, or a placeholder if the pet no longer exists
function getPetName(application) {
  const pet = findPetById(application.pet_id);
  return pet ? pet.name : "Unknown pet";
}

// The other pending applications for the same pet
function getOtherPendingApplications(application) {
  return sampleAdoptionApplications.filter(function (other) {
    return other.pet_id === application.pet_id
      && other.id !== application.id
      && other.status === "pending";
  });
}

// Approve: the pet is adopted, so every other pending application for the
// same pet is rejected (the pet isn't available any more).
// reviewed_by records which admin decided.
function approveApplication(application) {
  application.status = "approved";
  application.reviewed_by = demoAdminId;
  findPetById(application.pet_id).status = "adopted";
  getOtherPendingApplications(application).forEach(function (other) {
    other.status = "rejected";
    other.reviewed_by = demoAdminId;
  });
}

function rejectApplication(application) {
  application.status = "rejected";
  application.reviewed_by = demoAdminId;
}

// The applications that match the search (applicant or pet name) AND the
// status filter, newest first
function getFilteredApplications() {
  const search = $("#manageApplicationSearch").val().trim().toLowerCase();
  const status = $("#manageApplicationStatus").val(); // "pending", "approved", "rejected" or "all"
  return sampleAdoptionApplications
    .filter(function (application) {
      const matchesSearch = getApplicantName(application).toLowerCase().includes(search)
        || getPetName(application).toLowerCase().includes(search);
      return matchesSearch && (status === "all" || application.status === status);
    })
    .sort(function (a, b) { return b.created_at.localeCompare(a.created_at); });
}

// One table row, from the <template> in manage-applications.html.
// .text() and .attr() put the data in as plain text, never as HTML.
function createManageApplicationRow(application) {
  const row = $($("#manageApplicationRowTemplate").html());
  const pet = findPetById(application.pet_id);
  const user = findUserById(application.user_id);
  const badge = statusBadges[application.status];

  row.find(".application-applicant").text(getApplicantName(application));
  row.find(".application-email").text(user ? user.email : "");
  fillPetLink(row.find(".application-pet"), application.pet_id);
  row.find(".application-shelter").text(pet ? pet.shelter_name : "");
  row.find(".application-date").text(formatDate(application.created_at));
  row.find(".application-status").text(badge.label).addClass(badge.cssClass);
  row.find(".review-application")
    .attr("data-id", application.id)
    .attr("aria-label", "Review " + getApplicantName(application) + "'s application for " + getPetName(application));
  return row;
}

// The table, the count, or the empty message
function renderManageApplications() {
  const shown = getFilteredApplications();
  const body = $("#manageApplicationTableBody").empty();
  shown.forEach(function (application) {
    body.append(createManageApplicationRow(application));
  });

  const total = sampleAdoptionApplications.length;
  const word = total === 1 ? "application" : "applications";
  $("#manageApplicationCount").text("Showing " + shown.length + " of " + total + " " + word);
  $("#manageApplicationTableWrapper").toggleClass("d-none", shown.length === 0);
  $("#manageApplicationEmpty").toggleClass("d-none", shown.length > 0);
}

// Fills the review modal with one application and opens it
function openReviewModal(application) {
  const pet = findPetById(application.pet_id);
  const petName = getPetName(application);
  const user = findUserById(application.user_id);
  const reviewer = findUserById(application.reviewed_by);
  const badge = statusBadges[application.status];
  const isPending = application.status === "pending";
  const otherCount = getOtherPendingApplications(application).length;

  reviewedApplicationId = application.id;
  $("#reviewTitle").text(getApplicantName(application) + "'s application for " + petName);
  $("#reviewApplicant").text(getApplicantName(application));
  $("#reviewEmail").text(user ? user.email : "");
  fillPetLink($("#reviewPet"), application.pet_id);
  $("#reviewShelter").text(pet ? pet.shelter_name : "");
  $("#reviewDate").text(formatDate(application.created_at));
  $("#reviewStatus").text(badge.label).attr("class", "badge " + badge.cssClass);
  $("#reviewReviewer").text(reviewer ? reviewer.name : "");
  $(".review-reviewer").toggleClass("d-none", reviewer === undefined);
  $("#reviewMessage").text(application.message || "No message.");

  // Pending: what approving will do, and the Approve / Reject buttons.
  // A pet that no longer exists can't be adopted, so then only Reject is shown.
  let note = "Approving marks " + petName + " as adopted.";
  if (otherCount > 0) {
    note += " The other " + otherCount + " pending application(s) for " + petName + " will be rejected.";
  }
  if (pet === undefined) {
    note = "This pet is no longer on PawFriends, so the application can only be rejected.";
  }
  $("#reviewNote").text(note).toggleClass("d-none", !isPending);
  $(".review-action").toggleClass("d-none", !isPending);
  $("#approveApplication").toggleClass("d-none", !isPending || pet === undefined);

  bootstrap.Modal.getOrCreateInstance(document.getElementById("reviewModal")).show();
}

// A link from the admin dashboard (#manage-applications?review=4) opens that
// review straight away. replaceState then removes "?review=4" from the
// address without a hashchange, so Back/Forward don't open it again.
function openReviewFromLink() {
  const application = findApplicationById(Number(getHashParam("review")));
  if (application !== undefined) {
    openReviewModal(application);
    history.replaceState(null, "", "#manage-applications");
  }
}

$(document).on("viewLoaded", function (e, route) {
  if (route === "manage-applications") {
    renderManageApplications();
    openReviewFromLink();
  }
});

// Search and filter
$(document).on("input", "#manageApplicationSearch", renderManageApplications);
$(document).on("change", "#manageApplicationStatus", renderManageApplications);
$(document).on("submit", "#manageApplicationFilters", function (e) {
  e.preventDefault(); // Enter in the search box would reload the page
});
$(document).on("click", "#manageApplicationClear", function () {
  document.getElementById("manageApplicationFilters").reset();
  renderManageApplications();
});

// "Review" in a row
$(document).on("click", ".review-application", function () {
  openReviewModal(findApplicationById(Number($(this).attr("data-id"))));
});

// Closes the review modal, shows what happened and redraws the table
function finishReview(message) {
  bootstrap.Modal.getInstance(document.getElementById("reviewModal")).hide();
  $("#applicationDecision").text(message).removeClass("d-none");
  renderManageApplications();
}

$(document).on("click", "#approveApplication", function () {
  const application = findApplicationById(reviewedApplicationId);
  const pet = findPetById(application.pet_id);
  // The button is hidden for a decided application or a pet that no longer
  // exists, but a script could still click it, so check again here
  if (application.status !== "pending" || pet === undefined) {
    return;
  }
  const otherCount = getOtherPendingApplications(application).length;
  approveApplication(application);

  let message = getApplicantName(application) + "'s application for " + pet.name
    + " was approved. " + pet.name + " is now marked as adopted.";
  if (otherCount > 0) {
    message += " " + otherCount + " other application(s) for " + pet.name + " were rejected.";
  }
  finishReview(message);
});

$(document).on("click", "#rejectApplication", function () {
  const application = findApplicationById(reviewedApplicationId);
  // Only a pending application can be rejected (the button is hidden otherwise)
  if (application.status !== "pending") {
    return;
  }
  rejectApplication(application);
  finishReview(getApplicantName(application) + "'s application for "
    + getPetName(application) + " was rejected.");
});
