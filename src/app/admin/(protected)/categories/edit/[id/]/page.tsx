import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EditCategoryForm } from "@/app/admin/(protected)/categories/EditCategoryForm"

interface Props {
  params: Promise<{ id: string }>
}

async function getCategory(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()
  return data
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Category</h1>
      <EditCategoryForm category={category} />
    </div>
  )
}