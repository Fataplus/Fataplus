import { sql } from 'drizzle-orm'
import { integer, text, sqliteTable, real, blob } from 'drizzle-orm/sqlite-core'

// Fonction utilitaire pour générer des IDs
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ================================
// TABLES UTILISATEURS & AUTH
// ================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  password: text('password'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  avatar: text('avatar'),
  bio: text('bio'),
  location: text('location'),
  role: text('role', { enum: ['admin', 'farmer', 'buyer', 'mentor', 'trainer', 'delivery'] }).notNull().default('farmer'),
  status: text('status', { enum: ['active', 'inactive', 'banned'] }).notNull().default('active'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false),
  preferences: text('preferences', { mode: 'json' }),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  farmSize: real('farm_size'),
  farmType: text('farm_type'),
  crops: text('crops', { mode: 'json' }),
  experience: integer('experience'),
  certifications: text('certifications', { mode: 'json' }),
  skills: text('skills', { mode: 'json' }),
  languages: text('languages', { mode: 'json' }),
  socialLinks: text('social_links', { mode: 'json' }),
  badges: text('badges', { mode: 'json' }),
  points: integer('points').default(0),
  level: integer('level').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

// ================================
// TABLES MARKETPLACE
// ================================

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  image: text('image'),
  parentId: text('parent_id').references(() => categories.id),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  sellerId: text('seller_id').notNull().references(() => users.id),
  categoryId: text('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  images: text('images', { mode: 'json' }),
  price: real('price').notNull(),
  comparePrice: real('compare_price'),
  cost: real('cost'),
  sku: text('sku'),
  barcode: text('barcode'),
  trackQuantity: integer('track_quantity', { mode: 'boolean' }).default(true),
  quantity: integer('quantity').default(0),
  allowBackorder: integer('allow_backorder', { mode: 'boolean' }).default(false),
  weight: real('weight'),
  dimensions: text('dimensions', { mode: 'json' }),
  origin: text('origin'),
  harvestDate: integer('harvest_date', { mode: 'timestamp' }),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  organic: integer('organic', { mode: 'boolean' }).default(false),
  certifications: text('certifications', { mode: 'json' }),
  nutrients: text('nutrients', { mode: 'json' }),
  status: text('status', { enum: ['draft', 'active', 'inactive', 'archived'] }).default('draft'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  tags: text('tags', { mode: 'json' }),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  salesCount: integer('sales_count').default(0),
  viewCount: integer('view_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku'),
  price: real('price').notNull(),
  comparePrice: real('compare_price'),
  quantity: integer('quantity').default(0),
  weight: real('weight'),
  image: text('image'),
  attributes: text('attributes', { mode: 'json' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const carts = sqliteTable('carts', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').references(() => users.id),
  sessionId: text('session_id'),
  items: text('items', { mode: 'json' }),
  subtotal: real('subtotal').default(0),
  tax: real('tax').default(0),
  shipping: real('shipping').default(0),
  total: real('total').default(0),
  currency: text('currency').default('MGA'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  orderNumber: text('order_number').unique().notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status', { 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] 
  }).notNull().default('pending'),
  paymentStatus: text('payment_status', { 
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'] 
  }).notNull().default('pending'),
  paymentMethod: text('payment_method', { 
    enum: ['cash', 'mobile_money', 'bank_transfer', 'card', 'crypto'] 
  }),
  items: text('items', { mode: 'json' }),
  subtotal: real('subtotal').notNull(),
  tax: real('tax').default(0),
  shipping: real('shipping').default(0),
  discount: real('discount').default(0),
  total: real('total').notNull(),
  currency: text('currency').default('MGA'),
  shippingAddress: text('shipping_address', { mode: 'json' }),
  billingAddress: text('billing_address', { mode: 'json' }),
  deliveryMethod: text('delivery_method', { enum: ['home', 'pickup', 'relay'] }).default('home'),
  deliveryDate: integer('delivery_date', { mode: 'timestamp' }),
  deliverySlot: text('delivery_slot'),
  notes: text('notes'),
  trackingNumber: text('tracking_number'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').references(() => products.id),
  orderId: text('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: text('title'),
  comment: text('comment'),
  images: text('images', { mode: 'json' }),
  helpful: integer('helpful').default(0),
  verified: integer('verified', { mode: 'boolean' }).default(false),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

// ================================
// TABLES FORMATION/LMS
// ================================

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  instructorId: text('instructor_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  thumbnail: text('thumbnail'),
  trailer: text('trailer'),
  level: text('level', { enum: ['beginner', 'intermediate', 'advanced'] }).default('beginner'),
  language: text('language').default('fr'),
  duration: integer('duration'),
  price: real('price').default(0),
  currency: text('currency').default('MGA'),
  tags: text('tags', { mode: 'json' }),
  objectives: text('objectives', { mode: 'json' }),
  requirements: text('requirements', { mode: 'json' }),
  targetAudience: text('target_audience', { mode: 'json' }),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  certificate: integer('certificate', { mode: 'boolean' }).default(false),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  enrollmentCount: integer('enrollment_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  content: text('content'),
  type: text('type', { enum: ['video', 'text', 'quiz', 'assignment', 'live'] }).notNull(),
  videoUrl: text('video_url'),
  duration: integer('duration'),
  resources: text('resources', { mode: 'json' }),
  sortOrder: integer('sort_order').default(0),
  isPreview: integer('is_preview', { mode: 'boolean' }).default(false),
  isRequired: integer('is_required', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  questions: text('questions', { mode: 'json' }),
  timeLimit: integer('time_limit'),
  passingScore: integer('passing_score').default(70),
  maxAttempts: integer('max_attempts').default(3),
  showResults: integer('show_results', { mode: 'boolean' }).default(true),
  shuffleQuestions: integer('shuffle_questions', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => courses.id),
  status: text('status', { enum: ['active', 'completed', 'cancelled', 'expired'] }).default('active'),
  progress: integer('progress').default(0),
  currentLessonId: text('current_lesson_id').references(() => lessons.id),
  completedLessons: text('completed_lessons', { mode: 'json' }),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  certificateIssued: integer('certificate_issued', { mode: 'boolean' }).default(false),
  paymentId: text('payment_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

// ================================
// TABLES COMMUNAUTÉ
// ================================

export const forums = sqliteTable('forums', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  parentId: text('parent_id').references(() => forums.id),
  sortOrder: integer('sort_order').default(0),
  isPrivate: integer('is_private', { mode: 'boolean' }).default(false),
  requiresApproval: integer('requires_approval', { mode: 'boolean' }).default(false),
  postCount: integer('post_count').default(0),
  memberCount: integer('member_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const forumPosts = sqliteTable('forum_posts', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  forumId: text('forum_id').notNull().references(() => forums.id),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  images: text('images', { mode: 'json' }),
  tags: text('tags', { mode: 'json' }),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isLocked: integer('is_locked', { mode: 'boolean' }).default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  replyCount: integer('reply_count').default(0),
  lastReplyAt: integer('last_reply_at', { mode: 'timestamp' }),
  lastReplyUserId: text('last_reply_user_id').references(() => users.id),
  status: text('status', { enum: ['published', 'draft', 'hidden', 'deleted'] }).default('published'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const forumReplies = sqliteTable('forum_replies', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  postId: text('post_id').notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  images: text('images', { mode: 'json' }),
  parentId: text('parent_id').references(() => forumReplies.id),
  likeCount: integer('like_count').default(0),
  status: text('status', { enum: ['published', 'hidden', 'deleted'] }).default('published'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  senderId: text('sender_id').notNull().references(() => users.id),
  receiverId: text('receiver_id').notNull().references(() => users.id),
  subject: text('subject'),
  content: text('content').notNull(),
  attachments: text('attachments', { mode: 'json' }),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  readAt: integer('read_at', { mode: 'timestamp' }),
  parentMessageId: text('parent_message_id').references(() => messages.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

// ================================
// TABLES SYSTÈME & IA
// ================================

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data', { mode: 'json' }),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  readAt: integer('read_at', { mode: 'timestamp' }),
  actionUrl: text('action_url'),
  channels: text('channels', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const aiConversations = sqliteTable('ai_conversations', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title'),
  context: text('context'),
  messages: text('messages', { mode: 'json' }),
  metadata: text('metadata', { mode: 'json' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  originalName: text('original_name'),
  type: text('type'),
  size: integer('size'),
  url: text('url'),
  content: text('content'),
  embedding: blob('embedding'),
  metadata: text('metadata', { mode: 'json' }),
  tags: text('tags', { mode: 'json' }),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').references(() => users.id),
  sessionId: text('session_id'),
  event: text('event').notNull(),
  page: text('page'),
  data: text('data', { mode: 'json' }),
  userAgent: text('user_agent'),
  ip: text('ip'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
})

// Relations pour les types TypeScript
export type User = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
export type Product = typeof products.$inferSelect
export type ProductInsert = typeof products.$inferInsert
export type Course = typeof courses.$inferSelect
export type CourseInsert = typeof courses.$inferInsert
export type Order = typeof orders.$inferSelect
export type OrderInsert = typeof orders.$inferInsert 