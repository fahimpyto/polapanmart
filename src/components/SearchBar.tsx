"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full h-10 rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
    </form>
  )
}
