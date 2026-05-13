(function () {
  if (document.documentElement.getAttribute("data-page") !== "programming") {
    return;
  }

  const btn = document.getElementById("keyblade-hit");
  if (!btn) return;

  const img = btn.querySelector("img");
  const audio = new Audio("audio/music/sfx/kh-level-up.mp3");
  audio.preload = "auto";

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BOTTOM_SLACK_PX = 56;
  let boundScrollEl = null;

  function visibleDetailScroll() {
    const detail = document.querySelector(".programming-detail:not([hidden])");
    return detail ? detail.querySelector(".programming-detail-scroll") : null;
  }

  function showKeyblade() {
    btn.classList.add("keyblade-hit--revealed");
  }

  function hideKeyblade() {
    btn.classList.remove("keyblade-hit--revealed");
  }

  function detachScroll() {
    if (boundScrollEl) {
      boundScrollEl.removeEventListener("scroll", onScrollEl);
      boundScrollEl = null;
    }
  }

  function onScrollEl() {
    syncKeybladeFromScroll();
  }

  function syncKeybladeFromScroll() {
    if (!document.body.classList.contains("programming-detail-open")) {
      hideKeyblade();
      return;
    }
    const el = visibleDetailScroll();
    if (!el) {
      hideKeyblade();
      return;
    }
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= BOTTOM_SLACK_PX) {
      showKeyblade();
    } else {
      hideKeyblade();
    }
  }

  function bindVisibleScroll() {
    const el = visibleDetailScroll();
    if (!document.body.classList.contains("programming-detail-open") || !el) {
      detachScroll();
      hideKeyblade();
      return;
    }
    if (boundScrollEl !== el) {
      detachScroll();
      boundScrollEl = el;
      boundScrollEl.addEventListener("scroll", onScrollEl, { passive: true });
    }
    syncKeybladeFromScroll();
  }

  function onDomMutations() {
    requestAnimationFrame(function () {
      bindVisibleScroll();
    });
  }

  const bodyMo = new MutationObserver(onDomMutations);
  bodyMo.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  const detailNodes = document.querySelectorAll(".programming-detail");
  for (let i = 0; i < detailNodes.length; i++) {
    bodyMo.observe(detailNodes[i], {
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }

  window.addEventListener("resize", syncKeybladeFromScroll, { passive: true });

  bindVisibleScroll();

  function spawnSparkles() {
    if (reducedMotion) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "keyblade-sparkle";
      el.setAttribute("aria-hidden", "true");
      const base = (Math.PI * 2 * i) / count;
      const angle = base + (Math.random() - 0.5) * 0.35;
      const dist = 24 + Math.random() * 52;
      el.style.setProperty("--kb-dx", String(Math.cos(angle) * dist) + "px");
      el.style.setProperty("--kb-dy", String(Math.sin(angle) * dist) + "px");
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      document.body.appendChild(el);
      requestAnimationFrame(function () {
        el.classList.add("keyblade-sparkle--burst");
      });
      window.setTimeout(function () {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 700);
    }
  }

  btn.addEventListener("click", function () {
    if (!btn.classList.contains("keyblade-hit--revealed")) {
      return;
    }

    if (!reducedMotion) {
      btn.classList.remove("keyblade-spin");
      if (img) {
        img.removeEventListener("animationend", onSpinEnd);
      }
      void btn.offsetWidth;
      btn.classList.add("keyblade-spin");
      if (img) {
        img.addEventListener("animationend", onSpinEnd, { once: true });
      } else {
        window.setTimeout(function () {
          btn.classList.remove("keyblade-spin");
        }, 750);
      }
    }

    spawnSparkles();

    try {
      audio.currentTime = 0;
    } catch (ignore) {}
    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  });

  function onSpinEnd() {
    btn.classList.remove("keyblade-spin");
  }
})();
