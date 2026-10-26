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

// Pages that only some roles may open. Pages not listed here are open to
// everyone. This only protects the pages in the browser: from M4 the backend
// also checks the role in the JWT token on every request.
const routeRoles = {
  "login": ["guest"],
  "register": ["guest"],
  "my-applications": ["user"],
  "profile": ["user", "vet", "admin"],
  "vet-dashboard": ["vet"],
  "admin-dashboard": ["admin"],
  "manage-pets": ["admin"],
  "manage-shelters": ["admin"],
  "manage-users": ["admin"],
  "manage-applications": ["admin"]
};

function canOpenRoute(route, role) {
  const allowedRoles = routeRoles[route];
  return allowedRoles === undefined || allowedRoles.includes(role);
}

// If the current role can't open this page, goes somewhere else instead:
// guests to the login page, logged-in users to the home page.
// replace() swaps the address without a new history entry, so the Back
// button doesn't lead to this page again. Returns true if it redirected.
function redirectIfNotAllowed(route) {
  const role = getRole(); // from roles.js
  if (canOpenRoute(route, role)) {
    return false;
  }
  if (role === "guest") {
    // "next" remembers the page (with its "?…" part), so logging in can go
    // back there (auth.js): #my-applications -> #login?next=my-applications.
    // encodeURIComponent keeps a "?" or "=" in it from being read as part of
    // the login page's own address.
    const page = window.location.hash.substring(1);
    window.location.replace("#login?next=" + encodeURIComponent(page));
  } else {
    window.location.replace("#home");
  }
  return true;
}

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

  // The new address causes a hashchange, which loads the right view
  if (redirectIfNotAllowed(route)) {
    return;
  }

  $("#app").load("views/" + route + ".html", function (response, status) {
    // The view's HTML is now in the page: show only its parts for this role
    showLinksFor(getRole()); // from roles.js

    // The footer starts hidden (index.html), so it doesn't flash in the middle
    // of the screen while <main> is still empty. Now there's a view above it.
    $("#siteFooter").removeClass("d-none");

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

// Leaving a page while a Bootstrap modal is open (e.g. with the browser's
// Back button): close it, otherwise its dark backdrop (added to <body>,
// outside the view) would stay over the next page. Works for every page.
$(window).on("hashchange", function () {
  $(".modal.show").each(function () {
    bootstrap.Modal.getInstance(this).hide();
  });
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
