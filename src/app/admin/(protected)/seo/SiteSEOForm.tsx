"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"
import { updateSiteSEO } from "@/actions/site-seo"

interface SiteSEOData {
  id?: string
  site_name?: string
  default_og_image?: string | null
  twitter_handle?: string | null
  facebook_app_id?: string | null
  google_verification?: string | null
  bing_verification?: string | null
  pinterest_verification?: string | null
  organization_schema?: string | null
}

interface SiteSEOFormProps {
  initialData?: SiteSEOData | null
}

export function SiteSEOForm({ initialData }: SiteSEOFormProps) {
  const router = useRouter()
  const [formState, formAction, isPending] = useActionState(updateSiteSEO, { error: "", success: false })

  const siteName = initialData?.site_name ?? "PolapanMart"
  const defaultOgImage = initialData?.default_og_image ?? ""
  const twitterHandle = initialData?.twitter_handle ?? ""
  const facebookAppId = initialData?.facebook_app_id ?? ""
  const googleVerification = initialData?.google_verification ?? ""
  const bingVerification = initialData?.bing_verification ?? ""
  const pinterestVerification = initialData?.pinterest_verification ?? ""
  const organizationSchema = initialData?.organization_schema
    ? JSON.stringify(initialData.organization_schema, null, 2)
    : ""

  // Show success toast when save completes
  if (formState.success) {
    toast.success("Site SEO settings saved!")
  }

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      {/* Include existing ID so upsert updates the same row */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Basic Information</h2>
        <div className="space-y-4">
          <Input
            id="site_name"
            name="site_name"
            label="Site Name"
            defaultValue={siteName}
            placeholder="PolapanMart"
          />
          <Input
            id="default_og_image"
            name="default_og_image"
            label="Default OpenGraph Image URL"
            type="url"
            defaultValue={defaultOgImage}
            placeholder="https://polapanmart.vercel.app/default-og.jpg"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Social Media</h2>
        <div className="space-y-4">
          <Input
            id="twitter_handle"
            name="twitter_handle"
            label="Twitter Handle (without @)"
            defaultValue={twitterHandle}
            placeholder="polapanmart"
          />
          <Input
            id="facebook_app_id"
            name="facebook_app_id"
            label="Facebook App ID"
            defaultValue={facebookAppId}
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
            name="google_verification"
            label="Google Site Verification"
            defaultValue={googleVerification}
            placeholder="JDDFqH4rL2FuvsQSGsKD9s2LA2PokZHdf2K6sGjIqYk"
          />
          <Input
            id="bing_verification"
            name="bing_verification"
            label="Bing Verification (msvalidate.01)"
            defaultValue={bingVerification}
            placeholder="EAB04B17341B90952E31740B7781BD47"
          />
          <Input
            id="pinterest_verification"
            name="pinterest_verification"
            label="Pinterest Verification"
            defaultValue={pinterestVerification}
            placeholder="bcf5829448d5c0df3beadaf1f7ad62d4"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Organization Schema (JSON-LD)</h2>
        <p className="mb-4 text-sm text-zinc-500">Custom organization schema. Leave empty to use defaults.</p>
        <Textarea
          id="organization_schema"
          name="organization_schema"
          label="Organization Schema JSON"
          defaultValue={organizationSchema}
          placeholder='{ "@context": "https://schema.org", "@type": "Organization", "name": "PolapanMart", "url": "https://polapanmart.vercel.app", "logo": "https://polapanmart.vercel.app/logo.png", "sameAs": [] }'
          className="min-h-[200px] font-mono text-sm"
          rows={10}
        />
      </div>

      {formState.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {formState.error}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Settings"}
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