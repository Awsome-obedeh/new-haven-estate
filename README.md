# Haven — Real Estate Homepage (Next.js + JavaScript)

A homepage for a real estate platform: estates, land, shortlets and
commercial listings, built with Next.js App Router, plain JavaScript
(no TypeScript), and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.js          Root layout, loads fonts (Fraunces + Inter)
  page.js             Homepage — assembles all sections
  globals.css         Tailwind + base styles
components/
  Navbar.js           Sticky nav with mobile menu
  Hero.js             Headline, search bar, image stack
  Categories.js        Estates / Land / Shortlets / Commercial quick-nav
  PropertyCard.js      Reusable listing card (used everywhere)
  FeaturedProperties.js  Curated grid of featured listings
  CategorySection.js   Generic "listings by category" section
  TrustBand.js         Verification process / trust signals
  Footer.js            Contact + sitemap
data/
  properties.js         Mock listings + helpers (formatPrice, getFeatured, getByCategory)
```

## Wiring up real data

Everything reads from `data/properties.js`. Swap `PROPERTIES` for a real
fetch (e.g. inside a Server Component, or via `fetch()` to your API/CMS)
and every component keeps working unchanged, since they all consume the
same shape:

```js
{
  id, title, category, purpose, price, currency, period,
  location, beds, baths, areaSqm, image, featured, verified
}
```

- `category`: one of `estates | land | shortlets | commercial`
- `purpose`: one of `sale | rent | shortlet` (drives the badge color)

## Design notes

- Palette: forest green (`#17392E`) + brass gold (`#C9A227`) + warm sand/cream,
  with terracotta clay as a sparing accent — steering away from the generic
  cream-and-terracotta AI look by keeping green as the dominant identity.
- Type: **Fraunces** (display serif, used italic in the hero) paired with
  **Inter** (body/UI).
- Signature element: the overlapping, slightly rotated photo stack in the
  hero, echoing a property brochure rather than a single hero banner.
- Accessible by default: visible focus rings, `prefers-reduced-motion`
  respected, semantic headings throughout.

## Next steps you'll likely want

- A `/property/[id]` detail page (route already implied by "View details" links)
- Real image hosting (currently using Unsplash URLs as placeholders —
  swap the `images.remotePatterns` in `next.config.mjs` for your CDN)
- A working contact/lead form under `#contact`
- Auth + a dashboard for the "List a property" flow

## Authentication API

The app exposes two JSON endpoints:

- `POST /api/register` — accepts `firstName`, `lastName`, `email`, `phone` and `password`.
- `POST /api/login` — accepts `email` and `password`.

Successful requests return a sanitized `user` object and set an HTTP-only
`haven_session` cookie. Passwords are hashed with PBKDF2 before storage.

The current user and session store is in memory, so it is suitable for local
development only and resets when the server restarts. Replace `lib/auth.js`
with a database-backed store before deploying.
