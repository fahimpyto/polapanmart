import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/ProductGrid"
import Link from "next/link"
import type { Product, Category } from "@/types"

async function getFeatured() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8)
  return (data ?? []) as Product[]
}

async function getLatest() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(8)
  return (data ?? []) as Product[]
}

async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data ?? []) as Category[]
}

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeatured(),
    getLatest(),
    getCategories(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Discover Amazing Products
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Curated deals, updated daily. Find your next favorite thing.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured</h2>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Newest</h2>
        </div>
        <ProductGrid products={latest} />
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
