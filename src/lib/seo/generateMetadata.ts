import type { Metadata } from "next"
import type { Product, Category } from "@/types"

const BASE_URL = "https://polapanmart.vercel.app"

export interface SEOData {
  meta_title?: string | null
  meta_description?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  twitter_card?: string | null
  canonical_override?: string | null
  noindex?: boolean
  nofollow?: boolean
  json_ld_custom?: Record<string, unknown> | null
}

function getValue<T>(custom: T | undefined | null, fallback: T): T {
  return custom && custom !== "" ? custom : fallback
}

export function generateProductSEO(
  product: Product,
  seoData?: SEOData
): Metadata {
  const title = getValue(seoData?.meta_title, product.title)
  const description = getValue(
    seoData?.meta_description,
    product.description ?? product.title
  )
  const ogTitle = getValue(seoData?.og_title, title)
  const ogDescription = getValue(seoData?.og_description, description)
  const ogImage = getValue(seoData?.og_image, product.image_url ?? undefined)
  const twitterCard = getValue(seoData?.twitter_card, "summary_large_image")
  const canonicalUrl = seoData?.canonical_override ?? `${BASE_URL}/products/${product.slug}`

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "PolapanMart",
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : [],
      locale: "en_US",
    },
    twitter: {
      card: twitterCard as "summary_large_image" | "summary",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !seoData?.noindex,
      follow: !seoData?.nofollow,
    },
  }

  // Add custom JSON-LD if provided
  if (seoData?.json_ld_custom) {
    metadata.other = {
      ...metadata.other,
      "script:ld+json": JSON.stringify(seoData.json_ld_custom),
    }
  } else {
    // Default Product schema
    const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0
    metadata.other = {
      ...metadata.other,
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description ?? product.title,
        image: product.image_url ? [product.image_url] : [],
        sku: product.id,
        offers: {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: "BDT",
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "PolapanMart",
          },
        },
        brand: {
          "@type": "Brand",
          name: "PolapanMart",
        },
      }),
    }
  }

  return metadata
}

export function generateCategorySEO(
  category: Category,
  seoData?: SEOData
): Metadata {
  const title = getValue(seoData?.meta_title, category.name)
  const description = getValue(
    seoData?.meta_description,
    `Shop ${category.name} on PolapanMart. Curated deals updated daily.`
  )
  const ogTitle = getValue(seoData?.og_title, `${title} — PolapanMart`)
  const ogDescription = getValue(seoData?.og_description, description)
  const ogImage = seoData?.og_image
  const canonicalUrl = seoData?.canonical_override ?? `${BASE_URL}/category/${category.slug}`

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "PolapanMart",
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : [],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !seoData?.noindex,
      follow: !seoData?.nofollow,
    },
  }

  // Add ItemList schema for category pages
  metadata.other = {
    ...metadata.other,
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonicalUrl,
      mainEntity: {
        "@type": "ItemList",
        name: `${category.name} Products`,
        description,
      },
    }),
  }

  return metadata
}

export function generateHomepageSEO(siteData?: {
  site_name?: string
  default_og_image?: string
  meta_title?: string
  meta_description?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_handle?: string
  organization_schema?: Record<string, unknown>
}): Metadata {
  const siteName = siteData?.site_name ?? "PolapanMart"
  const title = getValue(siteData?.meta_title, "Discover Amazing Products")
  const description = getValue(
    siteData?.meta_description,
    "Curated deals updated daily. Find electronics, fashion, home goods, and more at great prices. Shop smart with PolapanMart."
  )
  const ogTitle = getValue(siteData?.og_title, `${siteName} — Best Deals & Products`)
  const ogDescription = getValue(siteData?.og_description, description)
  const ogImage = siteData?.og_image ?? siteData?.default_og_image
  const canonicalUrl = BASE_URL

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : [],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
      creator: siteData?.twitter_handle ? `@${siteData.twitter_handle}` : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "script:ld+json": [
        // Organization schema
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          url: BASE_URL,
          logo: `${BASE_URL}/logo.png`,
          sameAs: [],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "",
            contactType: "customer service",
            availableLanguage: ["English", "Bengali"],
          },
          ...siteData?.organization_schema,
        }),
        // WebSite schema with SearchAction
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: BASE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@id": `${BASE_URL}#organization`,
          },
        }),
      ],
    },
  }

  return metadata
}

export function generateSearchSEO(query: string): Metadata {
  const canonicalUrl = query
    ? `${BASE_URL}/search?q=${encodeURIComponent(query)}`
    : `${BASE_URL}/search`

  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for "${query}" on PolapanMart`
      : "Search products on PolapanMart",
    alternates: { canonical: canonicalUrl },
    robots: { index: false, follow: true },
    openGraph: {
      title: query ? `Search: ${query} — PolapanMart` : "Search — PolapanMart",
      description: query
        ? `Search results for "${query}" on PolapanMart`
        : "Search products on PolapanMart",
      url: canonicalUrl,
      siteName: "PolapanMart",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: query ? `Search: ${query}` : "Search",
      description: query
        ? `Search results for "${query}" on PolapanMart`
        : "Search products on PolapanMart",
    },
  }
}