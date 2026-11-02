import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const baseUrl = "https://polapanmart.vercel.app"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PolapanMart",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "",
    contactType: "customer service",
    availableLanguage: ["English", "Bengali"],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PolapanMart",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export const metadata: Metadata = {
  title: {
    default: "PolapanMart — Best Deals & Products",
    template: "%s — PolapanMart",
  },
  description: "Discover amazing products at great prices. Curated deals updated daily.",
  other: {
    "script:ld+json": [JSON.stringify(organizationSchema), JSON.stringify(websiteSchema)],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  themeColor: "#2563eb",
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
        <SpeedInsights />
      </body>
    </html>
  )
}
