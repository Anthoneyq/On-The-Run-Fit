/* On The Run Fit — Stripe Payment Links. Fill in a URL and every [data-checkout="key"] button uses it. Leave "" to keep the button's fallback href. */
window.OTRF_CHECKOUT = {
  fiveK: "https://buy.stripe.com/5kQ28q8abgvO7hK5fM0x200",         /* 12-Week 5K Programs — $39 */
  coached: "https://buy.stripe.com/3cI7sK0HJ7Zi6dG6jQ0x201",       /* Coached — $149/mo */
  raceReady: "https://buy.stripe.com/14A6oG4XZ2EY6dG7nU0x202",   /* Race Ready — $279/mo */
  allIn: "https://buy.stripe.com/7sY3cugGHenGgSkbEa0x203",           /* All-In 90-Day Goal Build — $897 */
  inPerson: "https://buy.stripe.com/dRmaEWcqr0wQ6dGeQm0x205",     /* In-Person Coaching — $547/mo */
  teams: "https://buy.stripe.com/5kQ14mfCDa7q1Xq8rY0x206"            /* Teams & Schools — $1,197/season */
};
(function(){
  var links = window.OTRF_CHECKOUT || {};
  document.querySelectorAll("[data-checkout]").forEach(function(a){
    var url = links[a.getAttribute("data-checkout")];
    if (url) { a.setAttribute("href", url); a.setAttribute("rel", "noopener"); }
  });
})();
