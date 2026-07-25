import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-zinc-500">
        <Link href="/" className="font-bold text-pink-600">
          PolapanMart
        </Link>
        <p>Affiliate links — we may earn a commission at no extra cost to you.</p>
        <p>&copy; {new Date().getFullYear()} PolapanMart. All rights reserved.</p>
      </div>
    </footer>
  )
}
