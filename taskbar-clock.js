(function () {
  const timeEl = document.querySelector(".taskbar-clock-time");
  const dateEl = document.querySelector(".taskbar-clock-date");
  const timeRoot = document.getElementById("taskbar-time");
  function tick() {
    const d = new Date();
    if (timeEl) {
      timeEl.textContent = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
    }
    if (dateEl) {
      dateEl.textContent = d.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
    }
    if (timeRoot) {
      timeRoot.dateTime = d.toISOString();
    }
  }
  tick();
  setInterval(tick, 1000);
})();
