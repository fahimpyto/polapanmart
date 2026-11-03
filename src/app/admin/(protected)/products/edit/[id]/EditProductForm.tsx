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
import { updateProductAction } from "@/actions/products"
import type { Product, Category } from "@/types"

interface EditProductFormProps {
  product: Product
  categories: Category[]
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(product.image_url ?? "")
  const [featured, setFeatured] = useState(product.featured)
  const [formState, formAction, isPending] = useActionState(updateProductAction, { error: "" })

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={product.id} />
      <Input
        id="title"
        name="title"
        label="Product Name"
        defaultValue={product.title}
        required
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        defaultValue={product.description ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="price"
          name="price"
          label="Price"
          type="text"
          defaultValue={String(product.price)}
          required
        />

        <Select
          id="category"
          name="category_id"
          label="Category"
          defaultValue={product.category_id ?? ""}
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
        defaultValue={product.affiliate_link}
        required
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

      <SEOFields defaultValues={{
        meta_title: product.meta_title ?? "",
        meta_description: product.meta_description ?? "",
        og_title: product.og_title ?? "",
        og_description: product.og_description ?? "",
        og_image: product.og_image ?? "",
        twitter_card: product.twitter_card ?? "summary_large_image",
        canonical_override: product.canonical_override ?? "",
        noindex: product.noindex ?? false,
        nofollow: product.nofollow ?? false,
        json_ld_custom: product.json_ld_custom ? JSON.stringify(product.json_ld_custom, null, 2) : "",
      }} />

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
