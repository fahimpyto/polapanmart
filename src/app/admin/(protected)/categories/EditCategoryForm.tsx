"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { SEOFields } from "@/components/SEOFields"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"
import type { Category } from "@/types"

interface EditCategoryFormProps {
  category: Category & { sort_order: number }
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(category.name)
  const [sortOrder, setSortOrder] = useState(String(category.sort_order))
  const [loading, setLoading] = useState(false)

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(category.meta_title ?? "")
  const [metaDescription, setMetaDescription] = useState(category.meta_description ?? "")
  const [ogTitle, setOgTitle] = useState(category.og_title ?? "")
  const [ogDescription, setOgDescription] = useState(category.og_description ?? "")
  const [ogImage, setOgImage] = useState(category.og_image ?? "")
  const [canonicalOverride, setCanonicalOverride] = useState(category.canonical_override ?? "")
  const [noindex, setNoindex] = useState(category.noindex ?? false)
  const [nofollow, setNofollow] = useState(category.nofollow ?? false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const slug = slugify(name)

    const { error } = await supabase
      .from("categories")
      .update({
        name: name.trim(),
        slug,
        sort_order: parseInt(sortOrder) || 1,
        // SEO fields
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        og_title: ogTitle.trim() || null,
        og_description: ogDescription.trim() || null,
        og_image: ogImage.trim() || null,
        canonical_override: canonicalOverride.trim() || null,
        noindex,
        nofollow,
      })
      .eq("id", category.id)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Category updated!")
    router.push("/admin/categories")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="cat-name"
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="cat-order"
          label="Order"
          type="number"
          min="1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>

      <SEOFields prefix="cat_" defaultTwitterCard="summary" />

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
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