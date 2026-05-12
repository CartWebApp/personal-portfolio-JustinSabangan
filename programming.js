(function () {
  const projectPicker = document.getElementById("project-picker");

  const detailByKey = {
    bioshield: document.getElementById("detail-bioshield"),
    zengarden: document.getElementById("detail-zengarden"),
    budgetcalc: document.getElementById("detail-budgetcalc")
  };

  function hideAllDetails() {
    const keys = Object.keys(detailByKey);
    for (let k = 0; k < keys.length; k++) {
      const panel = detailByKey[keys[k]];
      if (panel) {
        panel.hidden = true;
      }
    }
  }

  function openProject(projectKey) {
    const detailPanel = detailByKey[projectKey];
    if (!detailPanel || !projectPicker) return;

    hideAllDetails();

    document.body.classList.add("programming-detail-open");
    projectPicker.hidden = true;
    projectPicker.setAttribute("aria-hidden", "true");

    detailPanel.hidden = false;

    const scrollArea = detailPanel.querySelector(".programming-detail-scroll");
    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }

  function backToPicker() {
    document.body.classList.remove("programming-detail-open");
    if (projectPicker) {
      projectPicker.hidden = false;
      projectPicker.removeAttribute("aria-hidden");
    }
    hideAllDetails();
    window.scrollTo(0, 0);
  }

  const openButtons = document.querySelectorAll("[data-open]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function () {
      openProject(this.getAttribute("data-open"));
    });
  }

  const backButtons = document.querySelectorAll(".programming-back");
  for (let r = 0; r < backButtons.length; r++) {
    backButtons[r].addEventListener("click", backToPicker);
  }
})();
