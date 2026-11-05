/**
 * ROYAL H2O — Luxury Bottled Water & Customization Engine
 * Frontend Script & Interaction Controller
 */

(() => {
  'use strict';

  // --- Helper Selectors ---
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // --- Navigation & Sticky Header ---
  const nav = $('#topNav');
  const navToggle = $('.nav-toggle');
  const navLinks = $('#navLinks');
  const allNavAnchors = $$('.nav-link');

  function setNavExpanded(expanded) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', String(expanded));
    navLinks.classList.toggle('is-open', expanded);
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavExpanded(!isExpanded);
    });
  }

  // Close mobile navigation when any link inside nav is clicked
  $$('#navLinks a').forEach(anchor => {
    anchor.addEventListener('click', () => setNavExpanded(false));
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (!nav) return;
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      if (!nav.contains(e.target)) {
        setNavExpanded(false);
      }
    }
  });

  // Close nav on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavExpanded(false);
    }
  });

  // Sticky nav header scroll listener
  const onScrollNav = () => {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // Active section indicator using IntersectionObserver
  const trackedSections = $$('section[id]');
  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            allNavAnchors.forEach(a => {
              const href = a.getAttribute('href');
              if (href === `#${id}`) {
                a.classList.add('active');
              } else {
                a.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px -50% 0px' }
    );
    trackedSections.forEach(s => navObserver.observe(s));
  }

  // --- Smooth Anchor Scrolling with Reduced Motion Respect ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const targetEl = $(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  // --- Scroll-Triggered Reveal Animations ---
  const revealElements = $$('.reveal');

  function revealInViewElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh + 80 && rect.bottom >= -40) {
        el.classList.add('is-visible');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '120px 0px 120px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Immediate check and scroll listener for rapid navigation / anchor jumps
  revealInViewElements();
  window.addEventListener('scroll', revealInViewElements, { passive: true });

  // Fail-safe: ensure no content remains hidden after page initialization
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }, 450);

  // --- Toast Notification System ---
  const toastEl = $('#toast');
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // --- Dynamic Year in Footer ---
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // --- Back to Top Button ---
  const backToTopBtn = $('#backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // --- Product Collection Filter Tabs ---
  const collectionTabs = $$('.tab-btn');
  const productCards = $$('.product-card');

  collectionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      collectionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter') || 'all';

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('is-visible'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Interactive Bottle Customizer ---
  const customizerForm = $('#customizerForm');
  const virtualBottle = $('#virtualBottle');
  const labelSurface = $('#labelMockupSurface');
  const mockupMonogram = $('#mockupMonogram');
  const mockupText = $('#mockupText');
  const monogramInput = $('#monogramInput');
  const personalizationInput = $('#personalizationInput');
  const eventTypeSelect = $('#eventTypeSelect');
  const quantitySelect = $('#quantitySelect');
  const notesInput = $('#customizerNotes');
  const resetCustomizerBtn = $('#resetCustomizer');
  const orderWhatsAppBtn = $('#orderWhatsAppBtn');
  const copyCustomizerBtn = $('#copyCustomizerBtn');

  function updateCustomizerMockup() {
    // 1. Bottle Style
    const selectedStyleRadio = $('input[name="bottleStyle"]:checked', customizerForm);
    const bottleStyle = selectedStyleRadio ? selectedStyleRadio.value : 'glass-sleek';
    if (virtualBottle) {
      virtualBottle.className = 'virtual-bottle';
      if (bottleStyle === 'matte-obsidian') virtualBottle.classList.add('style-obsidian');
      if (bottleStyle === 'royal-carafe') virtualBottle.classList.add('style-carafe');
    }

    // 2. Label Finish & Color
    const selectedFinishRadio = $('input[name="labelFinish"]:checked', customizerForm);
    const finishTheme = selectedFinishRadio ? selectedFinishRadio.value : 'gold-obsidian';
    if (labelSurface) {
      labelSurface.className = 'label-mockup-surface';
      if (finishTheme === 'champagne-ivory') labelSurface.classList.add('theme-champagne');
      if (finishTheme === 'rose-gold') labelSurface.classList.add('theme-rosegold');
      if (finishTheme === 'silver-platinum') labelSurface.classList.add('theme-silver');
    }

    // 3. Monogram text
    const monogramVal = monogramInput ? monogramInput.value.trim().toUpperCase() : '';
    if (mockupMonogram) {
      mockupMonogram.textContent = monogramVal || 'RH';
    }

    // 4. Personalization text
    const personalVal = personalizationInput ? personalizationInput.value.trim() : '';
    if (mockupText) {
      mockupText.textContent = personalVal || 'ROYAL SIGNATURE BATCH';
    }
  }

  if (customizerForm) {
    customizerForm.addEventListener('input', updateCustomizerMockup);
    customizerForm.addEventListener('change', updateCustomizerMockup);
  }

  // Generate WhatsApp message from Customizer
  function generateCustomizerWhatsAppURL() {
    const selectedStyleRadio = $('input[name="bottleStyle"]:checked', customizerForm);
    const selectedFinishRadio = $('input[name="labelFinish"]:checked', customizerForm);
    const bottleStyle = selectedStyleRadio ? selectedStyleRadio.getAttribute('data-label') || selectedStyleRadio.value : 'Sleek Glass 500ml';
    const finish = selectedFinishRadio ? selectedFinishRadio.getAttribute('data-label') || selectedFinishRadio.value : 'Royal Gold Foil on Obsidian';
    const monogram = monogramInput?.value.trim() || 'RH';
    const personalization = personalizationInput?.value.trim() || 'Custom Edition';
    const eventType = eventTypeSelect?.value || 'Wedding / Reception';
    const quantity = quantitySelect?.value || '100 Bottles';
    const notes = notesInput?.value.trim() || 'None';

    const message =
      `👑 *ROYAL H2O — BESPOKE BOTTLE CUSTOMIZATION INQUIRY*

Hello Concierge, I would like to customize a royal batch with the following specifications:

• *Bottle Style:* ${bottleStyle}
• *Label & Foil Finish:* ${finish}
• *Monogram / Crest:* ${monogram}
• *Personalization:* ${personalization}
• *Occasion / Event:* ${eventType}
• *Estimated Quantity:* ${quantity}
• *Additional Notes:* ${notes}

Kindly confirm design proof preparation, availability, and delivery schedule. Thank you!`;

    return `https://wa.me/917666736148?text=${encodeURIComponent(message)}`;
  }

  if (orderWhatsAppBtn) {
    orderWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = generateCustomizerWhatsAppURL();
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp Concierge with your specifications...');
    });
  }

  if (copyCustomizerBtn) {
    copyCustomizerBtn.addEventListener('click', () => {
      const selectedStyleRadio = $('input[name="bottleStyle"]:checked', customizerForm);
      const selectedFinishRadio = $('input[name="labelFinish"]:checked', customizerForm);
      const bottleStyle = selectedStyleRadio ? selectedStyleRadio.getAttribute('data-label') || selectedStyleRadio.value : 'Sleek Glass 500ml';
      const finish = selectedFinishRadio ? selectedFinishRadio.getAttribute('data-label') || selectedFinishRadio.value : 'Royal Gold Foil on Obsidian';
      const monogram = monogramInput?.value.trim() || 'RH';
      const personalization = personalizationInput?.value.trim() || 'Custom Edition';
      const eventType = eventTypeSelect?.value || 'Wedding';
      const quantity = quantitySelect?.value || '100 Bottles';

      const summary = `Royal H2O Customization: Style: ${bottleStyle} | Finish: ${finish} | Monogram: ${monogram} | Text: ${personalization} | Event: ${eventType} | Qty: ${quantity}`;
      navigator.clipboard.writeText(summary)
        .then(() => showToast('Customization specifications copied to clipboard!'))
        .catch(() => showToast('Failed to copy to clipboard.'));
    });
  }

  if (resetCustomizerBtn) {
    resetCustomizerBtn.addEventListener('click', () => {
      if (customizerForm) customizerForm.reset();
      updateCustomizerMockup();
      showToast('Customizer reset to default specifications.');
    });
  }

  // --- Occasion Buttons Pre-Select Customizer ---
  $$('[data-preset-occasion]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const occasionName = btn.getAttribute('data-preset-occasion');
      if (eventTypeSelect && occasionName) {
        eventTypeSelect.value = occasionName;
      }
      if (personalizationInput && occasionName) {
        personalizationInput.value = `${occasionName} Celebration`;
      }
      updateCustomizerMockup();
    });
  });

  // --- Gallery Lightbox ---
  const lightboxModal = $('#lightboxModal');
  const lightboxImg = $('#lightboxImg');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('#lightboxClose');

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'Royal H2O Showcase';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  $$('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-hover-title')?.textContent || '';
      if (img) openLightbox(img.src, title);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // --- FAQ Accordion ---
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // --- Dynamic Reviews Engine (LocalStorage-Backed Demo) ---
  const reviewToggle = $('#reviewToggle');
  const reviewFormWrap = $('#reviewFormWrap');
  const reviewForm = $('#reviewForm');
  const reviewsList = $('#reviewsList');
  const reviewCountEl = $('#reviewCount');
  const scoreNumberEl = $('#scoreNumber');

  const STORAGE_KEY = 'royalH2oReviewsV2';
  const defaultReviews = [
    {
      name: 'Event Curator',
      rating: 5,
      text: 'The gold-foil crest bottles elevated our wedding banquet instantly. Guests kept taking photos with them. Outstanding craftsmanship and delivery.',
      dateStr: 'October 24, 2026'
    },
    {
      name: 'Corporate Hospitality Lead',
      rating: 5,
      text: 'Our executive summit demanded high-end branding. Royal H2O delivered on time with impeccable monogram packaging and crisp alkaline taste.',
      dateStr: 'October 16, 2026'
    },
    {
      name: 'Luxury Gifting Coordinator',
      rating: 5,
      text: 'The velvet box gifting packaging and bespoke foil labels made our VIP celebration truly memorable. Will certainly order for future occasions.',
      dateStr: 'September 28, 2026'
    }
  ];

  function loadReviews() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultReviews;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultReviews;
    } catch {
      return defaultReviews;
    }
  }

  function saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Storage unavailable in private mode
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderReviews(reviews) {
    if (!reviewsList) return;
    reviewsList.innerHTML = '';

    reviews.forEach(r => {
      const card = document.createElement('article');
      card.className = 'testimonial-card reveal is-visible';
      const rScore = Math.max(1, Math.min(5, Number(r.rating) || 5));
      const starsOn = '★'.repeat(rScore);
      const starsOff = '☆'.repeat(5 - rScore);

      card.innerHTML = `
        <div class="quote-icon">“</div>
        <div class="card-stars" aria-label="${rScore} out of 5 stars">${starsOn}${starsOff}</div>
        <p class="card-review-text">${escapeHtml(r.text)}</p>
        <div class="card-reviewer-meta">
          <span class="reviewer-name">— ${escapeHtml(r.name)}</span>
          <span class="review-date">${escapeHtml(r.dateStr || 'Verified Guest')}</span>
        </div>
      `;
      reviewsList.appendChild(card);
    });

    if (reviewCountEl) reviewCountEl.textContent = String(reviews.length);
    if (scoreNumberEl) {
      const total = reviews.reduce((acc, cur) => acc + (Number(cur.rating) || 5), 0);
      const avg = total / reviews.length;
      scoreNumberEl.textContent = avg.toFixed(2);
    }
  }

  let currentReviews = loadReviews();
  renderReviews(currentReviews);

  if (reviewToggle && reviewFormWrap) {
    reviewToggle.addEventListener('click', () => {
      const isHidden = reviewFormWrap.hasAttribute('hidden');
      if (isHidden) {
        reviewFormWrap.removeAttribute('hidden');
        reviewToggle.textContent = 'Close Review Form';
      } else {
        reviewFormWrap.setAttribute('hidden', '');
        reviewToggle.textContent = 'Write a Review';
      }
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(reviewForm);
      const name = String(fd.get('name') || '').trim();
      const rating = Number(fd.get('rating') || 5);
      const text = String(fd.get('review') || '').trim();
      const noteEl = $('#reviewFormNote');

      if (!name || name.length < 2) {
        if (noteEl) noteEl.textContent = 'Please enter your name (at least 2 characters).';
        return;
      }
      if (!text || text.length < 10) {
        if (noteEl) noteEl.textContent = 'Review text must be at least 10 characters.';
        return;
      }

      const newReview = {
        name,
        rating,
        text,
        dateStr: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };

      currentReviews = [newReview, ...currentReviews];
      saveReviews(currentReviews);
      renderReviews(currentReviews);

      reviewForm.reset();
      if (reviewFormWrap) reviewFormWrap.setAttribute('hidden', '');
      if (reviewToggle) reviewToggle.textContent = 'Write a Review';
      if (noteEl) noteEl.textContent = '';
      showToast('Thank you! Your review has been saved in your local browser.');
    });
  }

  // --- Contact & Concierge Form Validation and WhatsApp Submission ---
  const contactForm = $('#contactForm');
  const contactFormNote = $('#contactFormNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (contactFormNote) {
        contactFormNote.className = 'form-note';
        contactFormNote.textContent = '';
      }

      const fd = new FormData(contactForm);
      const name = String(fd.get('fullName') || '').trim();
      const phone = String(fd.get('phone') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const occasion = String(fd.get('occasion') || '').trim();
      const quantity = String(fd.get('quantity') || '').trim();
      const eventDate = String(fd.get('eventDate') || '').trim();
      const customization = String(fd.get('customization') || '').trim();
      const message = String(fd.get('message') || '').trim();

      // Basic Phone validation: 10 digits
      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length < 10) {
        if (contactFormNote) {
          contactFormNote.className = 'form-note error';
          contactFormNote.textContent = 'Please enter a valid 10-digit mobile number for WhatsApp coordination.';
        }
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        if (contactFormNote) {
          contactFormNote.className = 'form-note error';
          contactFormNote.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      // Format WhatsApp order payload
      const waText =
        `👑 *ROYAL H2O — CONCIERGE ORDER INQUIRY*

Hello Royal H2O team, I would like to place an inquiry:

• *Client Name:* ${name}
• *Mobile:* ${phone}
• *Email:* ${email || 'Not provided'}
• *Occasion:* ${occasion}
• *Quantity:* ${quantity}
• *Target Event Date:* ${eventDate || 'To be confirmed'}
• *Customization Style:* ${customization || 'Gold Foil Label'}
• *Special Requirements:* ${message || 'None'}

Please share design proofs and confirmed timeline. Thank you!`;

      const targetUrl = `https://wa.me/917666736148?text=${encodeURIComponent(waText)}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');

      if (contactFormNote) {
        contactFormNote.className = 'form-note success';
        contactFormNote.textContent = 'Connecting you directly to WhatsApp Concierge with your pre-filled inquiry...';
      }
      showToast('Opening WhatsApp Concierge with your inquiry details!');
      contactForm.reset();
    });
  }

  // --- Initial Mockup Render on Load ---
  updateCustomizerMockup();
})();
