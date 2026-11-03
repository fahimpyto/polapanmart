import { ProductCard } from "./ProductCard"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  priorityCount?: number
}

export function ProductGrid({ products, priorityCount = 0 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-500">
        No products found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  )
}
