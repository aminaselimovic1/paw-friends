// Demo role switcher (Milestone 1).
// There's no login until Milestone 4, so the "Demo: view as" menu decides
// the role. From M4 the role comes from the JWT token instead: getRole()
// changes, and showLinksFor() stays the same.

// The current role: "guest", "user", "vet" or "admin".
// localStorage keeps it when the page is reloaded.
function getRole() {
  return localStorage.getItem("demoRole") || "guest";
}

function setRole(role) {
  localStorage.setItem("demoRole", role);
  showLinksFor(role);
}

// Shows only the elements (navbar items and parts of views) whose data-roles
// list includes the role. Elements without data-roles are not touched, so
// everyone sees them.
function showLinksFor(role) {
  $("[data-roles]").each(function () {
    const allowedRoles = $(this).attr("data-roles").split(" ");
    // d-none is Bootstrap's class for display: none
    $(this).toggleClass("d-none", !allowedRoles.includes(role));
  });
  $("#roleSelect").val(role);
}

// A different role is picked in the demo menu
$(document).on("change", "#roleSelect", function () {
  setRole($(this).val());
});

// "Log out" makes you a guest again (its link then goes to #home)
$(document).on("click", "#logoutButton", function () {
  setRole("guest");
});

// Show the right links when the page first opens
$(document).ready(function () {
  showLinksFor(getRole());
});



