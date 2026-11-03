export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  price: string
  image_url: string | null
  affiliate_link: string
  category_id: string | null
  featured: boolean
  active: boolean
  click_count: number
  created_at: string
  updated_at: string
  categories?: Category | null
  // SEO fields
  meta_title?: string | null
  meta_description?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  twitter_card?: string | null
  canonical_override?: string | null
  noindex?: boolean
  nofollow?: boolean
  json_ld_custom?: Record<string, unknown> | null
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
  // SEO fields
  meta_title?: string | null
  meta_description?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  canonical_override?: string | null
  noindex?: boolean
  nofollow?: boolean
}
