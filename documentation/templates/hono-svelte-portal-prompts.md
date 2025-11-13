# Hono.js + Svelte Fataplus Portal Development Prompts

## Project Setup and Architecture Prompt

```
You are a senior full-stack developer tasked with building the Fataplus Client Portal from scratch using Hono.js for the backend and Svelte for the frontend. This is a B2B project management portal for clients to access their projects, documents, and communicate with the Fataplus team.

## Technology Stack:
- **Backend**: Hono.js with TypeScript
- **Frontend**: Svelte + SvelteKit
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + bcrypt
- **File Storage**: Local storage (with future S3 integration)
- **CSS**: Tailwind CSS with PostCSS
- **Validation**: Zod schemas
- **Testing**: Vitest + Testing Library

## Core Requirements:
1. **RBAC System**: Client, Project Manager, Admin roles
2. **Project Management**: Project CRUD, status tracking, milestones
3. **Document Management**: Upload, organize, version control
4. **Communication System**: Messaging between clients and PMs
5. **CMS Capabilities**: Content management for pages and resources
6. **Integration Ready**: Webhooks for intake form and document generation

## Project Structure to Create:
```
fataplus-portal/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── types/
│   ├── drizzle/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── routes/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── types/
│   ├── static/
│   └── package.json
├── shared/
│   └── types/
└── docs/
```

## Phase 1: Project Setup
Please provide:

1. **Initial Project Structure** - Create the complete directory structure for both backend and frontend
2. **Package.json files** - Include all necessary dependencies and scripts
3. **Configuration Files** - TypeScript, Tailwind, Drizzle, SvelteKit configs
4. **Database Schema Design** - Drizzle schema for users, projects, documents, messages, etc.
5. **Environment Setup** - .env templates and configuration
6. **Development Scripts** - Commands for dev, build, test, migrate

Focus on creating a scalable foundation that supports the complete portal functionality. Provide complete, working code examples for each configuration file.
```

## Backend Implementation Prompt

```
Build a complete Hono.js backend for the Fataplus Client Portal with these specifications:

## Backend Requirements:
1. **Hono.js Server Setup** - With TypeScript, CORS, compression, and rate limiting
2. **Database Integration** - PostgreSQL with Drizzle ORM
3. **Authentication System** - JWT-based auth with refresh tokens
4. **File Upload System** - Multer-like functionality for document uploads
5. **API Structure** - RESTful APIs with proper error handling
6. **Middleware System** - Auth, logging, validation, RBAC middleware

## Required API Endpoints:

### Authentication Routes (/api/auth):
- POST /register - User registration with email verification
- POST /login - User authentication
- POST /logout - Token invalidation
- POST /refresh - Refresh access token
- POST /forgot-password - Password reset request
- POST /reset-password - Password reset confirmation

### User Management (/api/users):
- GET /users/me - Get current user profile
- PUT /users/me - Update user profile
- GET /users - List users (admin only)
- PUT /users/:id - Update user (admin/pm only)
- DELETE /users/:id - Delete user (admin only)

### Projects (/api/projects):
- GET /projects - List projects (filtered by user role)
- POST /projects - Create new project (pm/admin only)
- GET /projects/:id - Get project details
- PUT /projects/:id - Update project
- DELETE /projects/:id - Delete project
- GET /projects/:id/documents - List project documents
- GET /projects/:id/messages - List project messages

### Documents (/api/documents):
- GET /documents - List documents (filtered by access)
- POST /documents - Upload new document
- GET /documents/:id - Get document details
- PUT /documents/:id - Update document metadata
- DELETE /documents/:id - Delete document
- GET /documents/:id/download - Download document file
- POST /documents/:id/versions - Upload new version

### Messages (/api/messages):
- GET /messages - List messages (project-scoped)
- POST /messages - Send new message
- GET /messages/:id - Get message details
- PUT /messages/:id/read - Mark as read
- DELETE /messages/:id - Delete message

### Admin Routes (/api/admin):
- GET /admin/stats - Dashboard statistics
- GET /admin/activities - System activity logs
- POST /admin/announcements - System announcements

## Database Schema (Drizzle ORM):

```typescript
// Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  company: varchar('company', { length: 255 }),
  role: userRoleEnum('role').default('client'),
  avatar: varchar('avatar', { length: 500 }),
  emailVerified: boolean('email_verified').default(false),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Projects Table
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('intake'),
  clientId: uuid('client_id').references(() => users.id),
  projectManagerId: uuid('project_manager_id').references(() => users.id),
  startDate: date('start_date'),
  expectedDelivery: date('expected_delivery'),
  actualDelivery: date('actual_delivery'),
  budget: integer('budget'),
  priority: priorityEnum('priority').default('medium'),
  tags: varchar('tags', { length: 500 }).array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Documents Table
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: documentTypeEnum('type').notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  uploadedById: uuid('uploaded_by_id').references(() => users.id),
  fileName: varchar('file_name', { length: 500 }).notNull(),
  filePath: varchar('file_path', { length: 1000 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  version: varchar('version', { length: 20 }).default('1.0'),
  accessLevel: accessLevelEnum('access_level').default('client'),
  tags: varchar('tags', { length: 500 }).array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Messages Table
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  senderId: uuid('sender_id').references(() => users.id),
  recipientId: uuid('recipient_id').references(() => users.id),
  subject: varchar('subject', { length: 255 }),
  content: text('content').notNull(),
  isInternal: boolean('is_internal').default(false),
  isRead: boolean('is_read').default(false),
  attachments: json('attachments'), // Array of file references
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

## Implementation Requirements:

1. **Complete Hono.js Server Setup** - With proper middleware configuration
2. **Drizzle ORM Integration** - Database connection, migrations, and queries
3. **Authentication Middleware** - JWT verification and token management
4. **RBAC Middleware** - Role-based access control for all routes
5. **File Upload Service** - Secure file handling with validation
6. **API Documentation** - OpenAPI/Swagger specification
7. **Error Handling** - Centralized error handling with proper HTTP status codes
8. **Logging System** - Request/response logging and error tracking
9. **Validation Schemas** - Zod schemas for all API endpoints
10. **Rate Limiting** - Protect against abuse

## Security Requirements:
- Password hashing with bcrypt
- JWT with RS256 signatures
- Rate limiting per user/IP
- Input validation and sanitization
- SQL injection prevention
- File upload security validation
- CORS configuration

## Performance Requirements:
- Database connection pooling
- Response compression
- Static file serving optimization
- Query optimization with proper indexes

Provide complete, production-ready implementation with proper TypeScript types, error handling, and security measures.
```

## RBAC and Authentication System Prompt

```
Implement a comprehensive Role-Based Access Control (RBAC) and authentication system for the Fataplus Portal using Hono.js and modern security practices.

## Authentication System Requirements:

### User Roles and Permissions:
1. **Client** - Can view own projects, download documents, send messages
2. **Project Manager** - Can manage assigned projects, upload documents, communicate with clients
3. **Admin** - Full system access, user management, system configuration

### Permission Matrix:
```
Action                    | Client | PM | Admin
--------------------------|--------|----|------
View own projects         |   ✅   | ✅ | ✅
View all projects         |   ❌   | 🔄 | ✅
Create projects           |   ❌   | ✅ | ✅
Edit projects             |   ❌   | 🔄 | ✅
Delete projects           |   ❌   | ❌ | ✅
Upload documents          |   ❌   | ✅ | ✅
Download documents        |   ✅   | ✅ | ✅
Manage users              |   ❌   | ❌ | ✅
View system analytics     |   ❌   | ❌ | ✅
Send messages             |   ✅   | ✅ | ✅
View internal messages    |   ❌   | ✅ | ✅
🔄 = Only assigned projects/resources
```

### JWT Token Structure:
```typescript
// Access Token (15 minutes)
interface AccessToken {
  sub: string;        // User ID
  email: string;      // User email
  role: UserRole;     // User role
  permissions: string[]; // User permissions
  iat: number;        // Issued at
  exp: number;        // Expires at
  type: 'access';
}

// Refresh Token (7 days)
interface RefreshToken {
  sub: string;        // User ID
  sessionId: string;  // Session ID
  iat: number;
  exp: number;
  type: 'refresh';
}
```

## Implementation Requirements:

### 1. Authentication Middleware:
```typescript
// src/middleware/auth.ts
export const authMiddleware = async (c: Context, next: Next) => {
  // Extract token from Authorization header
  // Verify JWT signature
  // Check token expiration
  // Attach user to context
  // Continue to next middleware
};
```

### 2. RBAC Middleware:
```typescript
// src/middleware/rbac.ts
export const requireRole = (roles: UserRole[]) => {
  return async (c: Context, next: Next) => {
    // Check user role from context
    // Verify required permissions
    // Return 403 if insufficient permissions
    // Continue if authorized
  };
};

export const requirePermission = (permissions: string[]) => {
  return async (c: Context, next: Next) => {
    // Check user permissions
    // Verify required permissions
    // Handle authorization logic
  };
};
```

### 3. Authentication Services:
```typescript
// src/services/auth.service.ts
export class AuthService {
  // User registration with email verification
  async register(data: RegisterDto): Promise<AuthResponse>;

  // User login with credential validation
  async login(data: LoginDto): Promise<AuthResponse>;

  // Token refresh functionality
  async refreshToken(refreshToken: string): Promise<TokenPair>;

  // Password reset flow
  async forgotPassword(email: string): Promise<void>;
  async resetPassword(data: ResetPasswordDto): Promise<void>;

  // Email verification
  async verifyEmail(token: string): Promise<void>;

  // Logout and token invalidation
  async logout(refreshToken: string): Promise<void>;
}
```

### 4. Password Security:
```typescript
// src/services/password.service.ts
export class PasswordService {
  // Hash password with bcrypt
  async hashPassword(password: string): Promise<string>;

  // Verify password against hash
  async verifyPassword(password: string, hash: string): Promise<boolean>;

  // Generate secure random password
  async generateRandomPassword(): Promise<string>;

  // Validate password strength
  validatePasswordStrength(password: string): boolean;
}
```

### 5. Session Management:
```typescript
// src/services/session.service.ts
export class SessionService {
  // Create new session
  async createSession(userId: string): Promise<string>;

  // Validate session
  async validateSession(sessionId: string): Promise<boolean>;

  // Invalidate session
  async invalidateSession(sessionId: string): Promise<void>;

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId: string): Promise<void>;

  // Clean expired sessions
  async cleanupExpiredSessions(): Promise<void>;
}
```

### 6. Email Service Integration:
```typescript
// src/services/email.service.ts
export class EmailService {
  // Send welcome email
  async sendWelcomeEmail(user: User): Promise<void>;

  // Send email verification
  async sendEmailVerification(user: User): Promise<void>;

  // Send password reset email
  async sendPasswordResetEmail(user: User, token: string): Promise<void>;

  // Send login notification
  async sendLoginNotification(user: User): Promise<void>;
}
```

## Security Implementation:

### 1. Rate Limiting:
```typescript
// src/middleware/rateLimit.ts
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 2. Input Validation:
```typescript
// src/validation/auth.validation.ts
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  company: z.string().optional(),
});
```

### 3. Security Headers:
```typescript
// src/middleware/security.ts
export const securityMiddleware = (c: Context, next: Next) => {
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return next();
};
```

## Database Schema Additions:

```typescript
// Sessions Table for refresh tokens
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 255 }).unique().notNull(),
  refreshToken: varchar('refresh_token', { length: 1000 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isActive: boolean('is_active').default(true),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Email Verification Tokens
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  token: varchar('token', { length: 255 }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Password Reset Tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  token: varchar('token', { length: 255 }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Route Protection Examples:

```typescript
// Protected routes with role-based access
app.get('/api/projects',
  authMiddleware,
  requirePermission(['project:read']),
  getProjectsHandler
);

app.post('/api/projects',
  authMiddleware,
  requireRole(['project-manager', 'admin']),
  requirePermission(['project:create']),
  createProjectHandler
);

app.get('/api/admin/users',
  authMiddleware,
  requireRole(['admin']),
  requirePermission(['user:read']),
  getUsersHandler
);
```

## Testing Requirements:

1. **Unit Tests** for all auth services
2. **Integration Tests** for authentication flows
3. **Security Tests** for authorization bypasses
4. **Performance Tests** for token validation

## Configuration:

```typescript
// src/config/auth.config.ts
export const authConfig = {
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    issuer: 'fataplus-portal',
    audience: 'fataplus-users',
  },
  password: {
    minStrength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  session: {
    maxSessions: 5,
    cleanupInterval: '1h',
  },
  email: {
    verificationExpiry: '24h',
    passwordResetExpiry: '1h',
  },
};
```

Provide a complete, secure, and production-ready authentication and RBAC system with comprehensive error handling, logging, and security measures.
```

## Project Management Features Prompt

```
Develop comprehensive project management functionality for the Fataplus Portal with advanced features for tracking, collaboration, and client communication.

## Project Management Requirements:

### 1. Project Lifecycle Management:
```typescript
// Project Status Flow
const projectStatusFlow = {
  intake: 'Project submitted via intake form',
  planning: 'Requirements gathering and planning phase',
  'in-progress': 'Active development/implementation',
  review: 'Client review and feedback phase',
  completed: 'Project delivered and approved',
  on_hold: 'Temporarily paused',
  cancelled: 'Project terminated'
};

// Priority Levels
const projectPriorities = {
  low: { value: 1, color: 'gray', icon: '↓' },
  medium: { value: 2, color: 'blue', icon: '→' },
  high: { value: 3, color: 'orange', icon: '↑' },
  urgent: { value: 4, color: 'red', icon: '⚡' }
};
```

### 2. Project Management Services:

```typescript
// src/services/project.service.ts
export class ProjectService {
  // Create new project with validation
  async createProject(data: CreateProjectDto): Promise<Project>;

  // Update project details and status
  async updateProject(id: string, data: UpdateProjectDto): Promise<Project>;

  // Assign project to team members
  async assignProject(projectId: string, assignments: ProjectAssignment[]): Promise<void>;

  // Calculate project progress based on milestones
  async calculateProgress(projectId: string): Promise<ProjectProgress>;

  // Get project timeline and milestones
  async getProjectTimeline(projectId: string): Promise<ProjectTimeline>;

  // Add milestone to project
  async addMilestone(projectId: string, milestone: CreateMilestoneDto): Promise<Milestone>;

  // Update milestone status
  async updateMilestone(milestoneId: string, status: MilestoneStatus): Promise<Milestone>;

  // Get project statistics and analytics
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics>;

  // Clone project template
  async cloneProjectTemplate(templateId: string, projectData: CreateProjectDto): Promise<Project>;
}
```

### 3. Milestone Management:

```typescript
// Milestone System
interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: Date;
  completedAt?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dependencies: string[]; // Other milestone IDs
  assignedTo?: string; // User ID
  completionPercentage: number;
  deliverables: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/services/milestone.service.ts
export class MilestoneService {
  // Create milestone with dependencies
  async createMilestone(data: CreateMilestoneDto): Promise<Milestone>;

  // Update milestone progress
  async updateProgress(milestoneId: string, percentage: number): Promise<Milestone>;

  // Check for overdue milestones
  async checkOverdueMilestones(): Promise<Milestone[]>;

  // Get milestone dependencies
  async getMilestoneDependencies(milestoneId: string): Promise<Milestone[]>;

  // Mark milestone as complete
  async completeMilestone(milestoneId: string, notes?: string): Promise<Milestone>;

  // Generate milestone reports
  async generateMilestoneReport(projectId: string): Promise<MilestoneReport>;
}
```

### 4. Project Analytics and Reporting:

```typescript
// src/services/analytics.service.ts
export class ProjectAnalyticsService {
  // Get comprehensive project statistics
  async getProjectStats(projectId: string): Promise<ProjectStats>;

  // Generate project timeline report
  async generateTimelineReport(projectId: string): Promise<TimelineReport>;

  // Calculate project health score
  async calculateProjectHealth(projectId: string): Promise<HealthScore>;

  // Get resource utilization metrics
  async getResourceUtilization(projectId: string): Promise<ResourceMetrics>;

  // Generate budget vs actual spending report
  async generateBudgetReport(projectId: string): Promise<BudgetReport>;

  // Get team performance metrics
  async getTeamPerformance(projectId: string): Promise<TeamPerformance>;

  // Predict project completion date
  async predictCompletionDate(projectId: string): Promise<Prediction>;
}
```

### 5. Project Templates System:

```typescript
// Template Management
interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultMilestones: MilestoneTemplate[];
  defaultDocuments: DocumentTemplate[];
  defaultTasks: TaskTemplate[];
  estimatedDuration: number; // in days
  defaultBudget?: number;
  tags: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/services/template.service.ts
export class TemplateService {
  // Create project template
  async createTemplate(data: CreateProjectTemplateDto): Promise<ProjectTemplate>;

  // Apply template to new project
  async applyTemplate(templateId: string, projectData: CreateProjectDto): Promise<Project>;

  // Get template categories
  async getTemplateCategories(): Promise<string[]>;

  // Search templates by criteria
  async searchTemplates(criteria: TemplateSearchCriteria): Promise<ProjectTemplate[]>;

  // Update template
  async updateTemplate(id: string, data: UpdateTemplateDto): Promise<ProjectTemplate>;
}
```

### 6. Advanced Features:

```typescript
// Project Collaboration
export class ProjectCollaborationService {
  // Add team member to project
  async addTeamMember(projectId: string, member: TeamMemberDto): Promise<void>;

  // Remove team member from project
  async removeTeamMember(projectId: string, userId: string): Promise<void>;

  // Update team member permissions
  async updateMemberPermissions(projectId: string, userId: string, permissions: Permission[]): Promise<void>;

  // Get project activity feed
  async getActivityFeed(projectId: string, filters?: ActivityFilters): Promise<Activity[]>;

  // Log project activity
  async logActivity(projectId: string, activity: ActivityLog): Promise<void>;
}

// Project Notifications
export class ProjectNotificationService {
  // Send milestone completion notification
  async notifyMilestoneComplete(milestoneId: string): Promise<void>;

  // Send project status change notification
  async notifyStatusChange(projectId: string, oldStatus: string, newStatus: string): Promise<void>;

  // Send upcoming deadline reminders
  async sendDeadlineReminders(): Promise<void>;

  // Send budget alerts
  async notifyBudgetAlert(projectId: string, threshold: number): Promise<void>;

  // Send project completion summary
  async sendCompletionSummary(projectId: string): Promise<void>;
}
```

### 7. Database Schema for Project Management:

```typescript
// Projects Table (extended)
export const projects = pgTable('projects', {
  // ... existing fields
  estimatedStartDate: date('estimated_start_date'),
  actualStartDate: date('actual_start_date'),
  estimatedEndDate: date('estimated_end_date'),
  actualEndDate: date('actual_end_date'),
  estimatedBudget: integer('estimated_budget'),
  actualBudget: integer('actual_budget'),
  progressPercentage: integer('progress_percentage').default(0),
  healthScore: integer('health_score'), // 1-100
  templateId: uuid('template_id').references(() => projectTemplates.id),
  parentProjectId: uuid('parent_project_id').references(() => projects.id), // For sub-projects
  tags: varchar('tags', { length: 500 }).array(),
  customFields: json('custom_fields'),
  archivedAt: timestamp('archived_at'),
});

// Milestones Table
export const milestones = pgTable('milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  dueDate: date('due_date').notNull(),
  completedAt: date('completed_at'),
  status: milestoneStatusEnum('status').default('pending'),
  priority: priorityEnum('priority').default('medium'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  completionPercentage: integer('completion_percentage').default(0),
  deliverables: text('deliverables').array(),
  dependencies: uuid('dependencies').array(),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Project Templates Table
export const projectTemplates = pgTable('project_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  estimatedDuration: integer('estimated_duration'), // in days
  defaultBudget: integer('default_budget'),
  defaultMilestones: json('default_milestones'),
  defaultDocuments: json('default_documents'),
  defaultTasks: json('default_tasks'),
  tags: varchar('tags', { length: 500 }).array(),
  isActive: boolean('is_active').default(true),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Project Team Members Table
export const projectTeamMembers = pgTable('project_team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  userId: uuid('user_id').references(() => users.id),
  role: varchar('role', { length: 50 }), // project-manager, developer, designer, etc.
  permissions: json('permissions'), // Array of permission objects
  joinedAt: timestamp('joined_at').defaultNow(),
  leftAt: timestamp('left_at'),
  hourlyRate: integer('hourly_rate'),
  isActive: boolean('is_active').default(true),
});

// Project Activities Table
export const projectActivities = pgTable('project_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }), // project, milestone, document, etc.
  entityId: uuid('entity_id'),
  details: json('details'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Project Time Tracking Table
export const projectTimeTracking = pgTable('project_time_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  userId: uuid('user_id').references(() => users.id),
  taskId: uuid('task_id'), // Optional task association
  description: text('description'),
  hours: integer('hours').notNull(),
  minutes: integer('minutes').default(0),
  date: date('date').notNull(),
  isBillable: boolean('is_billable').default(true),
  hourlyRate: integer('hourly_rate'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 8. API Endpoints for Project Management:

```typescript
// Project Management Routes
app.get('/api/projects/analytics/:id', requirePermission(['project:analytics']), getProjectAnalytics);
app.get('/api/projects/timeline/:id', requirePermission(['project:read']), getProjectTimeline);
app.post('/api/projects/:id/milestones', requirePermission(['milestone:create']), createMilestone);
app.put('/api/milestones/:id', requirePermission(['milestone:update']), updateMilestone);
app.get('/api/projects/:id/activities', requirePermission(['project:read']), getActivityFeed);
app.post('/api/projects/:id/team', requirePermission(['team:manage']), addTeamMember);
app.delete('/api/projects/:id/team/:userId', requirePermission(['team:manage']), removeTeamMember);
app.get('/api/projects/templates', getProjectTemplates);
app.post('/api/projects/templates', requirePermission(['template:create']), createTemplate);
app.get('/api/projects/:id/time-tracking', requirePermission(['time:read']), getTimeTracking);
app.post('/api/projects/:id/time-tracking', requirePermission(['time:create']), logTime);

// Admin Project Management Routes
app.get('/api/admin/projects/all', requireRole(['admin']), getAllProjects);
app.put('/api/admin/projects/:id/archive', requireRole(['admin']), archiveProject);
app.get('/api/admin/projects/analytics', requireRole(['admin']), getSystemAnalytics);
```

### 9. Advanced Features Implementation:

```typescript
// Project Cloning
export class ProjectCloningService {
  async cloneProject(sourceProjectId: string, cloneData: CloneProjectDto): Promise<Project>;
  async cloneProjectStructure(project: Project, newName: string): Promise<Project>;
  async cloneMilestones(projectId: string, targetProjectId: string): Promise<Milestone[]>;
  async cloneDocuments(projectId: string, targetProjectId: string): Promise<Document[]>;
  async cloneTeamStructure(projectId: string, targetProjectId: string): Promise<void>;
}

// Project Automation
export class ProjectAutomationService {
  // Auto-update project status based on milestones
  async updateProjectStatus(projectId: string): Promise<void>;

  // Send automated reminders for upcoming deadlines
  async sendDeadlineReminders(): Promise<void>;

  // Auto-assign tasks based on team member availability
  async autoAssignTasks(projectId: string): Promise<void>;

  // Generate weekly progress reports
  async generateWeeklyReports(): Promise<void>;
}
```

### 10. Integration Requirements:

```typescript
// Intake Form Integration
export class IntakeFormIntegration {
  // Convert intake form submission to project
  async convertIntakeToProject(intakeData: IntakeFormData): Promise<Project>;

  // Auto-assign project manager based on workload
  async assignProjectManager(projectId: string): Promise<void>;

  // Create initial milestones from template
  async createInitialMilestones(projectId: string, templateId: string): Promise<Milestone[]>;

  // Send client welcome email
  async sendClientWelcome(clientId: string, projectId: string): Promise<void>;
}

// Document Generation Integration
export class DocumentGenerationIntegration {
  // Update project status when documents are generated
  async handleDocumentGenerated(documentData: DocumentGeneratedEvent): Promise<void>;

  // Auto-update milestone completion based on document delivery
  async updateMilestoneFromDocument(projectId: string, documentType: string): Promise<void>;

  // Notify client of document availability
  async notifyClientDocumentReady(projectId: string, documentId: string): Promise<void>;
}
```

Provide a comprehensive project management system with full CRUD operations, advanced features like templates and analytics, proper error handling, and integration capabilities with external systems.
```

## Svelte Frontend Application Prompt

```
Build a modern, responsive Svelte frontend for the Fataplus Client Portal with SvelteKit, Tailwind CSS, and TypeScript. Create an intuitive user experience for clients, project managers, and administrators.

## Frontend Requirements:

### 1. SvelteKit Application Structure:
```typescript
// src/routes/ - File-based routing
src/routes/
├── (auth)/               # Authentication routes
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/          # Protected dashboard routes
│   ├── +layout.svelte    # Dashboard layout
│   ├── +page.svelte      # Dashboard home
│   ├── projects/
│   │   ├── +page.svelte  # Project list
│   │   ├── [id]/         # Individual project
│   │   └── create/       # Create project
│   ├── documents/
│   │   ├── +page.svelte  # Document library
│   │   └── [id]/         # Document details
│   ├── messages/
│   │   ├── +page.svelte  # Message center
│   │   └── [id]/         # Conversation
│   └── profile/
├── admin/                # Admin routes
│   ├── +layout.svelte
│   ├── users/
│   ├── projects/
│   └── analytics/
└── api/                  # API routes (if needed)
    └── auth/
```

### 2. Component Architecture:

```typescript
// src/components/
src/components/
├── ui/                    # Base UI components
│   ├── Button.svelte
│   ├── Input.svelte
│   ├── Modal.svelte
│   ├── Dropdown.svelte
│   ├── Badge.svelte
│   └── Loading.svelte
├── layout/                # Layout components
│   ├── Header.svelte
│   ├── Sidebar.svelte
│   ├── Footer.svelte
│   ├── Navigation.svelte
│   └── MobileMenu.svelte
├── forms/                 # Form components
│   ├── LoginForm.svelte
│   ├── ProjectForm.svelte
│   ├── DocumentUpload.svelte
│   └── MessageForm.svelte
├── features/              # Feature-specific components
│   ├── ProjectCard.svelte
│   ├── DocumentViewer.svelte
│   ├── MessageThread.svelte
│   ├── MilestoneTracker.svelte
│   └── ProgressChart.svelte
└── charts/                # Data visualization
    ├── ProjectChart.svelte
    ├── TimelineChart.svelte
    └── AnalyticsChart.svelte
```

### 3. State Management (Svelte Stores):

```typescript
// src/stores/
// src/stores/auth.store.ts
import { writable, derived } from 'svelte/store';
import type { User, AuthState } from '$lib/types';

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    permissions: []
  });

  return {
    subscribe,
    login: async (credentials: LoginCredentials) => {
      // Login logic
    },
    logout: () => {
      // Logout logic
    },
    refreshToken: async () => {
      // Refresh token logic
    },
    checkAuth: async () => {
      // Check authentication status
    }
  };
}

export const auth = createAuthStore();

// Derived stores for convenience
export const user = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const userRole = derived(auth, $auth => $auth.user?.role);
export const permissions = derived(auth, $auth => $auth.permissions);

// src/stores/projects.store.ts
import { writable, derived } from 'svelte/store';
import type { Project, ProjectFilters } from '$lib/types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  filters: ProjectFilters;
  loading: boolean;
  error: string | null;
}

function createProjectsStore() {
  const { subscribe, set, update } = writable<ProjectsState>({
    projects: [],
    currentProject: null,
    filters: {},
    loading: false,
    error: null
  });

  return {
    subscribe,
    fetchProjects: async (filters?: ProjectFilters) => {
      // Fetch projects from API
    },
    fetchProject: async (id: string) => {
      // Fetch single project
    },
    createProject: async (project: CreateProjectDto) => {
      // Create new project
    },
    updateProject: async (id: string, updates: UpdateProjectDto) => {
      // Update project
    },
    deleteProject: async (id: string) => {
      // Delete project
    },
    setFilters: (filters: ProjectFilters) => {
      update(state => ({ ...state, filters }));
    }
  };
}

export const projects = createProjectsStore();

// src/stores/ui.store.ts
import { writable } from 'svelte/store';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modals: {
    createProject: boolean;
    uploadDocument: boolean;
    sendMessage: boolean;
  };
}

export const ui = writable<UIState>({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  modals: {
    createProject: false,
    uploadDocument: false,
    sendMessage: false
  }
});
```

### 4. Authentication Components:

```svelte
<!-- src/components/forms/LoginForm.svelte -->
<script lang="ts">
  import { auth } from '$lib/stores/auth.store';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { validateLogin } from '$lib/validation';

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleLogin() {
    try {
      loading = true;
      error = '';

      const validation = validateLogin({ email, password });
      if (!validation.success) {
        error = validation.error;
        return;
      }

      await auth.login({ email, password });
      goto('/dashboard');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <Input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
        bind:value={email}
        label="Email address"
        placeholder="Enter your email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        bind:value={password}
        label="Password"
        placeholder="Enter your password"
      />

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      #/if}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading}
        fullWidth
      >
        Sign in
      </Button>
    </form>
  </div>
</div>
```

### 5. Dashboard Layout:

```svelte
<!-- src/routes/(dashboard)/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth, ui } from '$lib/stores';
  import Header from '$lib/components/layout/Header.svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

  let sidebarOpen = true;

  $: navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'home',
      requiredRole: ['client', 'project-manager', 'admin']
    },
    {
      label: 'Projects',
      href: '/dashboard/projects',
      icon: 'folder',
      requiredRole: ['client', 'project-manager', 'admin']
    },
    {
      label: 'Documents',
      href: '/dashboard/documents',
      icon: 'document',
      requiredRole: ['client', 'project-manager', 'admin']
    },
    {
      label: 'Messages',
      href: '/dashboard/messages',
      icon: 'message',
      requiredRole: ['client', 'project-manager', 'admin']
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: 'chart',
      requiredRole: ['admin']
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: 'users',
      requiredRole: ['admin']
    }
  ];

  function hasRequiredRole(requiredRoles: string[]) {
    const userRole = $auth.user?.role;
    return requiredRoles.includes(userRole || '');
  }

  $: filteredNavigationItems = navigationItems.filter(item =>
    hasRequiredRole(item.requiredRole)
  );

  onMount(async () => {
    await auth.checkAuth();
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Mobile sidebar backdrop -->
  {#if sidebarOpen}
    <div
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      on:click={() => sidebarOpen = false}
    ></div>
  {/if}

  <!-- Sidebar -->
  <Sidebar
    {sidebarOpen}
    navigationItems={filteredNavigationItems}
    onClose={() => sidebarOpen = false}
  />

  <!-- Main content -->
  <div class="lg:pl-64">
    <Header
      user={$auth.user}
      onMenuClick={() => sidebarOpen = !sidebarOpen}
      onLogout={() => auth.logout()}
    />

    <!-- Page content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {#if $auth.isLoading}
          <div class="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        {:else if $auth.isAuthenticated}
          <slot />
        {:else}
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p class="mt-2 text-gray-600">Please log in to access this page.</p>
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>
```

### 6. Project Dashboard:

```svelte
<!-- src/routes/(dashboard)/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { projects } from '$lib/stores/projects.store';
  import { auth } from '$lib/stores/auth.store';
  import ProjectCard from '$lib/components/features/ProjectCard.svelte';
  import RecentActivity from '$lib/components/features/RecentActivity.svelte';
  import QuickActions from '$lib/components/features/QuickActions.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import StatsGrid from '$lib/components/features/StatsGrid.svelte';

  let stats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingDocuments: 0
  };

  onMount(async () => {
    await projects.fetchProjects();
    await loadDashboardStats();
  });

  async function loadDashboardStats() {
    // Load dashboard statistics from API
  }
</script>

<div class="space-y-6">
  <!-- Welcome Header -->
  <div class="bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold text-gray-900">
      Welcome back, {$auth.user?.firstName}!
    </h1>
    <p class="mt-1 text-gray-600">
      Here's what's happening with your projects today.
    </p>
  </div>

  <!-- Stats Grid -->
  <StatsGrid {stats} />

  <!-- Quick Actions -->
  <QuickActions />

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Recent Projects -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-lg shadow">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Projects</h3>
          <div class="space-y-4">
            {#if $projects.loading}
              <div class="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            {:else if $projects.projects.length === 0}
              <p class="text-gray-500 text-center py-8">No projects yet.</p>
            {:else}
              {#each $projects.projects.slice(0, 5) as project}
                <ProjectCard {project} />
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="lg:col-span-1">
      <RecentActivity />
    </div>
  </div>
</div>
```

### 7. Project Management Components:

```svelte
<!-- src/components/features/ProjectCard.svelte -->
<script lang="ts">
  export let project: Project;
  import { createEventDispatcher } from 'svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const dispatch = createEventDispatcher();

  $: statusColor = project.status === 'completed' ? 'green' :
                   project.status === 'in-progress' ? 'blue' :
                   project.status === 'intake' ? 'yellow' : 'gray';

  $: priorityColor = project.priority === 'urgent' ? 'red' :
                     project.priority === 'high' ? 'orange' :
                     project.priority === 'medium' ? 'blue' : 'gray';

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  function calculateProgress() {
    if (!project.milestones) return 0;
    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
    return Math.round((completedMilestones / project.milestones.length) * 100);
  }

  $: progress = calculateProgress();
</script>

<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
     on:click={() => dispatch('view', { id: project.id })}>
  <div class="p-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-medium text-gray-900">{project.name}</h3>
        <p class="mt-1 text-sm text-gray-600">{project.description}</p>

        <div class="mt-3 flex items-center space-x-2">
          <Badge color={statusColor} variant="outline">
            {project.status.replace('-', ' ')}
          </Badge>
          <Badge color={priorityColor} variant="solid" size="sm">
            {project.priority}
          </Badge>
        </div>
      </div>

      <div class="ml-4 flex-shrink-0">
        <Button variant="ghost" size="sm" on:click|stopPropagation={() => dispatch('edit', { id: project.id })}>
          Edit
        </Button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-4">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-green-600 h-2 rounded-full transition-all duration-300"
          style="width: {progress}%"
        ></div>
      </div>
    </div>

    <!-- Project Details -->
    <div class="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
      <div>
        <span class="font-medium">Due:</span>
        {formatDate(project.expectedDelivery)}
      </div>
      <div>
        <span class="font-medium">Client:</span>
        {project.clientName}
      </div>
    </div>
  </div>
</div>
```

### 8. Document Management:

```svelte
<!-- src/components/features/DocumentViewer.svelte -->
<script lang="ts">
  export let document: Document;
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import DownloadIcon from '$lib/components/icons/Download.svelte';

  let showModal = false;
  let loading = false;
  const dispatch = createEventDispatcher();

  async function handleDownload() {
    try {
      loading = true;
      const response = await fetch(`/api/documents/${document.id}/download`);

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      loading = false;
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getFileIcon(type: string) {
    // Return appropriate icon based on file type
    return 'document';
  }
</script>

<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <!-- File icon component -->
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {getFileIcon(document.type)}
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-medium text-gray-900 truncate">
          {document.title}
        </h4>
        <div class="flex items-center space-x-2 text-xs text-gray-500">
          <span>{document.fileName}</span>
          <span>•</span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        on:click={() => showModal = true}
      >
        View
      </Button>

      <Button
        variant="primary"
        size="sm"
        loading={loading}
        on:click={handleDownload}
      >
        <DownloadIcon class="w-4 h-4 mr-1" />
        Download
      </Button>
    </div>
  </div>

  <!-- Preview Modal -->
  {#if showModal}
    <Modal
      title={document.title}
      size="lg"
      onClose={() => showModal = false}
    >
      <div class="space-y-4">
        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
          <!-- Document preview implementation -->
          <iframe
            src={document.filePath}
            class="w-full h-full rounded-lg"
            title={document.title}
          ></iframe>
        </div>

        <div class="flex justify-end space-x-3">
          <Button variant="outline" on:click={() => showModal = false}>
            Close
          </Button>
          <Button on:click={handleDownload} loading={loading}>
            Download
          </Button>
        </div>
      </div>
    </Modal>
  {/if}
</div>
```

### 9. Message/Communication:

```svelte
<!-- src/components/features/MessageThread.svelte -->
<script lang="ts">
  export let projectId: string;
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.store';
  import MessageBubble from './MessageBubble.svelte';
  import MessageForm from './MessageForm.svelte';

  let messages = [];
  let loading = false;

  onMount(async () => {
    await loadMessages();
  });

  async function loadMessages() {
    loading = true;
    try {
      const response = await fetch(`/api/projects/${projectId}/messages`);
      messages = await response.json();
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      loading = false;
    }
  }

  async function handleMessageSent(newMessage) {
    messages = [...messages, newMessage];
  }
</script>

<div class="bg-white rounded-lg shadow">
  <div class="px-4 py-5 sm:p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Project Messages</h3>

    <!-- Message List -->
    <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
      {#if loading}
        <div class="text-center py-8">Loading messages...</div>
      {:else if messages.length === 0}
        <div class="text-center text-gray-500 py-8">
          No messages yet. Start the conversation!
        </div>
      {:else}
        {#each messages as message}
          <MessageBubble
            {message}
            isOwn={message.senderId === $auth.user?.id}
          />
        {/each}
      {/if}
    </div>

    <!-- Message Form -->
    <MessageForm
      {projectId}
      onMessageSent={handleMessageSent}
    />
  </div>
</div>
```

### 10. SvelteKit Configuration:

```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
      $components: './src/components',
      $stores: './src/stores',
      $types: './src/types',
      $utils: './src/utils'
    }
  }
};

export default config;

// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

### 11. API Integration:

```typescript
// src/lib/api/client.ts
import { browser } from '$app/environment';
import { auth } from '$lib/stores/auth.store';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = browser ? '/api' : 'http://localhost:3001/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    if ($auth.token) {
      defaultHeaders['Authorization'] = `Bearer ${$auth.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, logout user
        auth.logout();
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Projects endpoints
  async getProjects(filters?: ProjectFilters) {
    const params = new URLSearchParams(filters as any).toString();
    return this.request<Project[]>(`/projects?${params}`);
  }

  async getProject(id: string) {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: CreateProjectDto) {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  // Documents endpoints
  async getDocuments(projectId?: string) {
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request<Document[]>(`/documents${params}`);
  }

  async uploadDocument(file: File, metadata: DocumentMetadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return this.request<Document>('/documents', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData
      headers: {},
    });
  }
}

export const api = new ApiClient();
```

### 12. TypeScript Types:

```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: 'client' | 'project-manager' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  clientId: string;
  projectManagerId?: string;
  clientName?: string;
  startDate?: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  estimatedBudget?: number;
  actualBudget?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progressPercentage: number;
  healthScore?: number;
  milestones?: Milestone[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  projectId: string;
  uploadedById: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  version: string;
  accessLevel: 'public' | 'client' | 'internal';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  recipientId?: string;
  subject?: string;
  content: string;
  isInternal: boolean;
  isRead: boolean;
  attachments?: Document[];
  createdAt: string;
}
```

Provide a complete, responsive, and accessible Svelte frontend application with modern UI/UX patterns, proper state management, and seamless integration with the Hono.js backend.
```

## Integration and Deployment Prompts

```
Create comprehensive integration and deployment solutions for the Fataplus Portal built with Hono.js backend and Svelte frontend, including CI/CD pipelines, monitoring, and external system integrations.

## External System Integration Requirements:

### 1. Intake Form Integration:

```typescript
// src/integrations/intake-form.service.ts
export class IntakeFormIntegrationService {
  // Webhook endpoint to receive intake form submissions
  async handleIntakeSubmission(formData: IntakeFormData): Promise<IntegrationResponse>;

  // Convert intake data to project structure
  async convertToProject(formData: IntakeFormData): Promise<ProjectData>;

  // Create or update client account
  async createOrUpdateClient(clientData: ClientData): Promise<User>;

  // Auto-assign project manager based on workload
  async assignProjectManager(projectId: string): Promise<string>;

  // Initialize project with template-based milestones
  async initializeProject(projectData: ProjectData): Promise<Project>;

  // Send client welcome email with portal access
  async sendClientWelcome(clientId: string, projectData: ProjectData): Promise<void>;

  // Trigger document generation process
  async triggerDocumentGeneration(projectId: string, requirements: any): Promise<void>;
}

// Webhook Implementation
export const intakeWebhookHandler = async (c: Context) => {
  try {
    const body = await c.req.json();

    // Validate intake form data
    const validationResult = validateIntakeFormData(body);
    if (!validationResult.success) {
      return c.json({ error: validationResult.error }, 400);
    }

    const integrationService = new IntakeFormIntegrationService();
    const result = await integrationService.handleIntakeSubmission(body);

    return c.json({
      success: true,
      projectId: result.projectId,
      clientPortalUrl: `${process.env.FRONTEND_URL}/dashboard/projects/${result.projectId}`
    });

  } catch (error) {
    console.error('Intake webhook error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
```

### 2. Document Generation Integration:

```typescript
// src/integrations/document-generation.service.ts
export class DocumentGenerationService {
  // Handle document generation webhook
  async handleDocumentGenerated(webhookData: DocumentGeneratedEvent): Promise<void>;

  // Store generated document in portal
  async storeDocument(projectId: string, documentData: DocumentData): Promise<Document>;

  // Update project status based on document type
  async updateProjectStatus(projectId: string, documentType: string): Promise<void>;

  // Notify client of new document availability
  async notifyClientDocumentReady(projectId: string, documentId: string): Promise<void>;

  // Update milestone completion based on document delivery
  async updateMilestoneCompletion(projectId: string, documentType: string): Promise<void>;

  // Generate document preview thumbnail
  async generateDocumentPreview(documentId: string): Promise<string>;

  // Index document for search functionality
  async indexDocumentForSearch(document: Document): Promise<void>;
}

// Webhook Implementation
export const documentGenerationWebhook = async (c: Context) => {
  try {
    const webhookData = await c.req.json();

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(
      webhookData,
      c.req.header('x-signature') || '',
      process.env.DOCUMENT_GEN_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return c.json({ error: 'Invalid signature' }, 401);
    }

    const docService = new DocumentGenerationService();
    await docService.handleDocumentGenerated(webhookData);

    return c.json({ success: true });

  } catch (error) {
    console.error('Document generation webhook error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
```

### 3. Email Service Integration:

```typescript
// src/services/email.service.ts
export class EmailService {
  private brevoClient: any;
  private templates: EmailTemplates;

  constructor() {
    this.brevoClient = new BrevoApi();
    this.templates = new EmailTemplates();
  }

  // Send welcome email to new client
  async sendWelcomeEmail(user: User, projectData: ProjectData): Promise<void>;

  // Send project status update notifications
  async sendProjectUpdateNotification(project: Project, update: string): Promise<void>;

  // Send document availability notification
  async sendDocumentNotification(projectId: string, documentId: string): Promise<void>;

  // Send milestone completion notifications
  async sendMilestoneNotification(milestone: Milestone): Promise<void>;

  // Send password reset email
  async sendPasswordResetEmail(user: User, resetToken: string): Promise<void>;

  // Send weekly project digest to clients
  async sendWeeklyDigest(projectId: string): Promise<void>;

  // Send internal team notifications
  async sendInternalNotification(teamMemberIds: string[], message: string): Promise<void>;
}
```

## Deployment Configuration:

### 1. Docker Containerization:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY drizzle.config.ts ./
COPY drizzle/ ./drizzle/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Generate database types
RUN npm run db:generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/drizzle ./drizzle

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hono -u 1001

# Change ownership of app directory
RUN chown -R hono:nodejs /app
USER hono

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "start"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY svelte.config.js ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY static/ ./static/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/build ./usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose Development:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fataplus_portal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/drizzle/migrations:/docker-entrypoint-initdb.d
    networks:
      - fataplus-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - fataplus-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/fataplus_portal
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-super-secret-jwt-key
      NODE_ENV: development
    ports:
      - "3001:3001"
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      - postgres
      - redis
    networks:
      - fataplus-network
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      VITE_API_URL: http://localhost:3001/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - fataplus-network

volumes:
  postgres_data:
  redis_data:

networks:
  fataplus-network:
    driver: bridge
```

### 3. Production Deployment with Nginx:

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml+rss
               application/json application/xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    # Upstream backend
    upstream backend {
        server backend:3001;
        keepalive 32;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name portal.fataplus.com www.portal.fataplus.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name portal.fataplus.com www.portal.fataplus.com;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/portal.fataplus.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/portal.fataplus.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend static files
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Auth endpoints with stricter rate limiting
        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File uploads
        location /api/documents/ {
            client_max_body_size 100M;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
            proxy_request_buffering off;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## CI/CD Pipeline:

### 1. GitHub Actions Backend:

```yaml
# .github/workflows/backend-ci.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_portal
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run linting
        working-directory: ./backend
        run: npm run lint

      - name: Run type checking
        working-directory: ./backend
        run: npm run type-check

      - name: Run tests
        working-directory: ./backend
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_portal
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

      - name: Build application
        working-directory: ./backend
        run: npm run build

      - name: Run security audit
        working-directory: ./backend
        run: npm audit --audit-level moderate

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            fataplus/portal-backend:latest
            fataplus/portal-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/fataplus-portal
            docker-compose pull backend
            docker-compose up -d backend
            docker-compose exec backend npm run db:migrate
```

### 2. GitHub Actions Frontend:

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linting
        working-directory: ./frontend
        run: npm run lint

      - name: Run type checking
        working-directory: ./frontend
        run: npm run check

      - name: Run unit tests
        working-directory: ./frontend
        run: npm run test:unit

      - name: Run component tests
        working-directory: ./frontend
        run: npm run test:component

      - name: Build application
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_API_URL: http://localhost:3001/api

      - name: Run E2E tests
        working-directory: ./frontend
        run: npm run test:e2e

      - name: Run security audit
        working-directory: ./frontend
        run: npm audit --audit-level moderate

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            fataplus/portal-frontend:latest
            fataplus/portal-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/fataplus-portal
            docker-compose pull frontend
            docker-compose up -d frontend
```

## Monitoring and Observability:

### 1. Application Monitoring:

```typescript
// src/monitoring/monitoring.service.ts
export class MonitoringService {
  private prometheus: any;
  private winston: any;

  constructor() {
    this.setupMetrics();
    this.setupLogging();
  }

  private setupMetrics() {
    // Prometheus metrics
    this.prometheus = {
      httpRequestDuration: new Prometheus.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route', 'status_code']
      }),
      httpRequestTotal: new Prometheus.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code']
      }),
      activeUsers: new Prometheus.Gauge({
        name: 'active_users',
        help: 'Number of active users'
      }),
      projectOperations: new Prometheus.Counter({
        name: 'project_operations_total',
        help: 'Total number of project operations',
        labelNames: ['operation', 'status']
      })
    };
  }

  private setupLogging() {
    // Winston logger
    this.winston = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.winston.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  // Middleware for HTTP metrics
  metricsMiddleware() {
    return async (c: Context, next: Next) => {
      const start = Date.now();

      await next();

      const duration = Date.now() - start;
      const route = c.req.routePath || c.req.path;
      const method = c.req.method;
      const statusCode = c.res.status;

      this.prometheus.httpRequestDuration
        .labels(method, route, statusCode.toString())
        .observe(duration / 1000);

      this.prometheus.httpRequestTotal
        .labels(method, route, statusCode.toString())
        .inc();
    };
  }

  // Log user activity
  logUserActivity(userId: string, action: string, metadata?: any) {
    this.winston.info('User activity', {
      userId,
      action,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  // Track business metrics
  trackProjectOperation(operation: string, status: 'success' | 'failure') {
    this.prometheus.projectOperations
      .labels(operation, status)
      .inc();
  }
}
```

### 2. Health Check System:

```typescript
// src/health/health.service.ts
export class HealthService {
  async checkHealth(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkFileSystem(),
      this.checkExternalServices()
    ]);

    return {
      status: this.determineOverallStatus(checks),
      timestamp: new Date().toISOString(),
      checks: {
        database: this.formatCheckResult(checks[0]),
        redis: this.formatCheckResult(checks[1]),
        filesystem: this.formatCheckResult(checks[2]),
        external_services: this.formatCheckResult(checks[3])
      },
      uptime: process.uptime(),
      version: process.env.APP_VERSION || '1.0.0'
    };
  }

  private async checkDatabase(): Promise<CheckResult> {
    try {
      const start = Date.now();
      await db.select().from(users).limit(1);
      const responseTime = Date.now() - start;

      return {
        status: 'healthy',
        responseTime,
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`
      };
    }
  }

  private async checkRedis(): Promise<CheckResult> {
    try {
      const start = Date.now();
      await redis.ping();
      const responseTime = Date.now() - start;

      return {
        status: 'healthy',
        responseTime,
        message: 'Redis connection successful'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Redis connection failed: ${error.message}`
      };
    }
  }

  private async checkFileSystem(): Promise<CheckResult> {
    try {
      const testFile = './uploads/health-check.test';
      await fs.writeFile(testFile, 'health check');
      await fs.unlink(testFile);

      return {
        status: 'healthy',
        message: 'File system access successful'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `File system check failed: ${error.message}`
      };
    }
  }

  private async checkExternalServices(): Promise<CheckResult> {
    // Check document generation service
    try {
      const response = await fetch(`${process.env.DOC_GEN_URL}/health`, {
        timeout: 5000
      });

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok ? 'External services healthy' : 'External service unavailable'
      };
    } catch (error) {
      return {
        status: 'degraded',
        message: `External service check failed: ${error.message}`
      };
    }
  }
}
```

### 3. Performance Monitoring:

```typescript
// src/monitoring/performance.service.ts
export class PerformanceService {
  // Track slow queries
  async trackSlowQuery(query: string, duration: number, threshold: number = 1000) {
    if (duration > threshold) {
      this.winston.warn('Slow query detected', {
        query,
        duration,
        threshold,
        timestamp: new Date().toISOString()
      });

      this.prometheus.slowQueriesTotal.inc();
    }
  }

  // Track memory usage
  trackMemoryUsage() {
    const memUsage = process.memoryUsage();

    this.prometheus.memoryUsage.set({
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    });
  }

  // Track API response times
  trackApiResponse(endpoint: string, method: string, statusCode: number, duration: number) {
    this.prometheus.apiResponseTime
      .labels(endpoint, method, statusCode.toString())
      .observe(duration);

    if (duration > 5000) { // 5 seconds
      this.winston.warn('Slow API response', {
        endpoint,
        method,
        statusCode,
        duration,
        timestamp: new Date().toISOString()
      });
    }
  }
}
```

Provide a complete production-ready deployment solution with comprehensive monitoring, CI/CD pipelines, and external system integrations that ensure reliability, scalability, and maintainability of the Fataplus Portal.
```