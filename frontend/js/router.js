// Simple hash router for the SPA.
// The part of the URL after # (for example #pets) decides which view
// from views/ is loaded into <main id="app">.

// Every page of the app. A link to anything else shows the not-found view.
const routes = [
  "home", "not-found", "login", "register",
  "pets", "pet-details", "shelters", "shelter-details",
  "about", "contact", "my-applications", "profile",
  "vet-dashboard", "admin-dashboard",
  "manage-pets", "manage-shelters", "manage-users", "manage-applications"
];

// "#pets" -> "pets". An empty hash means the home page.
function getRouteFromHash() {
  const route = window.location.hash.substring(1);
  return route === "" ? "home" : route;
}

function loadView(route) {
  if (!routes.includes(route)) {
    route = "not-found";
  }

  $("#app").load("views/" + route + ".html", function (response, status) {
    // The page is in the list, but its view file doesn't exist yet
    if (status === "error") {
      $("#app").load("views/not-found.html");
    }
    window.scrollTo(0, 0);
  });

  highlightNavLink(route);
  closeMobileMenu();
}

// Marks the navbar link of the current page
function highlightNavLink(route) {
  $(".site-navbar .nav-link").removeClass("active").removeAttr("aria-current");
  $('.site-navbar .nav-link[href="#' + route + '"]')
    .addClass("active")
    .attr("aria-current", "page");
}

// On phones the opened menu would stay open after a click, so close it
function closeMobileMenu() {
  const menu = bootstrap.Collapse.getInstance(document.getElementById("mainNav"));
  if (menu) {
    menu.hide();
  }
}

// Load a new view whenever the hash changes (link click, back/forward button)...
$(window).on("hashchange", function () {
  loadView(getRouteFromHash());
});

// ...and once when the page first opens
$(document).ready(function () {
  loadView(getRouteFromHash());
});
