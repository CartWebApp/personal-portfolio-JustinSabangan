(function () {
  const MIN_DELAY = 30000;
  const MAX_DELAY = 90000;
  const DISPLAY_DURATION = 5000;

  const audio = new Audio("audio/music/sfx/notify.mp3");

  const notifications = [
    {
      img: "imgs/patrickguy.jpg",
      title: "New Message",
      text: "You're awesome sauce!"
    },
    {
      img: "imgs/gooderall.jpg",
      title: "New Message",
      text: "DR PEPPER DR PEPPER DR PEPPER DR PEPPER!!!111!1!!!11"
    },
    {
      img: "imgs/aigis.jpg",
      title: "New Message",
      text: "I'm goated with the sauce, as they say!"
    },
    {
      img: "imgs/hehe.jpg",
      title: "New Message",
      text: "life is sunshine and rainbows!"
    },
    {
      img: "imgs/speed.jpg",
      title: "New Message",
      text: "my mom is kinda homeless"
    },
    {
      img: "imgs/bleh.jpg",
      title: "New Message",
      text: "whats up buttercup?"
    },
    {
      img: "imgs/tyler.jpg",
      title: "New Message",
      text: "hey its me igor from the hit 2019 hit album, Igor!"
    },
    {
      img: "imgs/jane.png",
      title: "New Message",
      text: "lets larp, just this once"
    },
    {
      img: "imgs/natsuki.jpg",
      title: "New Message",
      text: "It's not like I like you or anything!"
    }
  ];

  let toast = null;
  let timeout = null;

  function createToast() {
    toast = document.createElement("div");
    toast.className = "win7-notification";
    toast.innerHTML =
      '<div class="win7-notification-icon">' +
        '<img width="40" height="40" alt="">' +
      "</div>" +
      '<div class="win7-notification-body">' +
        '<div class="win7-notification-title"></div>' +
        '<div class="win7-notification-text"></div>' +
      "</div>" +
      '<button type="button" class="win7-notification-close" aria-label="Close">&times;</button>';

    toast.querySelector(".win7-notification-close").addEventListener("click", function () {
      hideToast();
    });

    document.body.appendChild(toast);
  }

  function showToast() {
    if (!toast) createToast();

    const pick = notifications[Math.floor(Math.random() * notifications.length)];
    toast.querySelector(".win7-notification-icon img").src = pick.img;
    toast.querySelector(".win7-notification-title").textContent = pick.title;
    toast.querySelector(".win7-notification-text").textContent = pick.text;

    toast.classList.remove("hide");
    toast.classList.add("show");
    audio.currentTime = 0;
    audio.play().catch(function () {});

    clearTimeout(timeout);
    timeout = setTimeout(hideToast, DISPLAY_DURATION);
  }

  function hideToast() {
    if (!toast) return;
    toast.classList.remove("show");
    toast.classList.add("hide");
    scheduleNext();
  }

  function scheduleNext() {
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    setTimeout(showToast, delay);
  }

  scheduleNext();
})();
