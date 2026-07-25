import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/ProductGrid"
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
  if (slug === "all") return { title: "All Products" }
  const category = await getCategory(slug)
  if (!category) return { title: "Not Found" }
  return { title: category.name }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  if (slug === "all") {
    const products = await getAllProducts()
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">All Products</h1>
        <ProductGrid products={products} />
      </div>
    )
  }

  const category = await getCategory(slug)
  if (!category) notFound()

  const products = await getProducts(category.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">{category.name}</h1>
      <ProductGrid products={products} />
    </div>
  )
}
