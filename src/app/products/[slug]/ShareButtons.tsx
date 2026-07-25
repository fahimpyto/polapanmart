"use client"

import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/products/${slug}`
    : `/products/${slug}`
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
      "_blank"
    )
  }

  function shareTelegram() {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank"
    )
  }

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-sm text-zinc-500">
        <Share2 className="mr-1 inline-block h-4 w-4" />
        Share:
      </span>
      <button
        onClick={copyLink}
        className="rounded-lg border border-zinc-300 p-2 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
      </button>
      <button
        onClick={shareWhatsApp}
        className="rounded-lg border border-zinc-300 p-2 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        title="Share on WhatsApp"
      >
        <span className="text-sm font-bold text-green-600">WA</span>
      </button>
      <button
        onClick={shareTelegram}
        className="rounded-lg border border-zinc-300 p-2 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        title="Share on Telegram"
      >
        <span className="text-sm font-bold text-blue-500">TG</span>
      </button>
    </div>
  )
}
