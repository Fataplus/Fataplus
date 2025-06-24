import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'

export const productCategories = sqliteTable('product_categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  description: text('description'),
  parentId: text('parent_id').references(() => productCategories.id),
  order: integer('order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  address: text('address'),
  region: text('region').notNull(),
  district: text('district').notNull(),
  commune: text('commune').notNull(),
  coordinates: text('coordinates', { mode: 'json' }).$type<{ latitude: number; longitude: number }>(),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  commissionRate: real('commission_rate').notNull().default(0.05), // 5% default
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  slug: text('slug').notNull().unique(),
  categoryId: text('category_id').notNull().references(() => productCategories.id),
  subcategory: text('subcategory'),
  vendorId: text('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  price: real('price').notNull(),
  comparePrice: real('compare_price'), // Original price before discount
  currency: text('currency', { enum: ['MGA', 'EUR'] }).notNull().default('MGA'),
  unit: text('unit').notNull(), // kg, piece, liter, etc.
  minQuantity: integer('min_quantity').notNull().default(1),
  stock: integer('stock').notNull().default(0),
  weight: real('weight'), // in kg
  dimensions: text('dimensions', { mode: 'json' }).$type<{ length: number; width: number; height: number }>(),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull().default('[]'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default('[]'),
  specifications: text('specifications', { mode: 'json' }).$type<Record<string, string>>(),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  viewCount: integer('view_count').notNull().default(0),
  salesCount: integer('sales_count').notNull().default(0),
  isOrganic: integer('is_organic', { mode: 'boolean' }).notNull().default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  orderNumber: text('order_number').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status', { 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] 
  }).notNull().default('pending'),
  paymentStatus: text('payment_status', { 
    enum: ['pending', 'paid', 'failed', 'refunded'] 
  }).notNull().default('pending'),
  paymentMethod: text('payment_method'),
  paymentId: text('payment_id'), // Stripe payment intent ID
  currency: text('currency', { enum: ['MGA', 'EUR'] }).notNull().default('MGA'),
  subtotal: real('subtotal').notNull(),
  taxAmount: real('tax_amount').notNull().default(0),
  shippingAmount: real('shipping_amount').notNull().default(0),
  discountAmount: real('discount_amount').notNull().default(0),
  total: real('total').notNull(),
  customerNotes: text('customer_notes'),
  adminNotes: text('admin_notes'),
  shippingAddress: text('shipping_address', { mode: 'json' }).$type<{
    name: string
    phone: string
    address: string
    city: string
    region: string
    postalCode?: string
    country: string
  }>().notNull(),
  billingAddress: text('billing_address', { mode: 'json' }).$type<{
    name: string
    phone: string
    address: string
    city: string
    region: string
    postalCode?: string
    country: string
  }>(),
  deliveryMethod: text('delivery_method', { enum: ['home', 'pickup', 'relay'] }).notNull().default('home'),
  trackingNumber: text('tracking_number'),
  estimatedDelivery: integer('estimated_delivery', { mode: 'timestamp' }),
  deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
  cancelledAt: integer('cancelled_at', { mode: 'timestamp' }),
  cancellationReason: text('cancellation_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  vendorId: text('vendor_id').notNull().references(() => vendors.id),
  productName: text('product_name').notNull(), // Snapshot of product name
  productImage: text('product_image'), // Snapshot of main product image
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  currency: text('currency', { enum: ['MGA', 'EUR'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: text('target_type', { enum: ['product', 'vendor', 'course', 'event'] }).notNull(),
  targetId: text('target_id').notNull(),
  orderId: text('order_id').references(() => orders.id), // For product reviews
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  comment: text('comment'),
  pros: text('pros', { mode: 'json' }).$type<string[]>(),
  cons: text('cons', { mode: 'json' }).$type<string[]>(),
  images: text('images', { mode: 'json' }).$type<string[]>(),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  isApproved: integer('is_approved', { mode: 'boolean' }).notNull().default(true),
  helpfulCount: integer('helpful_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const carts = sqliteTable('carts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionId: text('session_id'), // For guest users
  items: text('items', { mode: 'json' }).$type<Array<{
    productId: string
    quantity: number
    addedAt: string
  }>>().notNull().default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('Ma liste de souhaits'),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const wishlistItems = sqliteTable('wishlist_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  wishlistId: text('wishlist_id').notNull().references(() => wishlists.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt: integer('added_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}) 