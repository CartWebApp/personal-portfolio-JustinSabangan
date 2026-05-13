(function () {
  const ding = new Audio("audio/music/sfx/ding.mp3");
  ding.preload = "auto";
  const exclamation = new Audio("audio/music/sfx/exclamation.mp3");
  exclamation.preload = "auto";
  const informationBar = new Audio("audio/music/sfx/information-bar.mp3");
  informationBar.preload = "auto";
  const chimes = new Audio("audio/music/sfx/chimes.mp3");
  chimes.preload = "auto";

  document.addEventListener(
    "click",
    function (e) {
      const el = e.target;
      if (!el || el.nodeType !== 1) return;
      let hit = el.closest("button, [role='button']");
      if (!hit && el.tagName === "INPUT") {
        const t = el.type;
        if (t === "submit" || t === "button" || t === "reset") hit = el;
      }
      if (!hit) return;
      if (hit.id === "keyblade-hit") return;
      const isWinClose =
        hit.tagName === "BUTTON" &&
        hit.getAttribute("aria-label") === "Close" &&
        hit.closest(".title-bar-controls");
      const isDetailBack =
        hit.tagName === "BUTTON" &&
        (hit.classList.contains("programming-back") ||
          hit.classList.contains("writing-back"));
      const isProjectPicker =
        hit.tagName === "BUTTON" && hit.hasAttribute("data-open");
      const sfx = isWinClose
        ? exclamation
        : isDetailBack
        ? informationBar
        : isProjectPicker
        ? chimes
        : ding;
      try {
        sfx.currentTime = 0;
      } catch (err) {}
      const p = sfx.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {});
      }
    },
    true
  );
})();
