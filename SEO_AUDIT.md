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
| **Canonical URLs** | ✅ | Explicit `alternates.canonical` in all page metadata |
| **Robots Meta** | ✅ | `robots: { index: true, follow: true }` on public pages |
| **Language** | ✅ | `<html lang="en">` |
| **robots.txt** | ✅ | `src/app/robots.ts` — dynamic, allows `/`, disallows `/admin/`, `/api/` |
| **sitemap.xml** | ✅ | `src/app/sitemap.ts` — dynamic, fetches products + categories from Supabase |
| **Homepage Metadata** | ✅ | `generateMetadata()` with title, description, OG, Twitter, canonical |
| **Search Page Metadata** | ✅ | `generateMetadata()` with `noindex, follow`, canonical |
| **Category Pages Metadata** | ✅ | Enhanced with description, OG, canonical |
| **Product JSON-LD** | ✅ | Product schema with price, availability, brand, offers |
| **Organization + WebSite JSON-LD** | ✅ | In root layout with SearchAction |
| **Breadcrumb Navigation** | ✅ | Component + BreadcrumbList schema on product/category pages |
| **404 Page** | ✅ | Custom `not-found.tsx` with search form |
| **Favicon / PWA** | ✅ | SVG favicon, manifest.json, icons in metadata |
| **Core Web Vitals** | ✅ | `@vercel/speed-insights` integrated |

---

## ❌ Critical Missing (Must Fix Before Google Submission)

*All critical items from previous audit are now DONE ✅*

---

## ⚠️ High Priority (New Requirements from Reference HTML)

### 1. **Admin Panel: SEO Fields Management** — NEW
Need CMS-style SEO fields in admin for each entity:
| Entity | Fields Needed |
|--------|---------------|
| **Products** | `meta_title`, `meta_description`, `og_image`, `og_title`, `og_description`, `twitter_card`, `canonical_override`, `noindex`, `nofollow`, `json_ld_custom` |
| **Categories** | `meta_title`, `meta_description`, `og_image`, `og_title`, `og_description`, `canonical_override`, `noindex`, `nofollow` |
| **Homepage** | `meta_title`, `meta_description`, `og_image`, `og_title`, `og_description`, `twitter_card`, `json_ld_custom` |
| **Global/Site** | `site_name`, `default_og_image`, `twitter_handle`, `facebook_app_id`, `google_verification`, `bing_verification`, `pinterest_verification`, `organization_schema` (JSON) |

**Database changes:**
```sql
-- Add to products table
ALTER TABLE products ADD COLUMN meta_title TEXT;
ALTER TABLE products ADD COLUMN meta_description TEXT;
ALTER TABLE products ADD COLUMN og_image TEXT;
ALTER TABLE products ADD COLUMN og_title TEXT;
ALTER TABLE products ADD COLUMN og_description TEXT;
ALTER TABLE products ADD COLUMN twitter_card TEXT DEFAULT 'summary_large_image';
ALTER TABLE products ADD COLUMN canonical_override TEXT;
ALTER TABLE products ADD COLUMN noindex BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN nofollow BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN json_ld_custom JSONB;

-- Add to categories table
ALTER TABLE categories ADD COLUMN meta_title TEXT;
ALTER TABLE categories ADD COLUMN meta_description TEXT;
ALTER TABLE categories ADD COLUMN og_image TEXT;
ALTER TABLE categories ADD COLUMN og_title TEXT;
ALTER TABLE categories ADD COLUMN og_description TEXT;
ALTER TABLE categories ADD COLUMN canonical_override TEXT;
ALTER TABLE categories ADD COLUMN noindex BOOLEAN DEFAULT FALSE;
ALTER TABLE categories ADD COLUMN nofollow BOOLEAN DEFAULT FALSE;

-- Create site_seo table for global settings
CREATE TABLE site_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'PolapanMart',
  default_og_image TEXT,
  twitter_handle TEXT,
  facebook_app_id TEXT,
  google_verification TEXT,
  bing_verification TEXT,
  pinterest_verification TEXT,
  organization_schema JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. **Complete OpenGraph + Twitter Cards** — PARTIAL
Current: Basic OG on product page only  
**Needed on ALL pages:**
- `og:locale` (en_US)
- `og:title` (custom or fallback to title)
- `og:description` (custom or fallback to description)
- `og:url` (canonical URL)
- `og:site_name` (from site_seo)
- `og:image` (custom or fallback to product/category image)
- `og:image:width` / `og:image:height` / `og:image:alt` / `og:image:type`
- `twitter:card` (summary_large_image)
- `twitter:title` / `twitter:description` / `twitter:image`

### 3. **Advanced JSON-LD @graph Schema** — BASIC ONLY
Current: Separate Product, Organization, WebSite schemas  
**Reference uses `@graph` with:**
- `Person` / `Organization` with `@id`, `sameAs`, `knowsAbout`, `address`
- `WebSite` with `SearchAction` potentialAction
- `Service` schema for offerings
- All linked via `@id` references

### 4. **Search Engine Verification Meta Tags** — MISSING
```html
<meta name="google-site-verification" content="..." />
<meta name="msvalidate.01" content="..." />
<meta name="p:domain_verify" content="..." />
```
Store in `site_seo` table, output in root layout.

### 5. **Performance: Resource Hints & Deferred Loading** — MISSING
- `<link rel="preconnect">` for CDNs (Supabase, fonts, analytics)
- `<link rel="preload">` for critical CSS
- Deferred Font Awesome (media="print" onload trick)
- Deferred Google Analytics (requestIdleCallback + interaction trigger)
- Inline critical CSS for above-fold

### 6. **Accessibility & Semantic HTML** — BASIC
- Skip to main content link
- Proper ARIA labels on nav, mobile menu, breadcrumbs
- `content-visibility: auto` on below-fold sections
- `contain-intrinsic-size` for layout stability

---

## 🔧 Implementation Plan (New Priority Order)

### Phase 1: Database + Admin UI (Foundation)
| Task | File/Action | Priority |
|------|-------------|----------|
| Run SQL migrations for SEO columns | Supabase SQL Editor | 🔴 Critical |
| Create `site_seo` table | Supabase SQL Editor | 🔴 Critical |
| Add SEO fields to Product form | `src/app/admin/(protected)/products/add/AddProductForm.tsx` | 🔴 Critical |
| Add SEO fields to Product edit | `src/app/admin/(protected)/products/edit/[id]/EditProductForm.tsx` | 🔴 Critical |
| Add SEO fields to Category form | Create category admin pages | 🔴 Critical |
| Create Site SEO settings page | `src/app/admin/(protected)/seo/page.tsx` | 🔴 Critical |

### Phase 2: Metadata Generation (Consuming SEO Fields)
| Task | File/Action | Priority |
|------|-------------|----------|
| Update product `generateMetadata()` to use admin fields | `src/app/products/[slug]/page.tsx` | 🔴 Critical |
| Update category `generateMetadata()` to use admin fields | `src/app/category/[slug]/page.tsx` | 🔴 Critical |
| Update homepage `generateMetadata()` to use site_seo | `src/app/page.tsx` | 🔴 Critical |
| Create reusable `generateSEOMetadata()` utility | `src/lib/seo/generateMetadata.ts` | 🟠 High |

### Phase 3: Advanced Schema & Tags
| Task | File/Action | Priority |
|------|-------------|----------|
| Implement `@graph` JSON-LD with Person/Organization/WebSite/Service | `src/lib/seo/schemas.ts` | 🟠 High |
| Add OG image dimensions/alt/type detection | `src/lib/seo/ogImage.ts` | 🟠 High |
| Add verification meta tags to layout | `src/app/layout.tsx` | 🟠 High |
| Add resource hints (preconnect, preload) | `src/app/layout.tsx` | 🟡 Medium |
| Defer Font Awesome + GA | `src/app/layout.tsx` | 🟡 Medium |
| Inline critical CSS | `src/app/globals.css` + layout | 🟡 Medium |

### Phase 4: Polish
| Task | File/Action | Priority |
|------|-------------|----------|
| Skip link + ARIA improvements | `src/app/layout.tsx`, components | 🟢 Low |
| `content-visibility` on sections | Page components | 🟢 Low |
| Test with Rich Results Test + Lighthouse | Manual | 🟢 Low |

---

## 📊 Quick Wins Checklist (Updated)

- [ ] Run SQL migrations for SEO columns (products, categories, site_seo)
- [ ] Add SEO fields to Product add/edit forms
- [ ] Add SEO fields to Category admin
- [ ] Create Site SEO settings page
- [ ] Update `generateMetadata()` to read admin SEO fields
- [ ] Implement `@graph` JSON-LD schema utility
- [ ] Add verification meta tags from site_seo
- [ ] Add resource hints + deferred loading in layout
- [ ] Test all schemas with Rich Results Test

---

## 📝 Notes for Implementation

- **Admin SEO fields:** Use nullable columns; fallback to auto-generated values (current logic) when empty
- **OG image dimensions:** Use `next/image` to get dimensions or store width/height in admin
- **JSON-LD @graph:** Build as TypeScript objects, stringify in metadata `other: { "script:ld+json": ... }`
- **Verification codes:** Store in `site_seo`, output conditionally if present
- **ISR:** Keep `revalidate: 3600` on product/category pages for SEO freshness
- **Migration:** Run in Supabase Dashboard → SQL Editor, then regenerate types: `npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts`

---

**Next Step:** Start with Phase 1 — SQL migrations + admin form fields. I can generate the SQL and form components when ready.