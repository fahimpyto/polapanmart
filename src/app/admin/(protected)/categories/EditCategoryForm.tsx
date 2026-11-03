"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { SEOFields } from "@/components/SEOFields"
import { updateCategoryAction } from "@/actions/categories"
import type { Category } from "@/types"

interface EditCategoryFormProps {
  category: Category & { sort_order: number }
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter()
  const [formState, formAction, isPending] = useActionState(updateCategoryAction, { error: "" })

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={category.id} />
      <Input
        id="cat-name"
        name="name"
        label="Category Name"
        defaultValue={category.name}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="cat-order"
          name="sort_order"
          label="Order"
          type="number"
          min="1"
          defaultValue={String(category.sort_order)}
        />
      </div>

      <SEOFields
        prefix="cat_"
        defaultTwitterCard="summary"
        defaultValues={{
          meta_title: category.meta_title ?? "",
          meta_description: category.meta_description ?? "",
          og_title: category.og_title ?? "",
          og_description: category.og_description ?? "",
          og_image: category.og_image ?? "",
          canonical_override: category.canonical_override ?? "",
          noindex: category.noindex ?? false,
          nofollow: category.nofollow ?? false,
        }}
      />

      {formState.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {formState.error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}