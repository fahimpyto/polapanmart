import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/ProductGrid"
import type { Product } from "@/types"

interface Props {
  searchParams: Promise<{ q?: string }>
}

async function searchProducts(query: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("active", true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
  return (data ?? []) as Product[]
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams

  if (!q?.trim()) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Search</h1>
        <p className="text-zinc-500">Enter a search term to find products.</p>
      </div>
    )
  }

  const products = await searchProducts(q.trim())

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="mb-8 text-sm text-zinc-500">
        {products.length} product{products.length !== 1 && "s"} found
      </p>
      <ProductGrid products={products} />
    </div>
  )
}
