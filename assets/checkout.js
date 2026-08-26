/* On The Run Fit — Stripe Payment Links. Fill in a URL and every [data-checkout="key"] button uses it. Leave "" to keep the button's fallback href. */
window.OTRF_CHECKOUT = {
  fiveK: "https://buy.stripe.com/aFabJ1baWc7mbuw0xL8N200",         /* 12-Week 5K Programs — $39 */
  coached: "",                                                    /* Online Coaching — $120/mo (+ optional $50/mo Strength add-on at checkout) — filled by scripts/reprice-2026-08-26.py */
  inPerson: "",                                                   /* In-Person Coaching — $450/mo (+ optional Strength add-on) — filled by scripts/reprice-2026-08-26.py */
  teams: "https://buy.stripe.com/aFa6oH3Iu7R6424eoB8N206"            /* Teams & Schools — $1,197/season */
};
(function(){
  var links = window.OTRF_CHECKOUT || {};
  document.querySelectorAll("[data-checkout]").forEach(function(a){
    var url = links[a.getAttribute("data-checkout")];
    if (url) { a.setAttribute("href", url); a.setAttribute("rel", "noopener"); }
  });
})();
