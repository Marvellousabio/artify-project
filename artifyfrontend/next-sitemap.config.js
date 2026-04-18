/**
 * Next Sitemap Configuration
 * Generates sitemap.xml for search engines
 */

export default {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://artify.design",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
  },
  exclude: ["/admin/*", "/api/*"],
  transform: async (config, path) => {
    return {
      url: path,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: path === "/" ? 1 : 0.7,
    };
  },
};
