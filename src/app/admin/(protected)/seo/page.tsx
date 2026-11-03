import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteSEOForm } from "./SiteSEOForm"

async function getSiteSEO() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("site_seo")
    .select("*")
    .limit(1)
    .single()
  return data
}

export default async function AdminSEOPage() {
  const siteSEO = await getSiteSEO()

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Site SEO Settings</h1>
      <p className="mb-8 text-zinc-500">
        Configure global SEO settings for the entire site. These values are used as fallbacks when
        page-specific SEO fields are not set.
      </p>
      <SiteSEOForm initialData={siteSEO} />
    </div>
  )
}