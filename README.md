# PolapanMart — Instagram Affiliate Marketing Website

A simple CMS-powered landing website for Instagram affiliate marketing.

Built with **Next.js + Supabase** — zero-cost hosting, add products in 30 seconds without touching code.

## Features

- Product management via `/admin` dashboard (add/edit/delete)
- Image upload to Supabase Storage
- Click tracking for affiliate links
- Mobile-first responsive design
- Dark/light mode
- Product search & categories
- SEO-friendly product pages
- Social sharing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel (free tier) |

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Create a `product-images` storage bucket (public)
4. Enable Email Auth in Authentication → Providers
5. Create an admin user in Authentication → Users

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase project URL, anon key, and service role key.

### 4. Run

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `/admin` for the dashboard.

## Usage

1. Login at `/admin/login`
2. Click **Add Product**
3. Fill in: title, price, image, affiliate link, category
4. Click **Publish**
5. Product appears instantly on the homepage — no redeploy needed.

## License

MIT
