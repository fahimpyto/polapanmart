import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
        {product.featured && (
          <Badge className="absolute left-2 top-2">Featured</Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium">{product.title}</h3>
        <p className="mt-1 text-sm font-bold text-blue-600">
          {product.price}
        </p>
      </div>
    </Link>
  )
}
