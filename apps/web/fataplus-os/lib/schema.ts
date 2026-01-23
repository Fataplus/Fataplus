import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users (Managed by BetterAuth)
export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: text("role").default("staff"), // 'admin', 'staff', 'client'
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Clients
export const clients = sqliteTable("clients", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    contactName: text("contact_name"),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Projects
export const projects = sqliteTable("projects", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id").notNull().references(() => clients.id),
    name: text("name").notNull(),
    status: text("status").default("active"), // 'active', 'completed', 'on_hold'
    tags: text("tags"), // JSON string
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Invoices
export const invoices = sqliteTable("invoices", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    clientId: text("client_id").notNull().references(() => clients.id),
    projectId: text("project_id").references(() => projects.id),
    invoiceNumber: text("invoice_number").notNull().unique(),
    status: text("status").default("draft"), // 'draft', 'sent', 'overdue', 'paid'
    issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
    dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
    totalAmount: real("total_amount").default(0),
    currency: text("currency").default("EUR"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Invoice Items
export const invoiceItems = sqliteTable("invoice_items", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    quantity: real("quantity").default(1),
    unitPrice: real("unit_price").notNull(),
    totalPrice: real("total_price").notNull(),
    marginJustification: text("margin_justification"), // INTERNAL ONLY
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tasks
export const tasks = sqliteTable("tasks", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: text("status").default("todo"), // 'todo', 'in_progress', 'blocked', 'done'
    priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
    dueDate: integer("due_date", { mode: "timestamp" }),
    assignedTo: text("assigned_to"), // User ID
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Content Posts (CMS)
export const contentPosts = sqliteTable("content_posts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    type: text("type").default("case_study"), // 'case_study', 'service', 'blog'
    content: text("content"),
    coverImageUrl: text("cover_image_url"),
    stackTags: text("stack_tags"), // JSON string
    isPublished: integer("is_published", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
