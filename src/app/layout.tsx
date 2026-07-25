import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "PolapanMart — Best Deals & Products",
    template: "%s — PolapanMart",
  },
  description: "Discover amazing products at great prices. Curated deals updated daily.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
