// Giorgio Papitto — site interactions (no dependencies)
(function () {
  "use strict";

  /* ---------- Theme (persisted, respects OS preference) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Active section highlighting ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = {};
  document.querySelectorAll('.nav__menu a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute("href").slice(1)] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(navLinks).forEach(function (id) { navLinks[id].classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Listening (ListenBrainz) ---------- */
  var listening = document.getElementById("listening");
  var listeningLabel = document.getElementById("listening-label");
  var listeningTrack = document.getElementById("listening-track");
  var lbApi = "https://api.listenbrainz.org/1/user/gio_pap/";

  function firstListen(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function (data) {
      var listens = data && data.payload && data.payload.listens;
      return listens && listens.length ? listens[0].track_metadata : null;
    });
  }

  function showTrack(track, label) {
    if (!track || !track.track_name || !track.artist_name) return;
    listeningLabel.textContent = label;
    listeningTrack.textContent = track.track_name + " — " + track.artist_name;
    listening.hidden = false;
  }

  if (listening && window.fetch) {
    firstListen(lbApi + "playing-now").then(function (track) {
      if (track) return showTrack(track, "Listening now");
      return firstListen(lbApi + "listens?count=1").then(function (last) {
        showTrack(last, "Last played");
      });
    }).catch(function () {});
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
