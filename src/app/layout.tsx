import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuantumByte | Free Online Tools",
  description:
    "Free, fast, and simple tools — video downloader, JSON formatter, password generator, image compressor, and more. No sign-ups, no fluff.",
  keywords: [
    "online tools",
    "video downloader",
    "json formatter",
    "password generator",
    "image compressor",
    "pdf tools",
    "url shortener",
    "qr code generator",
    "free tools",
    "developer tools",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "QuantumByte | Free Online Tools",
    description:
      "Free, fast, and simple tools built to make your life easier. Try them instantly — no sign-ups required.",
    url: "https://quantumbyte.app",
    siteName: "QuantumByte",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://quantumbyte.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuantumByte — Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantumByte | Free Online Tools",
    description:
      "Free, fast, and simple tools built to make your life easier.",
    images: ["https://quantumbyte.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://quantumbyte.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QuantumByte",
  url: "https://quantumbyte.app",
  description:
    "Free, fast, and simple tools — video downloader, JSON formatter, password generator, and more.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
