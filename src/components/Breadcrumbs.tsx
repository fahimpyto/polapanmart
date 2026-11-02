"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://polapanmart.vercel.app${item.href}` : undefined,
    })),
  }

  return (
    <>
      <nav className="mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-zinc-500">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-400" aria-hidden="true" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-900 dark:text-zinc-100 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://polapanmart.vercel.app${item.href}` : undefined,
    })),
  }
}