import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/ProductGrid"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { generateCategorySEO } from "@/lib/seo/generateMetadata"
import type { Metadata } from "next"
import type { Product, Category } from "@/types"

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data as Category | null
}

async function getProducts(categoryId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("active", true)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
  return (data ?? []) as Product[]
}

async function getAllProducts() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("active", true)
    .order("created_at", { ascending: false })
  return (data ?? []) as Product[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const baseUrl = "https://polapanmart.vercel.app"

  if (slug === "all") {
    const canonicalUrl = `${baseUrl}/category/all`
    return {
      title: "All Products",
      description:
        "Browse all products on PolapanMart. Curated deals updated daily across electronics, fashion, home goods, and more.",
      openGraph: {
        title: "All Products — PolapanMart",
        description:
          "Browse all products on PolapanMart. Curated deals updated daily across electronics, fashion, home goods, and more.",
        type: "website",
        url: canonicalUrl,
        locale: "en_US",
        siteName: "PolapanMart",
      },
      twitter: {
        card: "summary_large_image",
        title: "All Products — PolapanMart",
        description:
          "Browse all products on PolapanMart. Curated deals updated daily across electronics, fashion, home goods, and more.",
      },
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true },
    }
  }

  const category = await getCategory(slug)
  if (!category) return { title: "Not Found" }

  const seoData = {
    meta_title: category.meta_title,
    meta_description: category.meta_description,
    og_title: category.og_title,
    og_description: category.og_description,
    og_image: category.og_image,
    canonical_override: category.canonical_override,
    noindex: category.noindex,
    nofollow: category.nofollow,
  }

  return generateCategorySEO(category, seoData)
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  if (slug === "all") {
    const products = await getAllProducts()
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "All Products" },
    ]
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-8 text-2xl font-bold">All Products</h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Browse all products on PolapanMart. Curated deals updated daily across electronics, fashion, home goods, and more.
        </p>
        <ProductGrid products={products} />
      </div>
    )
  }

  const category = await getCategory(slug)
  if (!category) notFound()

  const products = await getProducts(category.id)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/category/all" },
    { label: category.name },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Shop {category.name} on PolapanMart. Curated deals updated daily. Find the best {category.name.toLowerCase()} deals.
      </p>
      <ProductGrid products={products} />
    </div>
  )
}
