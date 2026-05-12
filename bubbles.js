(function () {
  if (!document.body || !document.body.classList.contains("desktop")) {
    return;
  }

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return;
  }

  const MAX_BUBBLES = 32;
  const SPAWN_MIN_MS = 450;
  const SPAWN_MAX_MS = 1300;

  const field = document.createElement("div");
  field.id = "bubble-field";
  field.setAttribute("aria-hidden", "true");
  document.body.appendChild(field);

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnBubble() {
    const n = field.querySelectorAll(".bubble:not(.bubble--popping)").length;
    if (n >= MAX_BUBBLES) return;

    const el = document.createElement("div");
    el.className = "bubble";
    el.setAttribute("role", "presentation");

    const inner = document.createElement("span");
    inner.className = "bubble-inner";
    inner.setAttribute("aria-hidden", "true");
    el.appendChild(inner);

    const size = Math.round(rand(28, 56));
    const leftPct = rand(8, 92);
    const dur = rand(9, 16);
    const drift = rand(-40, 40);

    el.style.setProperty("--bubble-size", size + "px");
    el.style.setProperty("--bubble-left", leftPct + "%");
    el.style.setProperty("--bubble-dur", dur + "s");
    el.style.setProperty("--bubble-drift", drift + "px");

    function removeEl() {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }

    el.addEventListener(
      "animationend",
      function (ev) {
        if (ev.target !== el) return;
        if (ev.animationName === "bubbleFloat") {
          removeEl();
        }
      },
      false
    );

    inner.addEventListener(
      "animationend",
      function (ev) {
        if (ev.animationName === "bubblePop") {
          removeEl();
        }
      },
      { once: true }
    );

    el.addEventListener(
      "click",
      function (ev) {
        ev.preventDefault();
        if (el.classList.contains("bubble--popping")) return;
        el.classList.add("bubble--popping");
      },
      false
    );

    field.appendChild(el);
  }

  function scheduleNext() {
    window.setTimeout(function () {
      spawnBubble();
      scheduleNext();
    }, rand(SPAWN_MIN_MS, SPAWN_MAX_MS));
  }

  spawnBubble();
  spawnBubble();
  spawnBubble();
  spawnBubble();
  scheduleNext();
})();
