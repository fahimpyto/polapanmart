"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"

interface SEOFieldsProps {
  prefix?: string
  defaultTwitterCard?: string
}

export function SEOFields({ prefix = "", defaultTwitterCard = "summary_large_image" }: SEOFieldsProps) {
  const [open, setOpen] = useState(false)

  const seoFields = [
    { id: `${prefix}meta_title`, label: "Meta Title", placeholder: "Custom meta title (max 60 chars)", maxLength: 60 },
    { id: `${prefix}meta_description`, label: "Meta Description", placeholder: "Custom meta description (max 160 chars)", maxLength: 160, textarea: true },
    { id: `${prefix}og_title`, label: "OpenGraph Title", placeholder: "Custom OG title (falls back to meta title)" },
    { id: `${prefix}og_description`, label: "OpenGraph Description", placeholder: "Custom OG description (falls back to meta description)", textarea: true },
    { id: `${prefix}og_image`, label: "OpenGraph Image URL", placeholder: "https://example.com/og-image.jpg", type: "url" },
    { id: `${prefix}twitter_card`, label: "Twitter Card Type", placeholder: "summary_large_image", select: true, options: [
      { value: "summary_large_image", label: "Summary Large Image" },
      { value: "summary", label: "Summary" },
    ], defaultValue: defaultTwitterCard },
    { id: `${prefix}canonical_override`, label: "Canonical URL Override", placeholder: "https://polapanmart.vercel.app/products/...", type: "url" },
    { id: `${prefix}noindex`, label: "Noindex", type: "checkbox" },
    { id: `${prefix}nofollow`, label: "Nofollow", type: "checkbox" },
    { id: `${prefix}json_ld_custom`, label: "Custom JSON-LD (advanced)", placeholder: '{ "@context": "https://schema.org", "@type": "Product", ... }', textarea: true, fullWidth: true },
  ]

  return (
    <details className="group border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none bg-zinc-50 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">SEO Settings</h3>
        <div className="flex items-center gap-2 text-zinc-500">
          {open ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
          <span className="text-xs font-mono uppercase tracking-wider">
            {open ? "Hide" : "Show"} Advanced
          </span>
        </div>
      </summary>

      <div className={open ? "animate-in fade-in slide-in-from-top-2 duration-200" : "hidden"}>
        <div className="p-4 space-y-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            Leave empty to auto-generate from product data. Custom values override defaults.
          </p>

          {seoFields.map((field) => (
            <div key={field.id} className={field.fullWidth ? "" : "sm:grid sm:grid-cols-2 sm:gap-4"}>
              <Label htmlFor={field.id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                {field.label}
              </Label>

              {field.textarea ? (
                <Textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="min-h-[80px] font-mono text-sm"
                  rows={3}
                />
              ) : field.select ? (
                <Select
                  id={field.id}
                  name={field.id}
                  defaultValue={field.defaultValue}
                  options={field.options!}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.id}
                    name={field.id}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
                    Enable {field.label.toLowerCase()}
                  </Label>
                </div>
              ) : (
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </details>
  )
}