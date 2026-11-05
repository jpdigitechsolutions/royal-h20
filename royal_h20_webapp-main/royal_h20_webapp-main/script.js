(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const nav = $("#topNav");
  const navToggle = $(".nav-toggle");
  const navLinks = $("#navLinks");

  // Mobile nav toggle
  function setNavExpanded(expanded) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", String(expanded));
    navLinks.classList.toggle("is-open", expanded);
  }

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setNavExpanded(!expanded);
  });

  // Close nav after selecting a section (mobile)
  $$(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => setNavExpanded(false));
  });

  // Scroll polish: nav background becomes more opaque
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth anchor scroll (keeps native in most browsers, but respects reduced motion)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetSel = anchor.getAttribute("href");
      if (!targetSel || targetSel === "#" || targetSel.length < 2) return;

      const target = document.querySelector(targetSel);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  // Reveal-on-scroll
  const revealEls = $$(".reveal");
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  function observeNew(el) {
    if (!el) return;
    if (io) io.observe(el);
    else el.classList.add("is-visible");
  }

  // Time + year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const timeEl = $("#currentTime");
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function updateTime() {
    if (!timeEl) return;
    const d = new Date();
    timeEl.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Toast
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function trackEvent(name, params) {
    try {
      const tracker = window.royalFbAnalytics;
      if (tracker && typeof tracker.logEvent === "function") {
        tracker.logEvent(name, params);
      }
    } catch {
      // no-op
    }
  }

  // (Template cleanup)

  // Decorative: animate meter on first reveal
  const qualityBar = $("#qualityBar");
  const qualityVal = $("#qualityVal");
  if (qualityBar && qualityVal) {
    const target = 98;
    qualityVal.textContent = String(target);
    // Trigger after load so width animation has a starting point
    window.requestAnimationFrame(() => {
      qualityBar.style.width = `${target}%`;
    });
  }

  // Reviews: toggle, render, and localStorage persistence
  const reviewToggle = $("#reviewToggle");
  const reviewFormWrap = $("#reviewFormWrap");
  const reviewForm = $("#reviewForm");
  const reviewsList = $("#reviewsList");
  const reviewCountEl = $("#reviewCount");
  const scoreNumberEl = $("#scoreNumber");

  const STORAGE_KEY = "royalH2oReviewsV1";
  const defaultReviews = [
    {
      name: "EVENT PLANNER",
      rating: 5,
      text: "The gold-foil bottles elevated our event instantly. The labels look like a premium crest—everyone asked where we sourced them.",
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
      name: "HOSPITALITY LEAD",
      rating: 5,
      text: "Excellent quality and packaging. The custom monograms made guests feel truly special. Royal finish from start to delivery.",
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      name: "BRAND MANAGER",
      rating: 5,
      text: "Our corporate gifting looked premium and was perfectly on time. The alkaline base felt premium too—great aftertaste.",
      dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ];

  function loadReviews() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultReviews;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return defaultReviews;
      return parsed;
    } catch {
      return defaultReviews;
    }
  }

  function saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Ignore storage failures (private mode etc.)
    }
  }

  function starsText(rating) {
    const r = Math.max(1, Math.min(5, Number(rating) || 0));
    const on = "★".repeat(r);
    const off = "☆".repeat(5 - r);
    return `${on}${off}`;
  }

  function formatReviewer(name) {
    return `— ${String(name || "").trim() || "GUEST"}`;
  }

  function computeAverage(reviews) {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return sum / reviews.length;
  }

  function renderReviews(reviews) {
    if (!reviewsList) return;
    reviewsList.innerHTML = "";

    reviews.forEach((r) => {
      const card = document.createElement("article");
      card.className = "testimonial-card glass-morph reveal";
      card.setAttribute("data-review-card", "true");
      card.setAttribute("role", "article");

      const stars = starsText(r.rating);
      const safeText = String(r.text || "").trim();
      const safeName = String(r.name || "").trim();

      card.innerHTML = `
        <div class="quote-mark">"</div>
        <div class="review-stars" aria-hidden="true">${stars}</div>
        <p class="review-text">${escapeHtml(safeText)}</p>
        <div class="reviewer">${escapeHtml(formatReviewer(safeName))}</div>
      `;

      reviewsList.appendChild(card);
      observeNew(card);
    });

    if (reviewCountEl) reviewCountEl.textContent = String(reviews.length);
    if (scoreNumberEl) {
      const avg = computeAverage(reviews);
      const display = avg ? `${avg.toFixed(2)} / 5.0` : "0 / 5.0";
      scoreNumberEl.textContent = display;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  let reviews = loadReviews();
  renderReviews(reviews);

  // Analytics: track Instagram/WhatsApp clicks
  $$(".wa-link").forEach((a) => {
    a.addEventListener("click", () => {
      trackEvent("whatsapp_click", { href: a.getAttribute("href") || "" });
    });
  });
  $$(".insta-link").forEach((a) => {
    a.addEventListener("click", () => {
      trackEvent("instagram_click", { href: a.getAttribute("href") || "" });
    });
  });

  function toggleReviewForm(show) {
    if (!reviewFormWrap) return;
    const isShown =
      !reviewFormWrap.hasAttribute("hidden") && show === undefined;
    const next = show === undefined ? !isShown : Boolean(show);
    if (next) reviewFormWrap.removeAttribute("hidden");
    else reviewFormWrap.setAttribute("hidden", "hidden");
  }

  if (reviewToggle) {
    reviewToggle.addEventListener("click", () => toggleReviewForm());
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(reviewForm);
      const name = String(data.get("name") || "").trim();
      const rating = Number(data.get("rating") || 0);
      const review = String(data.get("review") || "").trim();

      const noteEl = $("#reviewFormNote");
      if (noteEl) noteEl.textContent = "";

      if (!name || name.length < 2) {
        if (noteEl) noteEl.textContent = "Please enter your name.";
        showToast("Please check your name.");
        return;
      }
      if (rating < 1 || rating > 5) {
        if (noteEl) noteEl.textContent = "Choose a rating from 1 to 5.";
        showToast("Choose a rating.");
        return;
      }
      if (!review || review.length < 10) {
        if (noteEl)
          noteEl.textContent = "Review should be at least 10 characters.";
        showToast("Your review is too short.");
        return;
      }

      const nextReview = {
        name,
        rating,
        text: review,
        dateISO: new Date().toISOString(),
      };

      reviews = [nextReview, ...reviews];
      saveReviews(reviews);
      renderReviews(reviews);

      toggleReviewForm(false);
      reviewForm.reset();
      showToast("Thanks for your review!");
      trackEvent("review_added", { rating, name });
    });
  }
})();
