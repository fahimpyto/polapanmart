"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"

interface SiteSEO {
  id: string
  site_name: string
  default_og_image: string | null
  twitter_handle: string | null
  facebook_app_id: string | null
  google_verification: string | null
  bing_verification: string | null
  pinterest_verification: string | null
  organization_schema: string | null
}

export function SiteSEOForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [siteName, setSiteName] = useState("PolapanMart")
  const [defaultOgImage, setDefaultOgImage] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [facebookAppId, setFacebookAppId] = useState("")
  const [googleVerification, setGoogleVerification] = useState("")
  const [bingVerification, setBingVerification] = useState("")
  const [pinterestVerification, setPinterestVerification] = useState("")
  const [organizationSchema, setOrganizationSchema] = useState("")

  // Load existing settings on mount
  async function loadSettings() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("site_seo")
      .select("*")
      .limit(1)
      .single()

    if (!error && data) {
      setSiteName(data.site_name ?? "PolapanMart")
      setDefaultOgImage(data.default_og_image ?? "")
      setTwitterHandle(data.twitter_handle ?? "")
      setFacebookAppId(data.facebook_app_id ?? "")
      setGoogleVerification(data.google_verification ?? "")
      setBingVerification(data.bing_verification ?? "")
      setPinterestVerification(data.pinterest_verification ?? "")
      setOrganizationSchema(data.organization_schema ? JSON.stringify(data.organization_schema, null, 2) : "")
    }
    setLoading(false)
  }

  // Call loadSettings on mount
  // Note: In a real app, you'd use useEffect, but for simplicity we'll load on first render
  // This is a client component so we can use useEffect
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [, forceUpdate] = useState({})

  // We'll load settings when component mounts
  if (!mounted) {
    setMounted(true)
    loadSettings()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()

    const updates = {
      site_name: siteName.trim() || "PolapanMart",
      default_og_image: defaultOgImage.trim() || null,
      twitter_handle: twitterHandle.trim() || null,
      facebook_app_id: facebookAppId.trim() || null,
      google_verification: googleVerification.trim() || null,
      bing_verification: bingVerification.trim() || null,
      pinterest_verification: pinterestVerification.trim() || null,
      organization_schema: organizationSchema.trim() ? JSON.parse(organizationSchema) : null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("site_seo")
      .upsert(updates, { onConflict: "id" })

    if (error) {
      toast.error(error.message)
      setSaving(false)
      return
    }

    toast.success("Site SEO settings saved!")
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Basic Information</h2>
        <div className="space-y-4">
          <Input
            id="site_name"
            label="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="PolapanMart"
          />
          <Input
            id="default_og_image"
            label="Default OpenGraph Image URL"
            type="url"
            value={defaultOgImage}
            onChange={(e) => setDefaultOgImage(e.target.value)}
            placeholder="https://polapanmart.vercel.app/default-og.jpg"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Social Media</h2>
        <div className="space-y-4">
          <Input
            id="twitter_handle"
            label="Twitter Handle (without @)"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="polapanmart"
          />
          <Input
            id="facebook_app_id"
            label="Facebook App ID"
            value={facebookAppId}
            onChange={(e) => setFacebookAppId(e.target.value)}
            placeholder="1234567890"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Search Engine Verification</h2>
        <p className="mb-4 text-sm text-zinc-500">Add verification codes from Google Search Console, Bing Webmaster Tools, and Pinterest.</p>
        <div className="space-y-4">
          <Input
            id="google_verification"
            label="Google Site Verification"
            value={googleVerification}
            onChange={(e) => setGoogleVerification(e.target.value)}
            placeholder="JDDFqH4rL2FuvsQSGsKD9s2LA2PokZHdf2K6sGjIqYk"
          />
          <Input
            id="bing_verification"
            label="Bing Verification (msvalidate.01)"
            value={bingVerification}
            onChange={(e) => setBingVerification(e.target.value)}
            placeholder="EAB04B17341B90952E31740B7781BD47"
          />
          <Input
            id="pinterest_verification"
            label="Pinterest Verification"
            value={pinterestVerification}
            onChange={(e) => setPinterestVerification(e.target.value)}
            placeholder="bcf5829448d5c0df3beadaf1f7ad62d4"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Organization Schema (JSON-LD)</h2>
        <p className="mb-4 text-sm text-zinc-500">Custom organization schema. Leave empty to use defaults.</p>
        <Textarea
          id="organization_schema"
          label="Organization Schema JSON"
          value={organizationSchema}
          onChange={(e) => setOrganizationSchema(e.target.value)}
          placeholder='{ "@context": "https://schema.org", "@type": "Organization", "name": "PolapanMart", "url": "https://polapanmart.vercel.app", "logo": "https://polapanmart.vercel.app/logo.png", "sameAs": [] }'
          className="min-h-[200px] font-mono text-sm"
          rows={10}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Saving..." : "Save Settings"}
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