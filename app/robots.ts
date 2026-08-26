import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/", "/comasy/dashboard/"],
    },
    sitemap: "https://konfydence.com/sitemap.xml",
    host: "https://konfydence.com",
  };
}
