(function () {
  const desktopArea = document.querySelector(".desktop-area");
  if (!desktopArea) return;

  const allWindows = Array.prototype.slice.call(
    desktopArea.querySelectorAll(".win7-window")
  );
  const windowElements = allWindows.filter(function (windowEl) {
    return (
      !windowEl.closest(".programming-detail") &&
      !windowEl.closest(".writing-detail")
    );
  });
  if (windowElements.length === 0) return;

  let highestZIndex = 10;
  windowElements.forEach(function (windowEl) {
    const zIndexText = getComputedStyle(windowEl).zIndex || "0";
    const zIndexValue = parseInt(zIndexText, 10);
    if (!isNaN(zIndexValue)) {
      highestZIndex = Math.max(highestZIndex, zIndexValue);
    }
  });

  function bringWindowToFront(windowEl) {
    highestZIndex += 1;
    windowEl.style.zIndex = String(highestZIndex);
  }

  windowElements.forEach(function (windowEl) {
    const titleBar = windowEl.querySelector(".title-bar");
    if (!titleBar) return;

    titleBar.style.setProperty(
      String.fromCharCode(99, 117, 114, 115, 111, 114),
      "move"
    );

    titleBar.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (event.target && event.target.closest(".title-bar-controls")) return;

      bringWindowToFront(windowEl);

      const windowRect = windowEl.getBoundingClientRect();
      const parentElement = windowEl.offsetParent || desktopArea;
      const parentRect = parentElement.getBoundingClientRect();

      const pointerOffsetX = event.clientX - windowRect.left;
      const pointerOffsetY = event.clientY - windowRect.top;

      windowEl.style.right = "auto";
      windowEl.style.bottom = "auto";
      windowEl.style.transform = "none";

      windowEl.style.left = String(windowRect.left - parentRect.left) + "px";
      windowEl.style.top = String(windowRect.top - parentRect.top) + "px";

      if (titleBar.setPointerCapture) {
        titleBar.setPointerCapture(event.pointerId);
      }

      function onPointerMove(moveEvent) {
        windowEl.style.left =
          String(moveEvent.clientX - parentRect.left - pointerOffsetX) + "px";
        windowEl.style.top =
          String(moveEvent.clientY - parentRect.top - pointerOffsetY) + "px";
      }

      function stopDragging(upEvent) {
        if (titleBar.releasePointerCapture) {
          titleBar.releasePointerCapture(upEvent.pointerId);
        }
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDragging);
        window.removeEventListener("pointercancel", stopDragging);
      }

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopDragging);
      window.addEventListener("pointercancel", stopDragging);
    });

    windowEl.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      bringWindowToFront(windowEl);
    });
  });
})();
