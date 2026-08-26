/* On The Run Fit — Stripe Payment Links. Fill in a URL and every [data-checkout="key"] button uses it. Leave "" to keep the button's fallback href. */
window.OTRF_CHECKOUT = {
  fiveK: "https://buy.stripe.com/5kQ28q8abgvO7hK5fM0x200"          /* 12-Week 5K Programs — $39 */
};
(function(){
  var links = window.OTRF_CHECKOUT || {};
  document.querySelectorAll("[data-checkout]").forEach(function(a){
    var url = links[a.getAttribute("data-checkout")];
    if (url) { a.setAttribute("href", url); a.setAttribute("rel", "noopener"); }
  });
})();
