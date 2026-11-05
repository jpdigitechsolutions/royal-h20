# Royal H2O — Luxury Bottled Water & Customization Website

A modern, commercial website for **Royal H2O**, a luxury bespoke bottled water brand based in Pune, Maharashtra, India. The platform specializes in personalized gold-foil labeled alkaline water bottles for weddings, corporate galas, private celebrations, and VIP gifting.

---

## 💎 Features & Capabilities

1. **Brand Aesthetic & Luxury Visual Design**
   - Palette: Obsidian black (`#080707`), Royal gold (`#C5A028`), Radiant gold (`#E4B53E`), and Platinum/Ivory.
   - Typography: *Cormorant Garamond* (editorial luxury serif display) + *Inter* (crisp, modern body sans-serif).
   - Dynamic ambient water droplet and splash physics system with `@keyframes`.
   - Subtle glassmorphism panels with responsive depth and blur.

2. **Interactive Live Bottle Customizer (`#customizer`)**
   - **Real-time Live Mockup Rendering:** Real-time visual feedback reflecting:
     - Bottle silhouettes (Sleek Glass 500ml, Matte Obsidian 500ml, Royal Carafe 750ml).
     - Label themes & foil finishes (Gold on Obsidian, Champagne Ivory, Rose Gold Luxe, Platinum Silver).
     - Custom Monograms & Initials (rendered in *Cormorant Garamond*).
     - Personalization line (Names, event titles, dates).
   - **One-Click WhatsApp Integration:** Encodes all user inputs (style, foil, monogram, text, occasion, quantity, notes) into an inquiry message sent to WhatsApp Concierge.
   - **Specification Copying & Reset:** Fast clipboard utility and form reset.

3. **Curated Product Collection (`#collection`)**
   - Filterable categories: *All Editions*, *Signature*, *Weddings*, *Corporate*, and *Gifting*.
   - Direct customization routing (presets occasion and opens customizer).
   - Direct WhatsApp booking link for each product.

4. **Occasions & Use Cases (`#occasions`)**
   - Targeted scenarios: Royal Weddings, Executive Galas, VIP Hospitality Suites, Bespoke Gifting, Intimate Soirées, and Milestone Anniversaries.
   - One-click presets that configure the customizer for that specific celebration.

5. **Gallery & Inspiration with Lightbox (`#gallery`)**
   - High-resolution commercial event imagery.
   - Keyboard-accessible interactive Lightbox with Escape-key exit and backdrop closing.

6. **Interactive FAQ Accordion (`#faq`)**
   - Accessible accordion answering key customer questions regarding design proofing, minimum orders, delivery coverage, and artwork requirements.

7. **Reviews & Testimonials Engine (`#testimonials`)**
   - Transparent client-side `localStorage` implementation for demonstration.
   - Dynamic real-time star rating calculation and counter.
   - Interactive review submission form with HTML5 input validation and XSS sanitization.

8. **Direct Concierge Hub & Inquiry Form (`#contact`)**
   - Verified WhatsApp numbers (`+91 76667 36148` for orders, `+91 97309 09060` for general inquiries).
   - Comprehensive event inquiry form with 10-digit mobile number and email validation.
   - Formats and dispatches inquiries directly into WhatsApp.

---

## 📁 Project Structure

```
d:\College\water website\
│
├── index.html                  # Upgraded semantic HTML5 landing page
├── styles.css                  # Upgraded responsive luxury CSS design system
├── script.js                   # Upgraded interaction controller & customizer engine
├── favicon.svg                 # Vector gold-foil crown monogram favicon
├── robots.txt                  # Search engine crawl directives
├── sitemap.xml                 # XML sitemap for SEO indexing
│
├── assets/
│   ├── icons/
│   │   └── favicon.svg         # High-res vector favicon
│   └── images/
│       ├── hero-royal-bottle.jpg
│       ├── royal-signature-bottle.jpg
│       ├── wedding-edition.jpg
│       ├── corporate-edition.jpg
│       ├── personalized-gifting.jpg
│       ├── bottle-customization.jpg
│       ├── wedding-table-arrangement.jpg
│       ├── luxury-bottle-closeup.jpg
│       ├── corporate-event-display.jpg
│       ├── premium-packaging.jpg
│       ├── brand-story.jpg
│       ├── gallery-01.jpg
│       ├── gallery-02.jpg
│       └── gallery-03.jpg
│
├── backup_original/            # Original unmodified project files backup
├── README.md                   # Setup, deployment, and architecture guide
├── BUSINESS_CONTENT_TODO.md    # Business policies needing owner confirmation
└── FUNCTIONALITY_TEST_REPORT.md# Test results and verification matrix
```

---

## 🚀 Setup & Local Development

No Node.js build step or complex bundler is required. The website runs purely on standard web technologies (HTML5, CSS3, Vanilla ES6+ JavaScript).

### Running Locally:
1. **VS Code Live Server:** Right-click `index.html` and click **"Open with Live Server"**.
2. **Python HTTP Server:**
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in any modern web browser.
3. **Double-Click:** You can also directly open `index.html` in Chrome, Edge, Safari, or Firefox.

---

## 🌐 Static Deployment

The website can be deployed immediately to any static hosting service:
- **GitHub Pages:** Commit to repository `royal_h20` and enable GitHub Pages in Settings -> Pages.
- **Vercel / Netlify / Cloudflare Pages:** Push repository or drag-and-drop the project folder.

---

## 📞 Business Contacts

- **Orders & Coordination (Primary WhatsApp):** `+91 76667 36148`
- **General Inquiries (Secondary WhatsApp):** `+91 97309 09060`
- **Instagram:** [@royal_h2o_07](https://instagram.com/royal_h2o_07)
- **Dispatch Center:** Gajanan Maharaj Housing Society, Nigoje Road, Moi, Pune, Maharashtra, India.

