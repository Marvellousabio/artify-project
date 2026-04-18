"use client";

import { useEffect, useState } from "react";

export default function StructuredData() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Artify",
    alternateName: "Artify Design Studio",
    url: "https://artify.design",
    logo: "https://artify.design/R.png",
    description:
      "Artify is dedicated to changing the graphic design landscape through collaboration, cutting-edge techniques, and sustainable practices.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Creative Lane, Suite 100",
      addressLocality: "Design City",
      addressRegion: "CA",
      postalCode: "90000",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      email: "hello@artifydesign.com",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://twitter.com/artifydesign",
      "https://linkedin.com/company/artify",
      "https://instagram.com/artifydesign",
    ],
    serviceArea: {
      "@type": "Place",
      name: "Nigeria",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NG",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Graphic Design Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Brand Identity Design",
            description:
              "Complete brand identity design including logo, color palette, typography, and brand guidelines.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UI/UX Design",
            description:
              "User interface and experience design for web and mobile applications.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Marketing Materials",
            description:
              "Design of marketing collateral including brochures, banners, social media graphics.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
