import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Edit, Trash2, Plus } from "lucide-react"
import type { Product } from "@/types"
import { DeleteButton } from "./DeleteButton"

async function getProducts() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })
  return (data ?? []) as Product[]
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Title</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Price</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Featured</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Clicks</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {product.featured ? (
                    <Badge variant="success">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </td>
                <td className="px-4 py-3">{product.click_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <DeleteButton productId={product.id} title={product.title} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No products yet. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
