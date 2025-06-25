import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    // 🛒 Marketplace Products
    products: defineCollection({
      name: "products",
      pattern: "products/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.enum([
          "seeds",
          "tools",
          "fertilizers",
          "equipment",
          "organic",
        ]),
        images: z.array(z.string()).optional(),
        vendor: z.string(),
        stock: z.number().optional(),
        region: z
          .enum([
            "SAVA",
            "Alaotra-Mangoro",
            "Analamanga",
            "Atsinanana",
            "Boeny",
            "All",
          ])
          .optional(),
        featured: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        specifications: z.record(z.string()).optional(),
        availability: z
          .enum(["in-stock", "out-of-stock", "pre-order"])
          .default("in-stock"),
        publishedAt: z.date().optional(),
      }),
    }),

    // 📚 Learning Courses
    courses: defineCollection({
      name: "courses",
      pattern: "courses/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        instructor: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        duration: z.string(), // e.g., "4 weeks", "2 hours"
        category: z.enum([
          "crop-management",
          "livestock",
          "pest-control",
          "soil-health",
          "marketing",
          "climate",
        ]),
        language: z.enum(["fr", "mg"]).default("fr"),
        price: z.number().optional(),
        featured: z.boolean().optional(),
        thumbnail: z.string().optional(),
        objectives: z.array(z.string()),
        prerequisites: z.array(z.string()).optional(),
        modules: z
          .array(
            z.object({
              title: z.string(),
              duration: z.string(),
              content: z.string().optional(),
            })
          )
          .optional(),
        certificate: z.boolean().default(false),
        publishedAt: z.date().optional(),
      }),
    }),

    // 📰 Community Articles & Blog Posts
    articles: defineCollection({
      name: "articles",
      pattern: "articles/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        category: z.enum([
          "news",
          "tips",
          "success-stories",
          "research",
          "market-updates",
          "weather",
        ]),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        image: z.string().optional(),
        region: z
          .enum([
            "SAVA",
            "Alaotra-Mangoro",
            "Analamanga",
            "Atsinanana",
            "Boeny",
            "All",
          ])
          .optional(),
        readTime: z.string().optional(), // e.g., "5 min read"
        language: z.enum(["fr", "mg"]).default("fr"),
        publishedAt: z.date().optional(),
        updatedAt: z.date().optional(),
      }),
    }),

    // 📖 Agricultural Guides & Documentation
    guides: defineCollection({
      name: "guides",
      pattern: "guides/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum([
          "planting",
          "harvesting",
          "pest-management",
          "soil-care",
          "irrigation",
          "storage",
          "marketing",
        ]),
        crop: z
          .enum([
            "rice",
            "vanilla",
            "clove",
            "coffee",
            "cocoa",
            "maize",
            "cassava",
            "general",
          ])
          .optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        season: z.enum(["rainy", "dry", "year-round"]).optional(),
        region: z
          .enum([
            "SAVA",
            "Alaotra-Mangoro",
            "Analamanga",
            "Atsinanana",
            "Boeny",
            "All",
          ])
          .optional(),
        tools: z.array(z.string()).optional(),
        materials: z.array(z.string()).optional(),
        duration: z.string().optional(), // e.g., "2 hours", "1 day"
        featured: z.boolean().optional(),
        language: z.enum(["fr", "mg"]).default("fr"),
        publishedAt: z.date().optional(),
      }),
    }),

    // 🤖 AI Assistant Knowledge Base
    knowledge: defineCollection({
      name: "knowledge",
      pattern: "knowledge/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        category: z.enum([
          "crops",
          "livestock",
          "weather",
          "diseases",
          "pests",
          "fertilizers",
          "market-prices",
        ]),
        keywords: z.array(z.string()),
        crop: z
          .enum([
            "rice",
            "vanilla",
            "clove",
            "coffee",
            "cocoa",
            "maize",
            "cassava",
            "general",
          ])
          .optional(),
        region: z
          .enum([
            "SAVA",
            "Alaotra-Mangoro",
            "Analamanga",
            "Atsinanana",
            "Boeny",
            "All",
          ])
          .optional(),
        confidence: z.number().min(0).max(1).optional(), // AI confidence score
        sources: z.array(z.string()).optional(),
        lastVerified: z.date().optional(),
        language: z.enum(["fr", "mg"]).default("fr"),
      }),
    }),

    // 📄 Legal & Documentation Pages
    legal: defineCollection({
      name: "legal",
      pattern: "legal/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        type: z.enum(["terms", "privacy", "cookies", "disclaimer", "about"]),
        version: z.string().optional(),
        effectiveDate: z.date().optional(),
        language: z.enum(["fr", "mg"]).default("fr"),
        lastUpdated: z.date().optional(),
      }),
    }),

    // 🎉 Success Stories & Testimonials
    stories: defineCollection({
      name: "stories",
      pattern: "stories/**/*.md",
      type: "page",
      schema: z.object({
        title: z.string(),
        farmer: z.object({
          name: z.string(),
          location: z.string(),
          crop: z.string().optional(),
          experience: z.string().optional(),
        }),
        story: z.string(),
        results: z
          .object({
            yield_increase: z.string().optional(),
            income_increase: z.string().optional(),
            time_saved: z.string().optional(),
          })
          .optional(),
        image: z.string().optional(),
        featured: z.boolean().optional(),
        publishedAt: z.date().optional(),
        language: z.enum(["fr", "mg"]).default("fr"),
      }),
    }),
  },
});
