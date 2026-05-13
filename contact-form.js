(function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const TO = "justin09ayala@gmail.com";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    const subject = encodeURIComponent("Portfolio contact from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\n" + "Reply-to: " + email + "\n\n" + message
    );

    window.location.href =
      "mailto:" + TO + "?subject=" + subject + "&body=" + body;
  });
})();
