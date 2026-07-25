import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-pink-600">404</h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400">
        Page not found
      </p>
      <Link
        href="/"
        className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700"
      >
        Go home
      </Link>
    </div>
  )
}
