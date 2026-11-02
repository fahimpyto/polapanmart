# PolapanMart SEO Audit Report

**Date:** 2026-11-02  
**Site:** https://polapanmart.vercel.app  
**Stack:** Next.js 16 + Supabase (PostgreSQL) + Tailwind CSS

---

## ✅ Currently Implemented (Good)

| Area | Status | Details |
|------|--------|---------|
| **Root Metadata** | ✅ | `layout.tsx` has `title` (with template) + `description` |
| **Product Page Metadata** | ✅ | `generateMetadata()` with dynamic title, description, OpenGraph + product image |
| **Category Page Metadata** | ✅ | `generateMetadata()` with dynamic title (category name) |
| **Product Images** | ✅ | `next/image` with `alt={product.title}`, proper `sizes`, `priority` on detail page |
| **Semantic HTML** | ✅ | `<h1>` on product/detail pages, heading hierarchy |
| **Structured URLs** | ✅ | `/products/[slug]`, `/category/[slug]`, `/search?q=` |
| **Canonical URLs** | ⚠️ Partial | Next.js auto-generates but no explicit `canonical` in metadata |
| **Robots Meta** | ❌ Missing | No `robots` meta tag (index/follow) |
| **Language** | ✅ | `<html lang="en">` |

---

## ❌ Critical Missing (Must Fix Before Google Submission)

### 1. **robots.txt** — NOT EXISTS
- **File needed:** `public/robots.txt` OR `src/app/robots.ts` (Next.js 13+)
- **Content:**
```
User-agent: *
Allow: /

Sitemap: https://polapanmart.vercel.app/sitemap.xml
```

### 2. **sitemap.xml** — NOT EXISTS
- **File needed:** `src/app/sitemap.ts` (dynamic) or `src/app/sitemap.xml` (static)
- Must include:
  - Homepage `/`
  - All products `/products/[slug]`
  - All categories `/category/[slug]`
  - `/category/all`
  - `/search` (optional, noindex)
  - Admin pages → **exclude** (noindex)

### 3. **Homepage Metadata** — MISSING `generateMetadata`
- `page.tsx` has no `export async function generateMetadata()`
- Currently inherits root layout only (generic title/description)
- Needs unique, compelling title + description + OpenGraph

### 4. **Search Page Metadata** — MISSING
- No `generateMetadata()` — dynamic based on query `q`
- Should `noindex, follow` (prevent duplicate content)

### 5. **Category Pages — Incomplete Metadata**
- Only `title` returned, missing:
  - `description`
  - `openGraph` (title, description, image)
  - `canonical` URL

---

## ⚠️ High Priority (Strongly Recommended)

### 6. **JSON-LD Structured Data (Schema.org)**
| Page Type | Schema | Required Fields |
|-----------|--------|-----------------|
| Homepage | `WebSite`, `Organization` | name, url, logo, sameAs (social) |
| Product | `Product` | name, image, description, sku, offers (price, currency, availability, url), brand, aggregateRating |
| Category | `ItemList` / `CollectionPage` | itemListElement (products) |
| Breadcrumb | `BreadcrumbList` | All pages |

**Location:** Add in each page's `generateMetadata()` or component via `<script type="application/ld+json">`

### 7. **Canonical URLs** — MISSING
- Every page needs explicit `canonical` in metadata
- Prevents duplicate content (especially `/category/all` vs `/`)

### 8. **OpenGraph / Twitter Cards** — PARTIAL
- Product page: ✅ Has OG title, description, image
- Category page: ❌ Missing OG
- Homepage: ❌ Missing OG
- Search: ❌ Missing OG

### 9. **Image Optimization**
- Product images: ✅ `next/image` with alt, sizes, priority
- **Missing:** Category images (if any), homepage hero/banner
- **Missing:** `placeholder="blur"` + `blurDataURL` for LCP

### 10. **Performance / Core Web Vitals**
| Metric | Current | Target |
|--------|---------|--------|
| LCP | Unknown (no measurement) | < 2.5s |
| CLS | Unknown | < 0.1 |
| INP | Unknown | < 200ms |
- Add `@vercel/speed-insights` or `web-vitals` library
- Enable `next/image` optimization (already using)
- Check `next.config.ts` for image domains (has `**.supabase.co` ✅)

---

## 🔧 Medium Priority (Important for Rankings)

### 11. **Content SEO**
- **Product descriptions:** Currently `whitespace-pre-wrap` — ensure unique, descriptive content (not thin)
- **Category pages:** No descriptive content — add intro text + FAQ
- **Homepage:** Has heading + tagline — good start, expand with featured categories context

### 12. **Internal Linking**
- Navbar: Home only (no category links)
- Footer: Only home link
- **Add:** Category links in footer, "Related Products" on product page, breadcrumb navigation

### 13. **Breadcrumb Navigation** — MISSING
- Implement on: Product page, Category page
- Add `BreadcrumbList` schema

### 14. **Pagination / Infinite Scroll SEO**
- Category pages: No pagination visible (check `ProductGrid`)
- If infinite scroll: Ensure `IntersectionObserver` loads more + update URL (`?page=2`) for crawlability

### 15. **Hreflang / Internationalization** — N/A (single language)
- If adding Bengali: implement `alternate` hreflang

### 16. **404 Page** — CHECK
- Create `src/app/not-found.tsx` with helpful links + search

### 17. **Favicon / PWA Icons** — CHECK
- `public/favicon.ico`, `apple-touch-icon.png`, `manifest.json`

---

## 📋 Low Priority (Nice to Have)

### 18. **RSS / Feed** — For deals blog (if adding content)
### 19. **HTML Sitemap Page** — `/sitemap` for users
### 20. **AMP** — Not needed for affiliate site
### 21. **Edge Caching / ISR** — Configure `revalidate` on product/category pages

---

## 🛠️ Technical Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `src/app/robots.ts` | Create dynamic robots.txt | 🔴 Critical |
| `src/app/sitemap.ts` | Create dynamic sitemap.xml | 🔴 Critical |
| `src/app/page.tsx` | Add `generateMetadata()` | 🔴 Critical |
| `src/app/search/page.tsx` | Add `generateMetadata()` + noindex | 🔴 Critical |
| `src/app/category/[slug]/page.tsx` | Enhance `generateMetadata()` | 🔴 Critical |
| `src/app/products/[slug]/page.tsx` | Add `Product` JSON-LD schema | 🟠 High |
| `src/app/layout.tsx` | Add `WebSite` + `Organization` JSON-LD | 🟠 High |
| `src/components/Breadcrumb.tsx` | Create component + schema | 🟠 High |
| `src/app/not-found.tsx` | Create custom 404 | 🟡 Medium |
| `public/favicon.ico` + manifest | Add icons | 🟡 Medium |
| `next.config.ts` | Add `robots.txt`/`sitemap` headers if needed | 🟢 Low |

---

## 📊 Quick Wins Checklist (Do First)

- [ ] `src/app/robots.ts` — 5 min
- [ ] `src/app/sitemap.ts` — 15 min (fetch all products/categories)
- [ ] Homepage `generateMetadata()` — 5 min
- [ ] Search page `noindex` — 5 min
- [ ] Category page enhanced metadata — 10 min
- [ ] Product JSON-LD schema — 15 min
- [ ] Organization/WebSite JSON-LD in layout — 10 min
- [ ] Breadcrumb component + schema — 20 min
- [ ] Submit sitemap to Google Search Console — 5 min

---

## 🔍 How to Verify After Fixes

1. **Local:** `npm run build` → check `public/sitemap.xml` and `public/robots.txt` generated
2. **Deploy:** Push to Vercel
3. **Test URLs:**
   - `https://polapanmart.vercel.app/robots.txt`
   - `https://polapanmart.vercel.app/sitemap.xml`
4. **Google Search Console:**
   - Submit sitemap
   - Check "URL Inspection" for key pages
   - Validate Schema with [Rich Results Test](https://search.google.com/test/rich-results)
5. **Lighthouse / PageSpeed Insights** — Core Web Vitals
6. **Screaming Frog / Sitebulb** — Full crawl audit

---

## 📝 Notes for Implementation

- **Dynamic sitemap:** Use `createServerSupabaseClient()` to fetch all active products + categories at build time (or ISR with `revalidate: 3600`)
- **Admin routes:** Exclude `/admin/*` from sitemap + add `noindex` in layout
- **Affiliate disclaimer:** Already in footer — good for compliance
- **Price as string:** `price: string` in Type — ensure schema uses `price: "99.00"` format

---

**Next Step:** Start with Critical items (robots.txt, sitemap.ts, homepage metadata). I can implement each file when you're ready.