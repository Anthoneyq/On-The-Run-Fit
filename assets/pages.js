(function () {
  "use strict";

  var menu = document.querySelector("[data-menu]");
  var nav = document.querySelector("[data-nav]");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  var params = new URLSearchParams(window.location.search);
  var plan = params.get("plan");
  if (plan) {
    var select = document.querySelector("[name='plan_interest']");
    if (select) {
      Array.prototype.some.call(select.options, function (option) {
        if (option.value === plan) {
          select.value = plan;
          return true;
        }
        return false;
      });
    }
  }

  var form = document.querySelector("[data-apply-form]");
  if (!form) return;

  var status = document.querySelector("[data-status]");
  var endpoint = window.OTRF_FORM_ENDPOINT || "/api/lead";

  function setStatus(message, bad) {
    if (!status) return;
    status.innerHTML = message;
    status.className = "status show" + (bad ? " bad" : "");
    status.focus && status.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (form._gotcha && form._gotcha.value) return;

    var firstInvalid = null;
    Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (field) {
      var bad = !field.value || (field.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value));
      field.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      setStatus("Finish the required fields and I can send this to Lindsey.", true);
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var button = form.querySelector("button[type='submit']");
    var original = button ? button.textContent : "";

    function fallback() {
      var subject = encodeURIComponent("Coaching application - " + (data.get("first_name") || "") + " " + (data.get("last_name") || ""));
      var body = encodeURIComponent(
        "Name: " + (data.get("first_name") || "") + " " + (data.get("last_name") || "") +
        "\nEmail: " + (data.get("email") || "") +
        "\nPlan: " + (data.get("plan_interest") || "") +
        "\nEvent: " + (data.get("event") || "") +
        "\n\nGoal: " + (data.get("goals") || "") +
        "\n\nOther: " + (data.get("extra") || "")
      );
      var href = "mailto:ontherunfit@gmail.com?subject=" + subject + "&body=" + body;
      setStatus("One last tap: <a href=\"" + href + "\" style=\"color:#9e2450;font-weight:800;text-decoration:underline\">send your application to Lindsey</a>. If your email app does not open, email ontherunfit@gmail.com directly.", false);
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
    }

    if (!endpoint) {
      fallback();
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    var payload = {};
    data.forEach(function (value, key) {
      payload[key] = value;
    });

    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Accept": "application/json", "Content-Type": "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Form endpoint failed");
        form.reset();
        setStatus("Got it. Lindsey will reply within a couple of days.", false);
      })
      .catch(fallback)
      .finally(function () {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      });
  });
})();
