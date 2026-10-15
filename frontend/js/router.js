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

// "#pets" -> "pets", "#pet-details?id=2" -> "pet-details".
// Everything after "?" is ignored here. An empty hash means the home page.
function getRouteFromHash() {
  const route = window.location.hash.substring(1).split("?")[0];
  return route === "" ? "home" : route;
}

// Reads a value after "?" in the hash, for example on "#pet-details?id=2"
// getHashParam("id") returns "2". Returns null if the value isn't there.
function getHashParam(name) {
  const query = window.location.hash.split("?")[1] || "";
  return new URLSearchParams(query).get(name);
}

function loadView(route) {
  if (!routes.includes(route)) {
    route = "not-found";
  }

  $("#app").load("views/" + route + ".html", function (response, status) {
    // The view's HTML is now in the page: show only its parts for this role
    showLinksFor(getRole()); // from roles.js

    // The page is in the list, but its view file doesn't exist yet
    if (status === "error") {
      $("#app").load("views/not-found.html");
    }
    window.scrollTo(0, 0);

    // Tell the page scripts which view is now shown, so they can fill it in
    // (e.g. my-applications.js draws its cards). Not sent if the file was missing.
    if (status !== "error") {
      $(document).trigger("viewLoaded", [route]);
    }
  });

  highlightNavLink(route);
  closeMobileMenu();
}

// Marks the navbar link of the current page (also links inside dropdown menus)
function highlightNavLink(route) {
  const navLinks = $(".site-navbar .nav-link, .site-navbar .dropdown-item");
  navLinks.removeClass("active").removeAttr("aria-current");
  navLinks.filter('[href="#' + route + '"]')
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

// Close the mobile navbar when any navigation link is clicked
$(document).on('click', '#mainNav a, .navbar-brand', function () {
  const navbar = document.getElementById('mainNav');

  // Only close the menu on mobile/tablet when it is expanded
  if (window.innerWidth < 992 && navbar.classList.contains('show')) {
    bootstrap.Collapse.getOrCreateInstance(navbar, {
      toggle: false
    }).hide();
  }
});
