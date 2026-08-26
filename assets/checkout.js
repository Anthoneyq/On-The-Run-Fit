/* On The Run Fit — Stripe Payment Links. Fill in a URL and every [data-checkout="key"] button uses it. Leave "" to keep the button's fallback href. */
window.OTRF_CHECKOUT = {
  fiveK: "",         /* 12-Week 5K Programs — $39 */
  coached: "",       /* Coached — $149/mo */
  raceReady: "",   /* Race Ready — $279/mo */
  allIn: "",           /* All-In 90-Day Goal Build — $897 */
  inPerson: "",     /* In-Person Coaching — $547/mo */
  teams: ""            /* Teams & Schools — $1,197/season */
};
(function(){
  var links = window.OTRF_CHECKOUT || {};
  document.querySelectorAll("[data-checkout]").forEach(function(a){
    var url = links[a.getAttribute("data-checkout")];
    if (url) { a.setAttribute("href", url); a.setAttribute("rel", "noopener"); }
  });
})();
