// Contact form (Milestone 1: there is no backend yet, so nothing is sent).
// Bound to document because the router loads the form later ("event delegation").

$(document).on("submit", "#contactForm", function (e) {
  // Stops the browser from sending the form and reloading the page
  e.preventDefault();
  checkTrimmedFields(this); // from auth.js: a field of only spaces counts as empty

  // was-validated makes Bootstrap show the red/green styles and the errors
  $(this).addClass("was-validated");
  if (!this.checkValidity()) {
    return; // invalid: stop here, the errors are shown
  }

  // Demo (M1): in a later milestone the message goes to the backend.
  resetForm(this); // from auth.js: empties the form and removes the styles
  $("#contactSuccess").removeClass("d-none");
});
