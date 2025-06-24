// Database schema types will be available once schema is created

// Types d'authentification
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: UserRole
}

export type UserRole = 'admin' | 'farmer' | 'buyer' | 'mentor' | 'trainer' | 'delivery'

// Types du marketplace
export interface ProductFilter {
  categoryId?: string
  priceMin?: number
  priceMax?: number
  organic?: boolean
  location?: string
  inStock?: boolean
  sellerId?: string
  rating?: number
  sortBy?: 'price' | 'rating' | 'newest' | 'popular'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchParams {
  q?: string
  category?: string
  filters?: ProductFilter
  page?: number
  limit?: number
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  image: string
  price: number
  quantity: number
  weight?: number
  sellerId: string
  sellerName: string
}

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  city: string
  region: string
  postalCode?: string
  notes?: string
}

export interface OrderItem extends CartItem {
  subtotal: number
}

export interface OrderData {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  deliveryMethod: 'home' | 'pickup' | 'relay'
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer' | 'card'
  couponCode?: string
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
}

// Types de formation
export interface CourseFilter {
  level?: 'beginner' | 'intermediate' | 'advanced'
  language?: string
  duration?: number
  price?: 'free' | 'paid'
  rating?: number
  instructorId?: string
  categoryId?: string
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  progress: number
  completedAt?: Date
  timeSpent?: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answers: QuizAnswer[]
  score: number
  passed: boolean
  attemptNumber: number
  startedAt: Date
  completedAt?: Date
  timeSpent?: number
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'text' | 'drag_drop'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export interface QuizAnswer {
  questionId: string
  answer: string | string[]
  isCorrect: boolean
  points: number
}

// Types de communauté
export interface ForumPostFilter {
  forumId?: string
  userId?: string
  tag?: string
  isPinned?: boolean
  status?: 'published' | 'draft' | 'hidden' | 'deleted'
  sortBy?: 'newest' | 'popular' | 'replies'
}

export interface MessageThread {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  updatedAt: Date
}

// Types d'IA
export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AIConversation {
  id: string
  title?: string
  messages: AIMessage[]
  context?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface DocumentProcessing {
  id: string
  name: string
  type: string
  status: 'processing' | 'completed' | 'error'
  content?: string
  summary?: string
  keyPoints?: string[]
  questions?: string[]
  embedding?: number[]
}

// Types système
export interface NotificationData {
  id: string
  userId: string
  type: 'order' | 'course' | 'message' | 'system' | 'promotion'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  readAt?: Date
  actionUrl?: string
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResult {
  id: string
  type: 'product' | 'course' | 'user' | 'post'
  title: string
  description?: string
  image?: string
  slug?: string
  score: number
  metadata?: Record<string, any>
}

// Types de configuration
export interface AppSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  supportPhone: string
  defaultLanguage: string
  availableLanguages: string[]
  currency: string
  timezone: string
  maintenance: boolean
  features: {
    marketplace: boolean
    learning: boolean
    community: boolean
    ai: boolean
    analytics: boolean
  }
}

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    showOnlineStatus: boolean
    allowMessages: boolean
  }
}

// Types d'analytics
export interface AnalyticsEvent {
  event: string
  userId?: string
  sessionId?: string
  page?: string
  data?: Record<string, any>
  timestamp: Date
  userAgent?: string
  ip?: string
}

export interface DashboardStats {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  products: {
    total: number
    active: number
    outOfStock: number
    growth: number
  }
  orders: {
    total: number
    pending: number
    revenue: number
    growth: number
  }
  courses: {
    total: number
    enrollments: number
    completions: number
    growth: number
  }
}

// Types d'intégration
export interface CloudronApp {
  id: string
  name: string
  description: string
  url: string
  icon: string
  category: string
  status: 'active' | 'inactive' | 'error'
  version: string
  lastSync: Date
}

export interface ExternalIntegration {
  id: string
  name: string
  type: 'dolibarr' | 'nextcloud' | 'docuseal' | 'paperless' | 'sogo' | 'outline'
  config: Record<string, any>
  enabled: boolean
  lastSync?: Date
  status: 'connected' | 'disconnected' | 'error'
}

// Types d'erreur
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
  userId?: string
  context?: string
}

// Types de validation
export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface FormState<T = any> {
  data: T
  errors: Record<string, string>
  isLoading: boolean
  isValid: boolean
  isDirty: boolean
}

// Utilitaires de type
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Core types for Fataplus platform

// =============================================================================
// User Management Types
// =============================================================================

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'farmer' | 'vendor' | 'user'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  region: string
  district: string
  commune: string
  farmSize?: string
  crops?: string[]
  avatar?: string
  bio?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// Marketplace Types
// =============================================================================

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  subcategory: string
  price: number
  currency: 'MGA' | 'EUR'
  images: string[]
  vendorId: string
  vendor: Vendor
  stock: number
  isActive: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  icon: string
  parentId?: string
  children?: ProductCategory[]
}

export interface Vendor {
  id: string
  name: string
  description: string
  logo?: string
  rating: number
  isVerified: boolean
  location: Location
  contactInfo: ContactInfo
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  currency: 'MGA' | 'EUR'
  status: OrderStatus
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

// =============================================================================
// Learning Types
// =============================================================================

export interface Course {
  id: string
  title: string
  description: string
  instructor: User
  category: CourseCategory
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  price: number
  currency: 'MGA' | 'EUR'
  thumbnail: string
  enrollmentCount: number
  rating: number
  isPublished: boolean
  chapters: Chapter[]
  createdAt: Date
  updatedAt: Date
}

export interface Chapter {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  quiz?: Quiz
}

export interface Lesson {
  id: string
  chapterId: string
  title: string
  content: LessonContent
  order: number
  duration: number
  isCompleted?: boolean
}

export interface LessonContent {
  type: 'video' | 'text' | 'interactive' | 'download'
  data: string
  subtitles?: Subtitle[]
}

export interface Subtitle {
  language: 'fr' | 'mg'
  url: string
}

export interface Quiz {
  id: string
  chapterId: string
  title: string
  questions: Question[]
  passingScore: number
  timeLimit?: number
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'essay' | 'drag_drop'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number
  completedAt?: Date
  certificateUrl?: string
  createdAt: Date
}

export interface CourseCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

// =============================================================================
// Community Types
// =============================================================================

export interface Message {
  id: string
  senderId: string
  sender: User
  recipientId?: string
  recipient?: User
  groupId?: string
  content: string
  type: 'text' | 'image' | 'file' | 'voice'
  attachments?: Attachment[]
  isRead: boolean
  createdAt: Date
}

export interface Group {
  id: string
  name: string
  description: string
  avatar?: string
  ownerId: string
  members: GroupMember[]
  isPrivate: boolean
  createdAt: Date
}

export interface GroupMember {
  userId: string
  user: User
  role: 'admin' | 'moderator' | 'member'
  joinedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  organizer: User
  category: EventCategory
  startDate: Date
  endDate: Date
  location: Location
  isOnline: boolean
  maxAttendees?: number
  currentAttendees: number
  price?: number
  image?: string
  attendees: EventAttendee[]
  createdAt: Date
}

export interface EventAttendee {
  userId: string
  user: User
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled'
  registeredAt: Date
}

export interface Forum {
  id: string
  name: string
  description: string
  category: ForumCategory
  isPublic: boolean
  posts: ForumPost[]
  createdAt: Date
}

export interface ForumPost {
  id: string
  forumId: string
  authorId: string
  author: User
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  replies: ForumReply[]
  createdAt: Date
  updatedAt: Date
}

export interface ForumReply {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  parentReplyId?: string
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// Shared Types
// =============================================================================

export interface Location {
  region: string
  district: string
  commune: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface Address {
  street: string
  city: string
  postalCode: string
  region: string
  country: string
}

export interface ContactInfo {
  phone: string
  email: string
  website?: string
}

export interface Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
}

export type NotificationType = 
  | 'order_update'
  | 'course_enrollment'
  | 'message_received'
  | 'event_reminder'
  | 'forum_reply'
  | 'system_update'

export interface Review {
  id: string
  userId: string
  user: User
  targetType: 'product' | 'course' | 'vendor' | 'event'
  targetId: string
  rating: number
  comment?: string
  isVerified: boolean
  createdAt: Date
}

export interface EventCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface ForumCategory {
  id: string
  name: string
  description: string
  color: string
  order: number
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// =============================================================================
// Form Types
// =============================================================================

export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  region: string
  district: string
  commune: string
  acceptTerms: boolean
}

export interface ProductForm {
  name: string
  description: string
  categoryId: string
  subcategory: string
  price: number
  currency: 'MGA' | 'EUR'
  stock: number
  images: File[]
}

export interface CourseForm {
  title: string
  description: string
  categoryId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  currency: 'MGA' | 'EUR'
  thumbnail: File
}

// =============================================================================
// Integration Types
// =============================================================================

export interface DolibarrInvoice {
  id: string
  ref: string
  socid: string
  date: string
  total_ht: number
  total_ttc: number
  status: string
}

export interface NextcloudFile {
  id: string
  name: string
  path: string
  size: number
  mtime: number
  mime: string
  permissions: string
}

export interface DocuSealDocument {
  id: string
  name: string
  status: 'pending' | 'completed' | 'declined'
  signers: Array<{
    email: string
    name: string
    status: string
  }>
  created_at: string
} 