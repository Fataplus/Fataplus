/*
import { queryContent } from "#imports";

export const useFataplusContent = () => {
  // ====== PRODUCTS ======
  const getProducts = async (
    options: {
      category?: string;
      region?: string;
      featured?: boolean;
      limit?: number;
      sort?: string;
    } = {}
  ) => {
    let query = queryContent("products");

    if (options.category) {
      query = query.where("category", options.category);
    }
    if (options.region) {
      query = query.where("region", options.region);
    }
    if (options.featured) {
      query = query.where("featured", true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.sort) {
      query = query.sort({ [options.sort]: -1 });
    }

    return await query.find();
  };

  const getProduct = async (slug: string) => {
    return await queryContent("products")
      .where("_path", `/products/${slug}`)
      .findOne();
  };

  const getFeaturedProducts = async (limit = 6) => {
    return await getProducts({ featured: true, limit, sort: "publishedAt" });
  };

  // ====== COURSES ======
  const getCourses = async (
    options: {
      level?: string;
      category?: string;
      featured?: boolean;
      limit?: number;
    } = {}
  ) => {
    let query = queryContent("courses");

    if (options.level) {
      query = query.where("level", options.level);
    }
    if (options.category) {
      query = query.where("category", options.category);
    }
    if (options.featured) {
      query = query.where("featured", true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.find();
  };

  const getCourse = async (slug: string) => {
    return await queryContent("courses")
      .where("_path", `/courses/${slug}`)
      .findOne();
  };

  const getFeaturedCourses = async (limit = 3) => {
    return await getCourses({ featured: true, limit });
  };

  // ====== ARTICLES ======
  const getArticles = async (
    options: {
      category?: string;
      author?: string;
      region?: string;
      featured?: boolean;
      limit?: number;
    } = {}
  ) => {
    let query = queryContent("articles").sort({ publishedAt: -1 });

    if (options.category) {
      query = query.where("category", options.category);
    }
    if (options.author) {
      query = query.where("author", options.author);
    }
    if (options.region) {
      query = query.where("region", options.region);
    }
    if (options.featured) {
      query = query.where("featured", true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.find();
  };

  const getArticle = async (slug: string) => {
    return await queryContent("articles")
      .where("_path", `/articles/${slug}`)
      .findOne();
  };

  const getFeaturedArticles = async (limit = 6) => {
    return await getArticles({ featured: true, limit });
  };

  // ====== GUIDES ======
  const getGuides = async (
    options: {
      category?: string;
      crop?: string;
      difficulty?: string;
      region?: string;
      featured?: boolean;
      limit?: number;
    } = {}
  ) => {
    let query = queryContent("guides");

    if (options.category) {
      query = query.where("category", options.category);
    }
    if (options.crop) {
      query = query.where("crop", options.crop);
    }
    if (options.difficulty) {
      query = query.where("difficulty", options.difficulty);
    }
    if (options.region) {
      query = query.where("region", options.region);
    }
    if (options.featured) {
      query = query.where("featured", true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.find();
  };

  const getGuide = async (slug: string) => {
    return await queryContent("guides")
      .where("_path", `/guides/${slug}`)
      .findOne();
  };

  const getFeaturedGuides = async (limit = 4) => {
    return await getGuides({ featured: true, limit });
  };

  // ====== LEGAL PAGES ======
  const getLegalPage = async (type: string) => {
    return await queryContent("legal").where("type", type).findOne();
  };

  // ====== HOMEPAGE CONTENT ======
  const getHomepageContent = async () => {
    const [featuredProducts, featuredCourses, latestArticles, featuredGuides] =
      await Promise.all([
        getFeaturedProducts(6),
        getFeaturedCourses(3),
        getArticles({ limit: 6 }),
        getFeaturedGuides(4),
      ]);

    return {
      featuredProducts,
      featuredCourses,
      latestArticles,
      featuredGuides,
    };
  };

  return {
    // Products
    getProducts,
    getProduct,
    getFeaturedProducts,

    // Courses
    getCourses,
    getCourse,
    getFeaturedCourses,

    // Articles
    getArticles,
    getArticle,
    getFeaturedArticles,

    // Guides
    getGuides,
    getGuide,
    getFeaturedGuides,

    // Legal
    getLegalPage,

    // Homepage
    getHomepageContent,
  };
};
*/
