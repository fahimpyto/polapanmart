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
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}
