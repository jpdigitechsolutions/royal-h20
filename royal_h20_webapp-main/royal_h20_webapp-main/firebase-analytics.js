/**
 * ============================================================================
 * GOOGLE FIREBASE ANALYTICS & GOOGLE ANALYTICS 4 (GA4) INTEGRATION
 * Project: Royal H2O (Custom Water Bottles & Gold Foil Labels)
 * ============================================================================
 * 
 * 📌 कशा प्रकारे FIREBASE ANALYTICS चालू करावे (HOW TO ACTIVATE):
 * 1. Visit https://console.firebase.google.com/
 * 2. Select or create your Firebase Project.
 * 3. Make sure Google Analytics is enabled.
 * 4. Add a Web App (</>) named "Royal H2O".
 * 5. Replace the placeholder values in `firebaseConfig` below with your keys.
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// ⚙️ FIREBASE CONFIGURATION (REPLACE WITH YOUR PROJECT DETAILS):
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXXXXXXX" // Google Analytics 4 Measurement ID
};

const APP_NAME = "Royal H2O";

// Check if actual configuration has been provided
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("REPLACE_") &&
  !firebaseConfig.apiKey.includes("YOUR_")
);

let analytics = null;
let firebaseApp = null;

/**
 * Initialize Firebase & Google Analytics 4 safely
 */
async function initFirebase() {
  if (!isConfigured) {
    console.info(
      `%c[Firebase Analytics - ${APP_NAME}]%c\nℹ️ Ready for setup! Add your Firebase keys in 'firebase-analytics.js' to track live customer orders and inquiries.`,
      "color: #d97706; font-weight: bold; font-size: 11px;",
      "color: #94a3b8; font-size: 11px;"
    );
    return;
  }

  try {
    const supported = await isSupported();
    if (supported) {
      firebaseApp = initializeApp(firebaseConfig);
      analytics = getAnalytics(firebaseApp);
      
      // Initial page view event
      logEvent(analytics, "page_view", {
        app_name: APP_NAME,
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });

      console.info(
        `%c[Firebase Analytics - Active]%c Connected to Google Analytics GA4 (${firebaseConfig.measurementId || 'Active'})`,
        "color: #10b981; font-weight: bold;",
        "color: #64748b;"
      );
    }
  } catch (error) {
    console.error(`[Firebase Analytics Init Error]:`, error);
  }
}

/**
 * Universal Event Tracker
 * @param {string} eventName - e.g., 'whatsapp_click', 'instagram_click', 'review_submit'
 * @param {object} params - Additional event data
 */
export function trackEvent(eventName, params = {}) {
  try {
    const enriched = {
      app_name: APP_NAME,
      timestamp: new Date().toISOString(),
      ...params
    };

    if (analytics) {
      logEvent(analytics, eventName, enriched);
    } else {
      // In development / demo mode:
      // console.debug(`[Analytics Event Tracked]: ${eventName}`, enriched);
    }
  } catch (err) {
    console.warn(`[Analytics Logging Error] for '${eventName}':`, err);
  }
}

// Global references for existing scripts & backward compatibility
window.trackEvent = trackEvent;
window.royalFbAnalytics = {
  logEvent: (name, params) => trackEvent(name, params),
  getAnalytics: () => analytics,
  getApp: () => firebaseApp,
  isReady: () => Boolean(analytics)
};

// Initialize
initFirebase();

/**
 * Automatic Event Tracking for interactive elements
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. WhatsApp Clicks
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], .wa-link').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("whatsapp_click", {
        href: el.getAttribute("href") || "",
        placement: el.closest("header, section, footer, div")?.id || "page"
      });
    });
  });

  // 2. Direct Phone Call Clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("phone_call_click", {
        phone_number: el.getAttribute("href").replace("tel:", ""),
        placement: el.closest("header, section, footer, div")?.id || "page"
      });
    });
  });

  // 3. Instagram Profile Clicks
  document.querySelectorAll('a[href*="instagram.com"], .insta-link').forEach(el => {
    el.addEventListener("click", () => {
      trackEvent("instagram_click", {
        href: el.getAttribute("href") || ""
      });
    });
  });

  // 4. Sample Order / Inquiry Form
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", () => {
      trackEvent("review_form_submitted");
    });
  }
});

