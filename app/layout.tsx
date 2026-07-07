import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://c9x.thec9group.com"),
  title: {
    default: "C9X | Nigeria's Premier Automotive Marketplace",
    template: "%s | C9X Marketplace",
  },
  description: "The most trusted ecosystem for buying and selling cars, participating in live auctions, and finding elite automotive services in Nigeria.",
  keywords: ["Cars", "Auctions", "Nigeria", "Automotive", "Buy Cars", "Sell Cars", "C9X"],
  authors: [{ name: "C9X Protocol" }],
  openGraph: {
    title: "C9X | Nigeria's Premier Automotive Marketplace",
    description: "Connect with verified buyers and sellers in Nigeria’s most trusted automotive ecosystem.",
    url: "https://c9x.thec9group.com",
    siteName: "C9X",
    images: [
      {
        url: "/hero-dashboard.png",
        width: 1200,
        height: 630,
        alt: "C9X Dashboard Overview",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "C9X | Nigeria's Premier Automotive Marketplace",
    description: "The most trusted ecosystem for buying and selling cars and auctions in Nigeria.",
    images: ["/hero-dashboard.png"],
  },
  icons: {
    icon: '/c9x-logo.png',
    shortcut: '/c9x-logo.png',
    apple: '/c9x-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://c9x.thec9group.com/#organization",
                  "name": "C9X",
                  "url": "https://c9x.thec9group.com",
                  "logo": "https://c9x.thec9group.com/c9x-logo.png",
                  "sameAs": [
                    "https://www.instagram.com/c9x_ng/",
                    "https://twitter.com/c9x_ng"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://c9x.thec9group.com/#website",
                  "url": "https://c9x.thec9group.com",
                  "name": "C9X Marketplace",
                  "publisher": {
                    "@id": "https://c9x.thec9group.com/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://c9x.thec9group.com/marketplace?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
