"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateSiteSEO(
  _prevState: { error: string | null; success: boolean } | null,
  formData: FormData
) {
  const supabase = createAdminClient()

  const id = formData.get("id") as string
  const siteName = formData.get("site_name") as string
  const defaultOgImage = formData.get("default_og_image") as string
  const twitterHandle = formData.get("twitter_handle") as string
  const facebookAppId = formData.get("facebook_app_id") as string
  const googleVerification = formData.get("google_verification") as string
  const bingVerification = formData.get("bing_verification") as string
  const pinterestVerification = formData.get("pinterest_verification") as string
  const organizationSchema = formData.get("organization_schema") as string

  const updates: Record<string, unknown> = {
    site_name: siteName?.trim() || "PolapanMart",
    default_og_image: defaultOgImage?.trim() || null,
    twitter_handle: twitterHandle?.trim() || null,
    facebook_app_id: facebookAppId?.trim() || null,
    google_verification: googleVerification?.trim() || null,
    bing_verification: bingVerification?.trim() || null,
    pinterest_verification: pinterestVerification?.trim() || null,
    organization_schema: organizationSchema?.trim() ? JSON.parse(organizationSchema) : null,
    updated_at: new Date().toISOString(),
  }

  // If ID provided, include it for upsert on existing row
  if (id) {
    updates.id = id
  }

  const { error } = await supabase.from("site_seo").upsert(updates, { onConflict: "id" })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/admin/seo")
  revalidatePath("/")

  return { success: true, error: null }
}