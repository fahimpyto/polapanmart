import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/Badge"
import { AddCategoryForm } from "./AddCategoryForm"
import { DeleteCategoryButton } from "./DeleteCategoryButton"
import type { Category } from "@/types"

async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
  return (data ?? []) as (Category & { sort_order: number })[]
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>

      <div className="mb-8 max-w-sm">
        <h2 className="mb-3 text-sm font-medium text-zinc-500">Add Category</h2>
        <AddCategoryForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Order</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-zinc-500">{cat.slug}</td>
                <td className="px-4 py-3">{cat.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteCategoryButton categoryId={cat.id} name={cat.name} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
