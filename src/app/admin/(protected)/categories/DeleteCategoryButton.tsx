"use client"

import { Trash2 } from "lucide-react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteCategory } from "@/actions/categories"

interface DeleteCategoryButtonProps {
  categoryId: string
  name: string
}

export function DeleteCategoryButton({ categoryId, name }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [, formAction, isPending] = useActionState(deleteCategory, { success: false, error: null })

  function handleDelete(formData: FormData) {
    if (!confirm(`Delete category "${name}"? Products in this category will be uncategorized.`)) {
      return
    }
    formData.append("id", categoryId)
    formAction(formData)
  }

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  )
}
