// checking if on mobile by trying to match screen size
(function () {
  const isMobile =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  if (isMobile) return;

  // stop script entirely on mobile devices (made this because its too weird to drag on mobile)
  const desktopArea = document.querySelector(".desktop-area");
  if (!desktopArea) return;
  // get container of desktop
  const allWindows = Array.prototype.slice.call(
    desktopArea.querySelectorAll(".win7-window")
  );
  // convert these into array and filter ones in programming/writing html pages
  const windowElements = allWindows.filter(function (windowEl) {
    return (
      !windowEl.closest(".programming-detail") &&
      !windowEl.closest(".writing-detail")
    );
  });
  if (windowElements.length === 0) return;
// get highest z-index among the windows to make sure the dragged window appears above others, basically giving it a valiue and comparing it to others
  let highestZIndex = 10;
  windowElements.forEach(function (windowEl) {
    const zIndexText = getComputedStyle(windowEl).zIndex || "0";
    const zIndexValue = parseInt(zIndexText, 10);
    if (!isNaN(zIndexValue)) {
      highestZIndex = Math.max(highestZIndex, zIndexValue);
    }
  });
// increasing z-index, make window appear above others
  function bringWindowToFront(windowEl) {
    highestZIndex += 1;
    windowEl.style.zIndex = String(highestZIndex);
  }
// for pointer down on certain parts
  windowElements.forEach(function (windowEl) {
    const titleBar = windowEl.querySelector(".title-bar");
    if (!titleBar) return;

    const pickerCard = windowEl.classList.contains("win-picker");
    const dragHandle = pickerCard ? windowEl : titleBar;
// cursor stylistico!
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
// preventing dragging on certain stuff like title bar controls
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
// for pointer down on the window, bring it to front
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
