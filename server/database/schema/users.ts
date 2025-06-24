import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['superadmin', 'admin', 'farmer', 'vendor', 'user'] }).notNull().default('user'),
  passwordHash: text('password_hash').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  emailVerificationToken: text('email_verification_token'),
  emailVerificationExpires: integer('email_verification_expires', { mode: 'timestamp' }),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: integer('password_reset_expires', { mode: 'timestamp' }),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  region: text('region').notNull(),
  district: text('district').notNull(),
  commune: text('commune').notNull(),
  farmSize: text('farm_size'),
  crops: text('crops', { mode: 'json' }).$type<string[]>(),
  avatar: text('avatar'),
  bio: text('bio'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
  dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }),
  gender: text('gender', { enum: ['male', 'female', 'other'] }),
  education: text('education'),
  experience: text('experience'),
  interests: text('interests', { mode: 'json' }).$type<string[]>(),
  socialLinks: text('social_links', { mode: 'json' }).$type<Record<string, string>>(),
  preferences: text('preferences', { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { 
    enum: ['order_update', 'course_enrollment', 'message_received', 'event_reminder', 'forum_reply', 'system_update'] 
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data', { mode: 'json' }).$type<Record<string, any>>(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  readAt: integer('read_at', { mode: 'timestamp' }),
  actionUrl: text('action_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}) 