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
  verification: {
    google: "JDDFqH4rL2FuvsQSGsKD9s2LA2PokZHdf2K6sGjIqYk",
    other: {
      "msvalidate.01": "EAB04B17341B90952E31740B7781BD47",
      "p:domain_verify": "bcf5829448d5c0df3beadaf1f7ad62d4",
    },
  },
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
      <head>
        {/* Resource Hints */}
        <link rel="preconnect" href="https://polapanmart.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-blue-600 focus:shadow-xl"
        >
          Skip to main content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Toaster richColors closeButton />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
