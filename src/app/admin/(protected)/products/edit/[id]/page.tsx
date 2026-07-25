import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EditProductForm } from "./EditProductForm"
import type { Product, Category } from "@/types"

interface Props {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single()
  return data as Product | null
}

async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data ?? []) as Category[]
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProduct(id), getCategories()])

  if (!product) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
      <EditProductForm product={product} categories={categories} />
    </div>
  )
}
