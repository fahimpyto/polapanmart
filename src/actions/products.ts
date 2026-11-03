"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(
  _prevState: { error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const affiliateLink = formData.get("affiliate_link") as string
  const categoryId = formData.get("category_id") as string
  const featured = formData.get("featured") === "on"
  const imageUrl = formData.get("image_url") as string

  // SEO fields
  const metaTitle = formData.get("meta_title") as string
  const metaDescription = formData.get("meta_description") as string
  const ogTitle = formData.get("og_title") as string
  const ogDescription = formData.get("og_description") as string
  const ogImage = formData.get("og_image") as string
  const twitterCard = formData.get("twitter_card") as string
  const canonicalOverride = formData.get("canonical_override") as string
  const noindex = formData.get("noindex") === "on"
  const nofollow = formData.get("nofollow") === "on"
  const jsonLdCustom = formData.get("json_ld_custom") as string

  if (!title?.trim() || !price?.trim() || !affiliateLink?.trim()) {
    return { error: "Title, price, and affiliate link are required" }
  }

  const slug = slugify(title)

  const { error } = await supabase.from("products").insert({
    title: title.trim(),
    slug,
    description: description?.trim() || null,
    price: price.trim(),
    affiliate_link: affiliateLink.trim(),
    category_id: categoryId || null,
    featured,
    image_url: imageUrl || null,
    meta_title: metaTitle?.trim() || null,
    meta_description: metaDescription?.trim() || null,
    og_title: ogTitle?.trim() || null,
    og_description: ogDescription?.trim() || null,
    og_image: ogImage?.trim() || null,
    twitter_card: twitterCard || "summary_large_image",
    canonical_override: canonicalOverride?.trim() || null,
    noindex,
    nofollow,
    json_ld_custom: jsonLdCustom?.trim() ? JSON.parse(jsonLdCustom) : null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/")
  revalidatePath("/category/all")
  redirect("/admin/products")
}

export async function updateProduct(
  id: string,
  _prevState: { error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const affiliateLink = formData.get("affiliate_link") as string
  const categoryId = formData.get("category_id") as string
  const featured = formData.get("featured") === "on"
  const imageUrl = formData.get("image_url") as string

  // SEO fields
  const metaTitle = formData.get("meta_title") as string
  const metaDescription = formData.get("meta_description") as string
  const ogTitle = formData.get("og_title") as string
  const ogDescription = formData.get("og_description") as string
  const ogImage = formData.get("og_image") as string
  const twitterCard = formData.get("twitter_card") as string
  const canonicalOverride = formData.get("canonical_override") as string
  const noindex = formData.get("noindex") === "on"
  const nofollow = formData.get("nofollow") === "on"
  const jsonLdCustom = formData.get("json_ld_custom") as string

  if (!title?.trim() || !price?.trim() || !affiliateLink?.trim()) {
    return { error: "Title, price, and affiliate link are required" }
  }

  const slug = slugify(title)

  const { error } = await supabase
    .from("products")
    .update({
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      price: price.trim(),
      affiliate_link: affiliateLink.trim(),
      category_id: categoryId || null,
      featured,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
      meta_title: metaTitle?.trim() || null,
      meta_description: metaDescription?.trim() || null,
      og_title: ogTitle?.trim() || null,
      og_description: ogDescription?.trim() || null,
      og_image: ogImage?.trim() || null,
      twitter_card: twitterCard || "summary_large_image",
      canonical_override: canonicalOverride?.trim() || null,
      noindex,
      nofollow,
      json_ld_custom: jsonLdCustom?.trim() ? JSON.parse(jsonLdCustom) : null,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/admin/products/edit/" + id)
  revalidatePath("/")
  revalidatePath("/category/all")
  redirect("/admin/products")
}

export async function deleteProduct(
  _prevState: { success: boolean; error: string | null } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const id = formData.get("id") as string

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/")
  revalidatePath("/category/all")

  return { success: true, error: null }
}

// Wrapper function for useActionState
export async function updateProductAction(
  prevState: { error: string } | null,
  formData: FormData
) {
  const id = formData.get("id") as string
  if (!id) return { error: "Missing ID" }
  return updateProduct(id, { error: "" }, formData)
}