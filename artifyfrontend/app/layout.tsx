import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artify.design"),
  title: {
    default: "Artify - Revolutionizing Graphic Design",
    template: "%s | Artify",
  },
  description:
    "Artify is dedicated to changing the graphic design landscape. We emphasize collaboration, cutting-edge techniques, and sustainable practices to create design solutions that make a positive impact.",
  keywords: [
    "graphic design",
    "artify",
    "design services",
    "brand identity",
    "UI/UX design",
    "Nigeria",
    "creative agency",
  ],
  authors: [{ name: "Artify Team" }],
  creator: "Artify",
  publisher: "Artify Creative Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://artify.design",
    siteName: "Artify",
    title: "Artify - Revolutionizing Graphic Design",
    description:
      "Transform your brand with cutting-edge graphic design. Collaboration, innovation, and sustainability in every project.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Artify - Creative Design Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artify - Revolutionizing Graphic Design",
    description:
      "Transform your brand with cutting-edge graphic design. Collaboration, innovation, and sustainability in every project.",
    creator: "@artifydesign",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env["GOOGLE_SITE_VERIFICATION"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <StructuredData />
        <Header />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
