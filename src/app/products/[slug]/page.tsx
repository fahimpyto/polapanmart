import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Not Found" }

  return {
    title: product.title,
    description: product.description ?? `${product.title} — ${formatPrice(product.price)}`,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
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

          <p className="text-3xl font-bold text-pink-600">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          )}

          {product.categories && (
            <Link
              href={`/category/${product.categories.slug}`}
              className="text-sm text-pink-600 hover:underline"
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
