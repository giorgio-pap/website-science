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

  function syncThemePressed() {
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", root.getAttribute("data-theme") === "dark" ? "true" : "false");
  }
  syncThemePressed();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      syncThemePressed();
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

  /* ---------- Analytics consent ---------- */
  var CONSENT_KEY = "analytics-consent";
  var GA_ID = "G-89HEVGDWX1";
  var consentEl = document.getElementById("consent");
  var acceptBtn = document.getElementById("consent-accept");
  var declineBtn = document.getElementById("consent-decline");
  var resetBtn = document.getElementById("consent-reset");

  function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function writeConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);
  }

  function hideConsent() {
    if (consentEl) consentEl.hidden = true;
  }

  function showConsent() {
    if (consentEl) consentEl.hidden = false;
  }

  var consent = readConsent();
  if (consent === "granted") loadAnalytics();
  else if (consent !== "denied") showConsent();

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      writeConsent("granted");
      hideConsent();
      loadAnalytics();
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      writeConsent("denied");
      hideConsent();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
      showConsent();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
