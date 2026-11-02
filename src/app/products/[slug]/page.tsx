import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"

import { Badge } from "@/components/ui/Badge"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { BuyNowButton } from "./BuyNowButton"
import { ShareButtons } from "./ShareButtons"
import type { Metadata } from "next"
import type { Product } from "@/types"

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("active", true)
    .single()
  return data as Product | null
}

function generateProductSchema(product: Product, baseUrl: string) {
  const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? product.title,
    image: product.image_url ? [product.image_url] : [],
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
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
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Not Found" }

  const canonicalUrl = `https://polapanmart.vercel.app/products/${slug}`

  return {
    title: product.title,
    description: product.description ?? product.title,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
      url: canonicalUrl,
    },
    other: {
      "script:ld+json": JSON.stringify(generateProductSchema(product, "https://polapanmart.vercel.app")),
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: product.categories?.name ?? "Products", href: product.categories ? `/category/${product.categories.slug}` : "/category/all" },
    { label: product.title },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400 text-lg">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-4">
          {product.featured && <Badge className="w-fit">Featured</Badge>}

          <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {"★★★★★".split("").map((star, i) => (
              <span key={i} className="text-lg">{star}</span>
            ))}
          </div>

          <p className="text-3xl font-bold text-blue-600">
            {product.price}
          </p>

          {product.description && (
            <div className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </div>
          )}

          {product.categories && (
            <Link
              href={`/category/${product.categories.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {product.categories.name}
            </Link>
          )}

          <BuyNowButton productId={product.id} affiliateLink={product.affiliate_link} />

          <ShareButtons
            title={product.title}
            slug={product.slug}
          />
        </div>
      </div>
    </div>
  )
}
