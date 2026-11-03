"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { ImageUploader } from "@/components/ImageUploader"
import { SEOFields } from "@/components/SEOFields"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"
import { createProduct } from "@/actions/products"
import type { Category } from "@/types"

interface AddProductFormProps {
  categories: Category[]
}

export function AddProductForm({ categories }: AddProductFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [formState, formAction, isPending] = useActionState(createProduct, { error: "" })

  return (
    <form action={formAction} className="space-y-6">
      <Input
        id="title"
        name="title"
        label="Product Name"
        required
        placeholder="e.g. AirPods Pro"
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Describe the product..."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="price"
          name="price"
          label="Price"
          type="text"
          required
          placeholder="$29 or 120 BDT"
        />

        <Select
          id="category"
          name="category_id"
          label="Category"
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </div>

      <Input
        id="affiliate_link"
        name="affiliate_link"
        label="Affiliate Link"
        type="url"
        required
        placeholder="https://amazon.com/dp/..."
      />

      <ImageUploader onUpload={setImageUrl} currentImage={imageUrl} />

      <input type="hidden" name="image_url" value={imageUrl} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium">Featured product</span>
      </label>

      <SEOFields />

      {formState.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {formState.error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Publishing..." : "Publish"}
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
