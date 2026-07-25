"use client"

import Link from "next/link"
import { SearchBar } from "./SearchBar"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-pink-600"
        >
          PolapanMart
        </Link>

        <div className="hidden md:flex md:items-center md:gap-4">
          <SearchBar />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-200 px-4 pb-4 pt-2 md:hidden dark:border-zinc-800">
          <SearchBar />
        </div>
      )}
    </header>
  )
}
