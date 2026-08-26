/* On The Run Fit — dismissible success modal. window.OTRF_showModal(title, sub) */
(function () {
  "use strict";
  var css = "" +
    ".otrf-modal{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(42,35,32,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}" +
    ".otrf-modal.show{display:flex}" +
    ".otrf-modal-card{position:relative;background:var(--panel,#fffdf9);color:var(--ink,#2a2320);border-radius:18px;padding:44px 36px 32px;max-width:460px;width:100%;text-align:center;box-shadow:0 30px 70px -20px rgba(42,35,32,.5);animation:otrfPop .35s cubic-bezier(.2,.8,.2,1)}" +
    "@keyframes otrfPop{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}" +
    "@media (prefers-reduced-motion:reduce){.otrf-modal-card{animation:none}}" +
    ".otrf-modal-x{position:absolute;top:12px;right:12px;width:38px;height:38px;border:0;border-radius:50%;background:transparent;color:var(--ink-muted,rgba(42,35,32,.58));font-size:26px;line-height:1;cursor:pointer}" +
    ".otrf-modal-x:hover,.otrf-modal-x:focus-visible{background:var(--cream-2,#f6eee3);color:var(--ink,#2a2320);outline:none}" +
    ".otrf-modal-mark{width:56px;height:56px;margin:0 auto 14px;border-radius:50%;background:var(--rose-btn,#c42a5e);color:#fff;display:flex;align-items:center;justify-content:center}" +
    ".otrf-modal-card h2{font-family:var(--serif,'Cormorant Garamond',Georgia,serif);font-weight:600;font-size:clamp(1.7rem,4vw,2.2rem);line-height:1.15;margin:0 0 10px}" +
    ".otrf-modal-card p{font-family:var(--sans,Inter,system-ui,sans-serif);margin:0 0 22px;color:var(--ink-soft,rgba(42,35,32,.72));line-height:1.6}" +
    ".otrf-modal-btn{font-family:var(--sans,Inter,system-ui,sans-serif);font-weight:600;font-size:.98rem;padding:12px 28px;border:0;border-radius:999px;background:var(--rose-btn,#c42a5e);color:#fff;cursor:pointer}" +
    ".otrf-modal-btn:hover{filter:brightness(1.06)}.otrf-modal-btn:focus-visible{outline:3px solid rgba(196,42,94,.35);outline-offset:2px}";
  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  var modal, lastFocus;
  function build() {
    modal = document.createElement("div");
    modal.className = "otrf-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "otrfModalTitle");
    modal.innerHTML =
      '<div class="otrf-modal-card">' +
        '<button type="button" class="otrf-modal-x" aria-label="Close">&times;</button>' +
        '<div class="otrf-modal-mark" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h2 id="otrfModalTitle"></h2><p id="otrfModalSub"></p>' +
        '<button type="button" class="otrf-modal-btn" data-close>Close</button>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".otrf-modal-x") || e.target.closest("[data-close]")) hide();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("show")) hide(); });
  }
  function hide() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.OTRF_showModal = function (title, sub) {
    if (!modal) build();
    lastFocus = document.activeElement;
    document.getElementById("otrfModalTitle").textContent = title || "Got it! Lindsey will be in touch soon!";
    document.getElementById("otrfModalSub").textContent = sub || "";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.querySelector(".otrf-modal-btn").focus();
  };
})();
