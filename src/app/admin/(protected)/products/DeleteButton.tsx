"use client"

import { Trash2 } from "lucide-react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteProduct } from "@/actions/products"

interface DeleteButtonProps {
  productId: string
  title: string
}

export function DeleteButton({ productId, title }: DeleteButtonProps) {
  const router = useRouter()
  const [, formAction, isPending] = useActionState(deleteProduct, { success: false, error: null })

  function handleDelete(formData: FormData) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
      return
    }
    formData.append("id", productId)
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
