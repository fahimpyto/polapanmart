"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { ImageUploader } from "@/components/ImageUploader"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"
import type { Category } from "@/types"

interface AddProductFormProps {
  categories: Category[]
}

export function AddProductForm({ categories }: AddProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [featured, setFeatured] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !price || !affiliateLink.trim()) {
      toast.error("Title, price, and affiliate link are required")
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const slug = slugify(title)

    const { error } = await supabase.from("products").insert({
      title: title.trim(),
      slug,
      description: description.trim() || null,
      price: priceNum,
      affiliate_link: affiliateLink.trim(),
      category_id: categoryId || null,
      featured,
      image_url: imageUrl || null,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Product published!")
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Product Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="e.g. AirPods Pro"
      />

      <Textarea
        id="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the product..."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="price"
          label="Price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="29.99"
        />

        <Select
          id="category"
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </div>

      <Input
        id="affiliate_link"
        label="Affiliate Link"
        type="url"
        value={affiliateLink}
        onChange={(e) => setAffiliateLink(e.target.value)}
        required
        placeholder="https://amazon.com/dp/..."
      />

      <ImageUploader onUpload={setImageUrl} currentImage={imageUrl} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-pink-600 focus:ring-pink-500"
        />
        <span className="text-sm font-medium">Featured product</span>
      </label>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
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
