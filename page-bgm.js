(function () {
  const s = document.currentScript;
  if (!s) return;
  const src = s.getAttribute("data-src");
  if (!src) return;
  const a = new Audio(src);
  a.loop = true;
  a.preload = "auto";
  function tryPlay() {
    const p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }
  tryPlay();
  document.addEventListener("click", tryPlay, { once: true });
  document.addEventListener("keydown", tryPlay, { once: true });
})();
