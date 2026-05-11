(function () {
  var desktopArea = document.querySelector(".desktop-area");
  if (!desktopArea) return;

  var windowElements = Array.prototype.slice.call(
    desktopArea.querySelectorAll(".win7-window")
  );
  if (windowElements.length === 0) return;

  var highestZIndex = 10;
  windowElements.forEach(function (windowEl) {
    var zIndexText = getComputedStyle(windowEl).zIndex || "0";
    var zIndexValue = parseInt(zIndexText, 10);
    if (!isNaN(zIndexValue)) {
      highestZIndex = Math.max(highestZIndex, zIndexValue);
    }
  });

  function bringWindowToFront(windowEl) {
    highestZIndex += 1;
    windowEl.style.zIndex = String(highestZIndex);
  }

  windowElements.forEach(function (windowEl) {
    var titleBar = windowEl.querySelector(".title-bar");
    if (!titleBar) return;

    titleBar.style.cursor = "move";

    titleBar.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (event.target && event.target.closest(".title-bar-controls")) return;

      bringWindowToFront(windowEl);

      var windowRect = windowEl.getBoundingClientRect();
      var parentElement = windowEl.offsetParent || desktopArea;
      var parentRect = parentElement.getBoundingClientRect();

      var pointerOffsetX = event.clientX - windowRect.left;
      var pointerOffsetY = event.clientY - windowRect.top;

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

