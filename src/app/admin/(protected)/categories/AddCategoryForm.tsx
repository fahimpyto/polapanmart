"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { slugify } from "@/lib/utils"
import { toast } from "sonner"

export function AddCategoryForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [sortOrder, setSortOrder] = useState("1")
  const [loading, setLoading] = useState(false)

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
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Category added!")
    setName("")
    setSortOrder("1")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
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
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
