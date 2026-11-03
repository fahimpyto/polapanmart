"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategory(
  _prevState: { error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const sortOrder = formData.get("sort_order") as string

  // SEO fields
  const metaTitle = formData.get("meta_title") as string
  const metaDescription = formData.get("meta_description") as string
  const ogTitle = formData.get("og_title") as string
  const ogDescription = formData.get("og_description") as string
  const ogImage = formData.get("og_image") as string
  const canonicalOverride = formData.get("canonical_override") as string
  const noindex = formData.get("noindex") === "on"
  const nofollow = formData.get("nofollow") === "on"

  if (!name?.trim()) {
    return { error: "Category name is required" }
  }

  const slug = slugify(name)

  const { error } = await supabase.from("categories").insert({
    name: name.trim(),
    slug,
    sort_order: parseInt(sortOrder) || 1,
    meta_title: metaTitle?.trim() || null,
    meta_description: metaDescription?.trim() || null,
    og_title: ogTitle?.trim() || null,
    og_description: ogDescription?.trim() || null,
    og_image: ogImage?.trim() || null,
    canonical_override: canonicalOverride?.trim() || null,
    noindex,
    nofollow,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/category/all")
  redirect("/admin/categories")
}

export async function updateCategory(
  id: string,
  _prevState: { error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const sortOrder = formData.get("sort_order") as string

  // SEO fields
  const metaTitle = formData.get("meta_title") as string
  const metaDescription = formData.get("meta_description") as string
  const ogTitle = formData.get("og_title") as string
  const ogDescription = formData.get("og_description") as string
  const ogImage = formData.get("og_image") as string
  const canonicalOverride = formData.get("canonical_override") as string
  const noindex = formData.get("noindex") === "on"
  const nofollow = formData.get("nofollow") === "on"

  if (!name?.trim()) {
    return { error: "Category name is required" }
  }

  const slug = slugify(name)

  const { error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      slug,
      sort_order: parseInt(sortOrder) || 1,
      meta_title: metaTitle?.trim() || null,
      meta_description: metaDescription?.trim() || null,
      og_title: ogTitle?.trim() || null,
      og_description: ogDescription?.trim() || null,
      og_image: ogImage?.trim() || null,
      canonical_override: canonicalOverride?.trim() || null,
      noindex,
      nofollow,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/category/all")
  revalidatePath("/category/" + slug)
  redirect("/admin/categories")
}

export async function deleteCategory(
  _prevState: { success: boolean; error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const id = formData.get("id") as string

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  revalidatePath("/category/all")

  return { success: true, error: null }
}

// Wrapper function for useActionState
export async function updateCategoryAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const id = formData.get("id") as string
  if (!id) return { error: "Missing ID" }
  return updateCategory(id, { error: "" }, formData)
}