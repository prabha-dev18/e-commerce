# Lumière: Premium Cosmetic E-Commerce

Next.js 14 (App Router, JavaScript) · Tailwind CSS · Framer Motion · MongoDB (Mongoose) · NextAuth · Razorpay · Zustand

A full store: customer site, checkout and payments, customer account, and an admin panel. Palette: background #F8F5F0, primary #2A211D, accent #B99A6B, secondary #EDE3D8, text #756A61, highlight #B98282.

## 1. Run it on your computer
```bash
npm install
cp .env.example .env.local      # then fill in the values (see section 3)
npm run dev                     # http://localhost:3000
npm run seed                    # in a second terminal: adds products, coupons, blog posts and the admin user
```
You need MongoDB: a local install (`mongodb://127.0.0.1:27017/lumiere`) or a free MongoDB Atlas cluster. Without a database the shop still shows the bundled sample products, but login, orders and the admin need it.

## 2. Open the admin
1. Log in at `/login` with ADMIN_EMAIL and ADMIN_PASSWORD from `.env.local` (created by `npm run seed`)
2. Open `/admin` (or Account, then Admin panel)
3. Change the admin password under Account, Password

Roles: admin (everything), manager (catalog, orders, marketing), support (orders, customers, reviews, returns, messages). Admins give roles in Admin, Customers.

## 3. Environment variables (`.env.local`)
| Variable | What it is |
|---|---|
| MONGODB_URI | MongoDB connection string |
| NEXTAUTH_SECRET | Long random text. Make one with `openssl rand -base64 32` |
| NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL | Your site address, e.g. https://www.yourstore.com |
| SEED_SECRET | Password for the seed command. Remove it after the first seed in production |
| ADMIN_EMAIL, ADMIN_PASSWORD | First admin login, created by the seed |
| RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET | Online payments (use Test Mode keys first) |
| RAZORPAY_WEBHOOK_SECRET | Secret of the Razorpay webhook |
| CLOUDINARY_CLOUD_NAME, _API_KEY, _API_SECRET | Image uploads in the admin (optional) |
| SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM | Emails. If empty, emails are printed in the server console |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_GOOGLE_ENABLED=true | Google login (optional) |
| NEXT_PUBLIC_WHATSAPP_NUMBER | WhatsApp button, with country code, no plus sign |

## 4. Razorpay
1. Razorpay dashboard, Test Mode, copy Key ID and Key Secret into `.env.local`
2. Webhook (needed for production): Settings, Webhooks, URL `https://YOUR-DOMAIN/api/payments/webhook`, events `payment.captured`, `payment.failed`, `refund.processed`, and put its secret in RAZORPAY_WEBHOOK_SECRET
3. Test card: 4111 1111 1111 1111, any future expiry, any CVV

## 5. Deploy (Vercel + MongoDB Atlas)
1. Create a free Atlas cluster, a database user, and allow network access (0.0.0.0/0 works with Vercel)
2. Push this folder to GitHub and import it in Vercel
3. Add the environment variables from section 3. Set NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL to your real domain
4. Deploy, then seed once: `curl -X POST https://YOUR-DOMAIN/api/seed -H "x-seed-secret: YOUR_SEED_SECRET"`
5. Delete SEED_SECRET from Vercel afterwards (this switches the seed route off)
6. Switch Razorpay to live keys and add the live webhook

## 6. Before you go live
- Replace sample content: store addresses (`data/stores.js`), phone and email in the footer and Contact page, policy pages (have them checked by a lawyer; admins can replace any of them in Admin, Pages using the same slug: about, privacy, terms, returns, shipping-policy)
- Replace image links (`data/images.js` for the starter content; Admin for products and banners)
- Test the full flow in Razorpay Test Mode: order, payment, cancel, refund, return
- Change the admin password; set up real SMTP so customers receive emails
- The rate limiter keeps counts in server memory. On Vercel each serverless instance counts separately, so use a shared store such as Upstash Redis for strong protection
- Online orders that are never paid keep their stock reserved until the customer cancels or pays (guests are released automatically when they close the payment window). Add a scheduled job to cancel old unpaid orders if you expect many

## 7. What is where
- `app/` pages and API routes (`app/api`), `app/admin` admin pages
- `components/` UI (layout, home, product, shop, checkout, account, admin)
- `models/` Mongoose models, `lib/` helpers (pricing, payments, auth, SEO sources), `data/` starter content
- `lib/pricing.js` is the only place prices are decided; the browser's totals are only a preview

## 8. Features
Storefront: fading hero, 15 home sections, shop with URL-synced filters, search with suggestions, product pages (gallery zoom, shades, sizes, pincode check, reviews, Q&A, bundles, related, recently viewed), compare, wishlist, bag drawer and page with coupons, blog, FAQ, contact with map, store locator, CMS pages.
Checkout and account: guest or login checkout, Razorpay and COD, GST invoice details, order tracking, invoice, cancel, returns, addresses, notifications, rewards.
Admin: dashboard with charts, products (CSV import, uploads, SEO), orders, refunds, customers and roles, reviews, returns, coupons, banners and home sections, blog, pages, newsletter, messages, settings.
SEO and quality: metadata, canonical URLs, Open Graph, JSON-LD (Organization, WebSite, Product, Breadcrumb, FAQ, BlogPosting), sitemap.xml, robots.txt, security headers, skip link, keyboard and screen-reader labels, reduced-motion support.
Not included: multi-vendor, editing shipping fees from the admin, Stripe.


## QR code payments and invoices (added after Phase 7)

**What customers see:** at checkout they pick "Scan QR code and pay (UPI)". A QR code opens in a window with a 15 minute timer. They scan it with GPay, PhonePe, Paytm or any UPI app. The window checks every 3 seconds and shows "Payment done" as soon as the money arrives, then offers the invoice.

**Two ways to run it (pick one):**

1. Automatic (recommended). Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`. The QR is a Razorpay UPI QR, so payment is confirmed on its own. In the Razorpay dashboard, Webhooks, add `https://YOUR-DOMAIN/api/payments/webhook` with the events `payment.captured`, `payment.failed`, `refund.processed` and `qr_code.credited`. If QR Codes is not enabled on your Razorpay account, ask Razorpay support to switch it on.
2. Without Razorpay. Add `UPI_VPA=yourname@bank` and `UPI_PAYEE_NAME=Your Store` to `.env.local`. The customer scans, pays, then types the 12-digit UTR from their app. You confirm it in Admin, Orders, open the order, press "Confirm payment received". The customer gets the email and invoice at that moment.

**Invoices:** every order has a GST tax invoice (CGST and SGST for same-state orders, IGST otherwise) with a PAID stamp, payment reference and amount in words. Customers open it from My orders, from the order success page, or from the link in their order email (guests too). Press "Download PDF" and choose "Save as PDF". Put your store address, GSTIN and state in `.env.local` (`STORE_ADDRESS`, `STORE_GSTIN`, `STORE_STATE`) so they print on the invoice.

## Design system (premium and 3D look)

Fonts: see the Typography section below.
Depth: layered shadows (`shadow-soft`, `shadow-lift`, `shadow-3d`, `shadow-glow`, `shadow-btn`) and animations (`animate-float`, `animate-float-slow`, `animate-spin-slow`) live in `tailwind.config.js`.
Reusable classes in `app/globals.css`: `.card-3d` (rises on hover), `.glass` and `.glass-dark` (frosted panels), `.text-gold`, `.sheen` (light sweep on hover), `.arch` (door-shaped images), `.perspective` and `.preserve-3d`.
3D in components: product cards tilt toward the mouse (`components/product/ProductCard.jsx`), the hero stage tilts with floating glass chips (`components/home/HeroCarousel.jsx`). Both switch off for touch screens and for visitors who prefer reduced motion.
To change the look site-wide, edit `tailwind.config.js` and `app/globals.css` first, then the component files.

## Premium animation kit (v2 structure)

Reusable pieces live in `components/motion/`: SplitText, ScrollWords, MaskImage, Magnetic, Spotlight, Counter, Parallax, KineticMarquee, DrawLine, MeshBackground, Preloader, CursorFollower, ScrollProgress. Page transitions are in `app/template.js`.

Home page order (each toggle is in Admin > Settings > Home page sections): Hero, Kinetic band, Trust row, Manifesto, Pinned horizontal categories, Offers, Favourites (sticky intro + staggered grid), Daily ritual story (pinned), Deal of the day, Concern list, Trending (offset grid), Promo parallax, Brand marquee, Bundles, Testimonials, Gallery, Journal, Newsletter, Footer wordmark.

Tip: the custom cursor, magnetic buttons and tilt only run for a mouse; touch devices and "reduce motion" users get a calm version.

## Typography (v4)

Display font: Instrument Serif (a single clean weight, with italics). Body font: DM Sans at a medium-light weight. Both load through next/font in `app/layout.js` and are exposed as `--font-display` and `--font-body`. In section titles, wrap a word in asterisks (`title="Shop by *category*"`) to set it in gold italics. To change fonts again, edit only the two lines in `app/layout.js`.
