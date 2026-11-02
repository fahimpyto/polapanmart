import Link from "next/link"
import { Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold text-blue-600">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/category/all"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Search className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Or try searching for what you need:
      </p>
      <form action="/search" className="mt-4 flex max-w-md mx-auto gap-2">
        <input
          type="search"
          name="q"
          placeholder="Search products..."
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
