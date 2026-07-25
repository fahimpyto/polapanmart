"use client"

import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteCategoryButtonProps {
  categoryId: string
  name: string
}

export function DeleteCategoryButton({ categoryId, name }: DeleteCategoryButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete category "${name}"? Products in this category will be uncategorized.`)) return

    const supabase = createClient()
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)

    if (error) {
      toast.error("Failed to delete category")
      return
    }

    toast.success("Category deleted")
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
