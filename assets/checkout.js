/* On The Run Fit — Stripe Payment Links. Fill in a URL and every [data-checkout="key"] button uses it. Leave "" to keep the button's fallback href. */
window.OTRF_CHECKOUT = {
  fiveK: "https://buy.stripe.com/aFabJ1baWc7mbuw0xL8N200",         /* 12-Week 5K Programs — $39 */
  coached: "https://buy.stripe.com/6oUdR91Amc7m1TWgwJ8N201",       /* Coached — $149/mo */
  raceReady: "https://buy.stripe.com/fZu5kDen87R6eGI2FT8N202",   /* Race Ready — $279/mo */
  allIn: "https://buy.stripe.com/fZu14n3IugnC7eg1BP8N203",           /* All-In 90-Day Goal Build — $897 */
  inPerson: "https://buy.stripe.com/00w7sLdj43AQ6ac2FT8N205",     /* In-Person Coaching — $547/mo */
  teams: "https://buy.stripe.com/aFa6oH3Iu7R6424eoB8N206"            /* Teams & Schools — $1,197/season */
};
(function(){
  var links = window.OTRF_CHECKOUT || {};
  document.querySelectorAll("[data-checkout]").forEach(function(a){
    var url = links[a.getAttribute("data-checkout")];
    if (url) { a.setAttribute("href", url); a.setAttribute("rel", "noopener"); }
  });
})();
