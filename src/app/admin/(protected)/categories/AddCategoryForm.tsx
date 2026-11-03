"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { SEOFields } from "@/components/SEOFields"
import { createCategory } from "@/actions/categories"

export function AddCategoryForm() {
  const router = useRouter()
  const [formState, formAction, isPending] = useActionState(createCategory, { error: "" })

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="cat-name"
            name="name"
            label="Category Name"
            required
            placeholder="e.g. Home"
          />
          <div className="w-20">
            <Input
              id="cat-order"
              name="sort_order"
              label="Order"
              type="number"
              min="1"
              defaultValue="1"
            />
          </div>
        </div>

        <SEOFields prefix="cat_" defaultTwitterCard="summary" />

        {formState.error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {formState.error}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add"}
        </Button>
      </form>
    </div>
  )
}
