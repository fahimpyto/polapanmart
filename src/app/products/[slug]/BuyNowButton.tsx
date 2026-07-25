"use client"

import { useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"

interface BuyNowButtonProps {
  productId: string
  affiliateLink: string
}

export function BuyNowButton({ productId, affiliateLink }: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      })
    } catch {
    }
    window.open(affiliateLink, "_blank", "noopener,noreferrer")
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ExternalLink className="h-5 w-5" />
      )}
      BUY NOW
    </button>
  )
}
