(function () {
  const isMobile =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  if (isMobile) return;

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

    const pickerCard = windowEl.classList.contains("win-picker");
    const dragHandle = pickerCard ? windowEl : titleBar;

    dragHandle.style.setProperty(
      String.fromCharCode(99, 117, 114, 115, 111, 114),
      pickerCard ? "default" : "move"
    );
    if (pickerCard) {
      titleBar.style.setProperty(
        String.fromCharCode(99, 117, 114, 115, 111, 114),
        "move"
      );
    }

    function shouldStartDrag(event) {
      const t = event.target;
      if (!t || !t.closest) return false;
      if (t.closest(".title-bar-controls")) return false;
      if (pickerCard) {
        if (t.closest(".prog-picker-thumb, .writ-picker-thumb")) return false;
        if (t.closest("[data-open]")) return false;
        return true;
      }
      return titleBar.contains(t);
    }

    windowEl.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (event.target && event.target.closest(".title-bar-controls")) return;
      bringWindowToFront(windowEl);
    });

    dragHandle.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (!shouldStartDrag(event)) return;

      bringWindowToFront(windowEl);

      const windowRect = windowEl.getBoundingClientRect();
      const daRect = desktopArea.getBoundingClientRect();

      const pointerOffsetX = event.clientX - windowRect.left;
      const pointerOffsetY = event.clientY - windowRect.top;

      windowEl.style.position = "absolute";
      windowEl.style.margin = "0";
      windowEl.style.right = "auto";
      windowEl.style.bottom = "auto";
      windowEl.style.transform = "none";

      windowEl.style.left = String(windowRect.left - daRect.left) + "px";
      windowEl.style.top = String(windowRect.top - daRect.top) + "px";

      if (event.preventDefault) {
        event.preventDefault();
      }

      if (windowEl.setPointerCapture) {
        windowEl.setPointerCapture(event.pointerId);
      }

      function onPointerMove(moveEvent) {
        const areaRect = desktopArea.getBoundingClientRect();
        windowEl.style.left =
          String(moveEvent.clientX - areaRect.left - pointerOffsetX) + "px";
        windowEl.style.top =
          String(moveEvent.clientY - areaRect.top - pointerOffsetY) + "px";
      }

      function stopDragging(upEvent) {
        try {
          if (windowEl.releasePointerCapture) {
            windowEl.releasePointerCapture(upEvent.pointerId);
          }
        } catch (ignore) {}
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDragging);
        window.removeEventListener("pointercancel", stopDragging);
      }

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopDragging);
      window.addEventListener("pointercancel", stopDragging);
    });
  });
})();
