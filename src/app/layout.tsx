import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand, SITE_URL } from "@/content/site";
import "./globals.css";

/*
 * Fonts are self-hosted from the repo, so `next build` makes no network
 * request for them (next/font/google downloads at build time and crashed
 * the Hostinger build when Google returned an extensionless file URL).
 *
 * Both are the official variable files from github.com/google/fonts (ofl/),
 * renamed only to drop the brackets and comma from the file names:
 *   inter/Inter-Variable.ttf                      ← Inter[opsz,wght].ttf
 *   plus-jakarta-sans/PlusJakartaSans-Variable.ttf ← PlusJakartaSans[wght].ttf
 * Licence: SIL OFL 1.1, alongside each file as OFL.txt.
 *
 * Inter also has an optical-size axis; globals.css pins it with
 * `font-optical-sizing: none` so text renders as the Google-served Inter did.
 */
const display = localFont({
  src: "./fonts/plus-jakarta-sans/PlusJakartaSans-Variable.ttf",
  weight: "200 800",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "./fonts/inter/Inter-Variable.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kryptonix — Software, SEO, Google Ads & AI Automation for Business Growth",
    template: "%s | Kryptonix",
  },
  description:
    "Kryptonix builds custom software, drives targeted traffic with SEO and Google Ads, and automates operations with AI — including salon and gym management software — so your business gets more customers and revenue.",
  keywords: [
    "software development",
    "SEO services",
    "on-page SEO",
    "off-page SEO",
    "local SEO",
    "Google Ads",
    "AI automation",
    "web development",
    "business growth",
    "salon software",
    "gym management software",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Kryptonix Digital & AI Solutions",
    title: "Kryptonix — Build Better. Grow Faster. Scale Smarter.",
    description:
      "Software, SEO, Google Ads, AI automation and web development — one partner that builds the technology, brings the traffic and automates the work.",
    images: [
      {
        url: "/assets/hero-orbit.png",
        width: 1402,
        height: 1122,
        alt: "The Kryptonix growth system: software, SEO, ads, website, automation and growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kryptonix — Build Better. Grow Faster. Scale Smarter.",
    description:
      "Software, SEO, Google Ads, AI automation and web development that help businesses grow.",
    images: ["/assets/hero-orbit.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Kryptonix Digital & AI Solutions",
  url: SITE_URL,
  description:
    "Kryptonix builds software, drives traffic through SEO and Google Ads, automates operations with AI and creates growth systems for businesses.",
  areaServed: "Worldwide",
  email: brand.email,
  telephone: "+91 7004708826",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Anusha Villa, flat number G1, P. number 82 83 P, SP Colony, Moti Nagar",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500018",
    addressCountry: "IN",
  },
  makesOffer: [
    "Software Development",
    "SEO Growth",
    "Google Ads",
    "AI & Automation",
    "Web Development",
    "Business Growth",
    "Salon Growth Management Software",
    "Gym Management Software",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="kx-skip">
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
