import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AddProductForm } from "./AddProductForm"
import type { Category } from "@/types"

async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data ?? []) as Category[]
}

export default async function AddProductPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Product</h1>
      <AddProductForm categories={categories} />
    </div>
  )
}
