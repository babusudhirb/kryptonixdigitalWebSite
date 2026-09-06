import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://www.kryptonix.com";

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
  email: "hello@kryptonix.com",
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
