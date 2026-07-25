"use client"

import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteButtonProps {
  productId: string
  title: string
}

export function DeleteButton({ productId, title }: DeleteButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

    const supabase = createClient()
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (error) {
      toast.error("Failed to delete product")
      return
    }

    toast.success("Product deleted")
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
