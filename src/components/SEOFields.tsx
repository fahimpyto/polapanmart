"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"

interface SEOFieldsProps {
  prefix?: string
  defaultTwitterCard?: string
  defaultValues?: Record<string, string | boolean>
}

export function SEOFields({ prefix = "", defaultTwitterCard = "summary_large_image", defaultValues = {} }: SEOFieldsProps) {
  const [open, setOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  // Sync React state with native <details> open state
  useEffect(() => {
    const details = detailsRef.current
    if (!details) return

    const handleToggle = () => {
      setOpen(details.open)
    }

    details.addEventListener("toggle", handleToggle)
    return () => details.removeEventListener("toggle", handleToggle)
  }, [])

  const getDefault = (key: string, fallback: string | boolean = "") => {
    const prefixedKey = `${prefix}${key}`
    return defaultValues[prefixedKey] ?? fallback
  }

  const seoFields = [
    { id: `${prefix}meta_title`, label: "Meta Title", placeholder: "Custom meta title (max 60 chars)", maxLength: 60, defaultValue: getDefault("meta_title") },
    { id: `${prefix}meta_description`, label: "Meta Description", placeholder: "Custom meta description (max 160 chars)", maxLength: 160, textarea: true, defaultValue: getDefault("meta_description") },
    { id: `${prefix}og_title`, label: "OpenGraph Title", placeholder: "Custom OG title (falls back to meta title)", defaultValue: getDefault("og_title") },
    { id: `${prefix}og_description`, label: "OpenGraph Description", placeholder: "Custom OG description (falls back to meta description)", textarea: true, defaultValue: getDefault("og_description") },
    { id: `${prefix}og_image`, label: "OpenGraph Image URL", placeholder: "https://example.com/og-image.jpg", type: "url", defaultValue: getDefault("og_image") },
    { id: `${prefix}twitter_card`, label: "Twitter Card Type", placeholder: "summary_large_image", select: true, options: [
      { value: "summary_large_image", label: "Summary Large Image" },
      { value: "summary", label: "Summary" },
    ], defaultValue: getDefault("twitter_card", defaultTwitterCard) },
    { id: `${prefix}canonical_override`, label: "Canonical URL Override", placeholder: "https://polapanmart.vercel.app/products/...", type: "url", defaultValue: getDefault("canonical_override") },
    { id: `${prefix}noindex`, label: "Noindex", type: "checkbox", defaultValue: getDefault("noindex", false) },
    { id: `${prefix}nofollow`, label: "Nofollow", type: "checkbox", defaultValue: getDefault("nofollow", false) },
    { id: `${prefix}json_ld_custom`, label: "Custom JSON-LD (advanced)", placeholder: '{ "@context": "https://schema.org", "@type": "Product", ... }', textarea: true, fullWidth: true, defaultValue: getDefault("json_ld_custom") },
  ]

  return (
    <details ref={detailsRef} className="group border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
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
                  defaultValue={field.defaultValue as string}
                />
              ) : field.select ? (
                <Select
                  id={field.id}
                  name={field.id}
                  defaultValue={field.defaultValue as string}
                  options={field.options!}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.id}
                    name={field.id}
                    defaultChecked={field.defaultValue as boolean}
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
                  defaultValue={field.defaultValue as string}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </details>
  )
}