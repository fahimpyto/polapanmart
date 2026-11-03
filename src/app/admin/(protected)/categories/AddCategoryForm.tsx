"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { SEOFields } from "@/components/SEOFields"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"

export function AddCategoryForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [sortOrder, setSortOrder] = useState("1")
  const [loading, setLoading] = useState(false)

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [ogTitle, setOgTitle] = useState("")
  const [ogDescription, setOgDescription] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [canonicalOverride, setCanonicalOverride] = useState("")
  const [noindex, setNoindex] = useState(false)
  const [nofollow, setNofollow] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const slug = slugify(name)

    const { error } = await supabase.from("categories").insert({
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

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Category added!")
    setName("")
    setSortOrder("1")
    setMetaTitle("")
    setMetaDescription("")
    setOgTitle("")
    setOgDescription("")
    setOgImage("")
    setCanonicalOverride("")
    setNoindex(false)
    setNofollow(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="cat-name"
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Home"
            required
          />
          <div className="w-20">
            <Input
              id="cat-order"
              label="Order"
              type="number"
              min="1"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>

        <SEOFields prefix="cat_" defaultTwitterCard="summary" />

        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>
    </div>
  )
}
