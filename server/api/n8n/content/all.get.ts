export default defineEventHandler(async (event) => {
  try {
    // Get all content from Nuxt Content collections
    const [products, courses, articles, guides, knowledge, legal, stories] =
      await Promise.all([
        queryContent("products").find(),
        queryContent("courses").find(),
        queryContent("articles").find(),
        queryContent("guides").find(),
        queryContent("knowledge").find(),
        queryContent("legal").find(),
        queryContent("stories").find(),
      ]);

    // Format for RAG ingestion
    const allContent = [
      ...products.map((item) => ({
        id: item._id,
        type: "product",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          category: item.category,
          price: item.price,
          location: item.location,
          tags: item.tags,
          path: item._path,
        },
      })),
      ...courses.map((item) => ({
        id: item._id,
        type: "course",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          level: item.level,
          duration: item.duration,
          instructor: item.instructor,
          tags: item.tags,
          path: item._path,
        },
      })),
      ...articles.map((item) => ({
        id: item._id,
        type: "article",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          author: item.author,
          publishedAt: item.publishedAt,
          category: item.category,
          tags: item.tags,
          path: item._path,
        },
      })),
      ...guides.map((item) => ({
        id: item._id,
        type: "guide",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          difficulty: item.difficulty,
          timeToComplete: item.timeToComplete,
          category: item.category,
          tags: item.tags,
          path: item._path,
        },
      })),
      ...knowledge.map((item) => ({
        id: item._id,
        type: "knowledge",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          category: item.category,
          tags: item.tags,
          path: item._path,
        },
      })),
      ...legal.map((item) => ({
        id: item._id,
        type: "legal",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          category: item.category,
          lastUpdated: item.lastUpdated,
          path: item._path,
        },
      })),
      ...stories.map((item) => ({
        id: item._id,
        type: "story",
        title: item.title,
        content:
          item.body?.children
            ?.map((child: any) =>
              child.children?.map((c: any) => c.value).join(" ")
            )
            .join(" ") || item.description,
        metadata: {
          author: item.author,
          publishedAt: item.publishedAt,
          location: item.location,
          tags: item.tags,
          path: item._path,
        },
      })),
    ];

    return {
      success: true,
      data: allContent,
      timestamp: new Date().toISOString(),
      totalItems: allContent.length,
      collections: {
        products: products.length,
        courses: courses.length,
        articles: articles.length,
        guides: guides.length,
        knowledge: knowledge.length,
        legal: legal.length,
        stories: stories.length,
      },
    };
  } catch (error) {
    console.error("Error fetching content for n8n:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch content for RAG ingestion",
    });
  }
});
