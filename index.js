(function () {
  const startup = document.getElementById("index-startup");
  const skip = document.querySelector(".index-skip-intro");
  const logonBtn = document.getElementById("index-logon-btn");
  const password = document.getElementById("index-password");
  const panel = document.getElementById("index-login-panel");

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const introMs = reducedMotion ? 0 : 2800;

  const startupSfx = new Audio("audio/music/sfx/windows-7-startup.mp3");
  startupSfx.preload = "auto";

  const loginBgm = new Audio("audio/music/Logging In 4.mp3");
  loginBgm.loop = true;
  loginBgm.volume = 0.45;
  loginBgm.preload = "auto";

  const logonSfx = new Audio("audio/music/sfx/logon.mp3");
  logonSfx.preload = "auto";

  function playStartupSfx() {
    if (reducedMotion) return;
    try {
      startupSfx.currentTime = 0;
    } catch (e) {}
    const p = startupSfx.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }

  function stopStartupSfx() {
    try {
      startupSfx.pause();
      startupSfx.currentTime = 0;
    } catch (e) {}
  }

  function playLoginBgm() {
    if (reducedMotion) return;
    const p = loginBgm.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }

  function stopLoginBgm() {
    try {
      loginBgm.pause();
      loginBgm.currentTime = 0;
    } catch (e) {}
  }

  function playLogonSfx() {
    if (reducedMotion) return;
    try {
      logonSfx.currentTime = 0;
    } catch (e) {}
    const p = logonSfx.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }

  playStartupSfx();

  function showLogin() {
    document.body.classList.add("index-login--ready");
    if (startup) {
      startup.classList.add("index-startup--hidden");
    }
    if (!reducedMotion) {
      playLoginBgm();
      document.addEventListener("click", playLoginBgm, { once: true });
      document.addEventListener("keydown", playLoginBgm, { once: true });
    }
  }
  function goHome() {
    stopStartupSfx();
    stopLoginBgm();
    playLogonSfx();
    document.body.classList.add("index-login--leaving");
    window.setTimeout(function () {
      window.location.href = "home.html";
    }, reducedMotion ? 200 : 500);
  }

  window.setTimeout(showLogin, introMs);

  if (skip) {
    skip.addEventListener("click", function (e) {
      e.preventDefault();
      stopStartupSfx();
      showLogin();
      if (panel && panel.focus) {
        panel.focus();
      }
    });
  }
  if (logonBtn) {
    logonBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goHome();
    });
  }

  if (password) {
    password.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        goHome();
      }
    });
  }
})();
