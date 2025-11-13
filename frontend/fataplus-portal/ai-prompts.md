# AI-Assisted Development Prompts

This document contains optimized prompts for using AI assistants (Claude, ChatGPT, etc.) to accelerate Fataplus Portal development.

## Project Setup Prompts

### Initial Project Configuration

```
You are a senior Next.js developer setting up a B2B client portal based on the portal-mini-store-template. Help me:

1. Clone and configure the template for Fataplus client portal
2. Set up the basic project structure with these collections:
   - Users (with roles: client, project-manager, admin)
   - Projects (replacing Orders collection)
   - Documents (for PRDs, TDRs, contracts)
   - Messages (for client communication)

3. Configure authentication with role-based access control
4. Set up the database schema in Payload CMS
5. Create the basic routing structure for:
   - /dashboard (client main area)
   - /projects/[id] (individual project views)
   - /documents (document library)
   - /admin (Payload CMS admin)

Provide specific code examples and file structures for each step.
```

### Environment Configuration

```
Help me configure the development environment for a Next.js 15 + Payload CMS 3.0 project with:

1. PostgreSQL database setup
2. Environment variables configuration
3. Tailwind CSS integration
4. TypeScript configuration
5. Authentication setup using NextAuth.js

Generate all necessary configuration files with security best practices included.
```

## Feature Development Prompts

### Client Dashboard

```
Create a comprehensive client dashboard component for a B2B project management portal with the following features:

1. Project overview cards showing:
   - Project name and status
   - Progress indicator
   - Recent documents
   - Upcoming milestones

2. Quick actions section:
   - View all projects
   - Message project manager
   - Upload documents
   - Schedule meeting

3. Recent activity feed:
   - Document updates
   - Project status changes
   - Messages from team

4. Responsive design using Tailwind CSS
5. TypeScript with proper type definitions
6. Server-side data fetching with proper error handling

The dashboard should load project data from our Payload CMS API and display a personalized experience for each client.
```

### Document Management System

```
Build a document management system for a client portal with these requirements:

1. Document Library Component:
   - Grid and list view options
   - Search and filter capabilities
   - Document type badges (PRD, TDR, Contract, etc.)
   - Download functionality
   - Version history display

2. Document Viewer:
   - PDF preview capability
   - Secure file serving
   - Version comparison
   - Annotation support for future enhancement

3. Upload Component:
   - Drag and drop interface
   - File type validation
   - Progress indicators
   - Automatic categorization
   - Access control settings

4. Integration with Payload CMS media collection
5. Proper TypeScript interfaces for all data structures
6. Security measures to prevent unauthorized access

Provide complete React components with proper error boundaries and loading states.
```

### Project Management Features

```
Develop project management functionality for a client portal including:

1. Project Detail View:
   - Project information header
   - Timeline/Gantt chart view
   - Milestone tracking
   - Team member display
   - Document association

2. Project Status Management:
   - Status indicators (Intake, Planning, In Progress, Review, Completed)
   - Progress percentage calculation
   - Status change history
   - Automatic notifications on status updates

3. Milestone Component:
   - Milestone creation/editing
   - Due date management
   - Completion tracking
   - Associated documents/messages

4. Communication Integration:
   - Message thread per project
   - File attachment capability
   - Email notification preferences
   - Read/unread status

Use modern React patterns with hooks, context for state management, and integrate with our Payload CMS backend.
```

### Authentication and Authorization

```
Implement a comprehensive authentication and authorization system for a B2B client portal:

1. Role-Based Access Control (RBAC):
   - Client: Can view own projects, download documents, send messages
   - Project Manager: Can manage projects, upload documents, communicate with clients
   - Admin: Full system access

2. Authentication Features:
   - Login/logout functionality
   - Password reset flow
   - Email verification
   - Session management
   - Remember me option

3. Security Measures:
   - JWT token handling
   - Rate limiting on auth endpoints
   - CSRF protection
   - Secure password hashing
   - Session timeout handling

4. Authorization Middleware:
   - Route protection based on roles
   - API endpoint protection
   - Resource-level access control
   - Permission checking utilities

Provide complete implementation using NextAuth.js with Payload CMS integration, including all API routes and middleware.
```

## Integration Prompts

### Intake Form Integration

```
Create integration between our existing intake form system and the new client portal:

1. Webhook Endpoint (/api/webhooks/intake):
   - Receive intake form submissions
   - Validate incoming data using Zod schemas
   - Create/update client accounts automatically
   - Initialize project records
   - Trigger welcome email sequence

2. Client Account Creation:
   - Generate secure temporary passwords
   - Send account activation emails
   - Assign default permissions
   - Link to existing projects if client exists

3. Project Initialization:
   - Create project record from intake data
   - Assign project manager automatically
   - Set up initial project structure
   - Generate welcome dashboard

4. Error Handling:
   - Duplicate email handling
   - Invalid data responses
   - Logging for debugging
   - Retry mechanisms for failed creations

Provide complete API route implementation with proper TypeScript types and error handling.
```

### Document Generation Integration

```
Build integration with our document generation service to automatically populate the client portal:

1. Document Generation Webhook (/api/webhooks/document-generated):
   - Receive notifications when PRDs/TDRs are generated
   - Parse document metadata and content
   - Upload documents to appropriate projects
   - Update project status accordingly
   - Notify clients via email

2. Document Processing:
   - Extract document information (title, type, version)
   - Generate preview thumbnails
   - Store in Payload CMS media collection
   - Create proper access permissions
   - Index for search functionality

3. Client Notifications:
   - Email notifications for new documents
   - In-app notification system
   - SMS notifications for urgent updates
   - Digest email summaries

4. Status Management:
   - Automatic project status updates
   - Milestone completion tracking
   - Progress percentage calculations
   - Dashboard refresh triggers

Provide complete webhook handlers with proper validation, error handling, and integration with our Payload CMS collections.
```

## UI/UX Development Prompts

### Responsive Design System

```
Create a comprehensive design system for the Fataplus client portal using Tailwind CSS:

1. Color Palette:
   - Primary colors based on Fataplus brand (#18CF4C green)
   - Secondary colors for different status indicators
   - Neutral colors for text and backgrounds
   - Accessibility compliant color combinations

2. Typography Scale:
   - Heading sizes (h1-h6) with proper spacing
   - Body text variants
   - Font weights and line heights
   - Responsive text sizing

3. Component Library:
   - Button variants (primary, secondary, danger, ghost)
   - Form elements (inputs, selects, textareas)
   - Cards and containers
   - Navigation components
   - Modal and dialog components

4. Layout Components:
   - Header with navigation
   - Sidebar menu system
   - Footer component
   - Responsive grid layouts
   - Loading and skeleton states

5. Interactive Elements:
   - Hover effects
   - Focus states
   - Transition animations
   - Loading spinners
   - Error states

Provide complete CSS classes and React components with TypeScript interfaces.
```

### Accessibility Implementation

```
Implement comprehensive accessibility features throughout the client portal:

1. Keyboard Navigation:
   - Tab order management
   - Focus indicators
   - Skip navigation links
   - Keyboard shortcuts for common actions

2. Screen Reader Support:
   - Proper ARIA labels and roles
   - Semantic HTML structure
   - Live regions for dynamic content
   - Alt text for images

3. Visual Accessibility:
   - High contrast mode support
   - Text scaling up to 200%
   - Focus visible states
   - Color blindness considerations

4. Form Accessibility:
   - Proper labeling and descriptions
   - Error message associations
   - Validation announcements
   - Required field indicators

5. Testing and Validation:
   - Automated accessibility testing setup
   - Manual testing guidelines
   - WCAG 2.1 AA compliance checklist
   - Accessibility statement template

Provide specific code implementations and testing configurations.
```

## Testing Prompts

### Unit Testing Setup

```
Set up comprehensive unit testing for the Fataplus client portal:

1. Testing Framework Configuration:
   - Jest and React Testing Library setup
   - TypeScript integration
   - Coverage reporting
   - Mock configurations

2. Component Testing:
   - Button components with various props
   - Form input validation
   - Modal open/close functionality
   - Data loading states
   - Error boundary testing

3. API Route Testing:
   - Authentication endpoints
   - Project CRUD operations
   - Document upload/download
   - Error handling scenarios
   - Permission checking

4. Hook Testing:
   - Custom data fetching hooks
   - Authentication state hooks
   - Form handling hooks
   - Local storage hooks

5. Utility Function Testing:
   - Date formatting functions
   - Validation utilities
   - API response transformers
   - Permission checking functions

Provide complete test files with mocking strategies and coverage targets.
```

### Integration Testing

```
Create integration tests for the client portal's key workflows:

1. User Authentication Flow:
   - Login with valid credentials
   - Login with invalid credentials
   - Password reset flow
   - Logout functionality
   - Protected route access

2. Project Management Flow:
   - Create new project
   - Update project details
   - Upload project documents
   - Send project messages
   - Change project status

3. Document Management Flow:
   - Upload various file types
   - Download documents
   - Search and filter documents
   - Manage document versions
   - Access permission testing

4. Client Communication:
   - Send messages between client and PM
   - File attachment uploads
   - Email notification triggers
   - Real-time updates

5. Admin Functionality:
   - User management operations
   - Project assignment
   - Document permissions
   - System configuration changes

Provide end-to-end test scenarios using Playwright or Cypress with proper test data management.
```

## Performance Optimization Prompts

### Performance Optimization

```
Optimize the Fataplus client portal for production performance:

1. Code Splitting Strategy:
   - Route-based code splitting
   - Component lazy loading
   - Dynamic imports optimization
   - Bundle size analysis

2. Image Optimization:
   - Next.js Image component usage
   - Responsive image techniques
   - WebP format support
   - Lazy loading implementation

3. Database Optimization:
   - Query optimization techniques
   - Indexing strategies
   - Caching implementation
   - Connection pooling

4. API Performance:
   - Response time optimization
   - Compression implementation
   - Caching headers setup
   - Rate limiting configuration

5. Frontend Performance:
   - Component rendering optimization
   - State management efficiency
   - Memory leak prevention
   - Build optimization

Provide specific code changes and configuration updates with performance metrics.
```

### SEO and Analytics

```
Implement SEO best practices and analytics for the client portal:

1. SEO Optimization:
   - Meta tags management
   - Open Graph tags
   - Structured data implementation
   - XML sitemaps
   - Robots.txt configuration

2. Analytics Integration:
   - Google Analytics 4 setup
   - Custom event tracking
   - User behavior analytics
   - Conversion tracking
   - Privacy compliance

3. Performance Monitoring:
   - Core Web Vitals tracking
   - User experience metrics
   - Error rate monitoring
   - Uptime monitoring setup

4. Content Optimization:
   - Search functionality within portal
   - Document indexing for search
   - Content caching strategies
   - CDN configuration

Provide complete implementation with privacy and security considerations.
```

## Troubleshooting Prompts

### Debugging Common Issues

```
Help me debug and resolve common issues in Next.js + Payload CMS applications:

1. Authentication Issues:
   - JWT token not persisting
   - Role-based access not working
   - Session management problems
   - Protected route bypassing

2. Database Connection Problems:
   - Connection timeout errors
   - Query performance issues
   - Migration failures
   - Data consistency problems

3. File Upload Issues:
   - Large file upload failures
   - S3 integration problems
   - File type validation errors
   - Permission denied errors

4. Build and Deployment Issues:
   - Build time errors
   - Environment variable problems
   - Deployment failures
   - Runtime errors in production

Provide step-by-step debugging procedures and solution strategies for each category.
```

### Security Audit

```
Conduct a comprehensive security audit of the client portal implementation:

1. Authentication Security:
   - Password strength requirements
   - Brute force protection
   - Session management security
   - Multi-factor authentication options

2. API Security:
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection measures
   - CSRF token implementation

3. Data Protection:
   - Encryption at rest and in transit
   - PII handling compliance
   - Data access logging
   - Backup encryption

4. Infrastructure Security:
   - HTTPS configuration
   - Security headers implementation
   - Dependency vulnerability scanning
   - Access control policies

Provide security checklist and remediation strategies for identified vulnerabilities.
```

## Customization Prompts

### Brand Integration

```
Help me integrate the Fataplus branding into the client portal:

1. Visual Identity Integration:
   - Logo placement and sizing
   - Brand color application (#18CF4C primary green)
   - Typography matching brand guidelines
   - Icon system development

2. Component Customization:
   - Header with Fataplus logo
   - Footer with company information
   - Custom loading screens
   - Branded error pages

3. Content Customization:
   - Welcome email templates
   - Notification message templates
   - Help and support content
   - Onboarding flow customization

4. Configuration Management:
   - Environment-specific branding
   - White-labeling capabilities
   - Multi-tenant support preparation
   - Brand asset management

Provide complete implementation with maintainable configuration system.
```

These prompts are designed to help AI assistants understand the specific requirements and context of the Fataplus Portal project, enabling them to provide more accurate and useful code implementations.
TodoWrite
<arg_key>todos</arg_key>
<arg_value>[{"content": "Create project overview and requirements document", "status": "completed", "activeForm": "Created project overview and requirements document"}, {"content": "Develop setup and installation guide", "status": "completed", "activeForm": "Developed setup and installation guide"}, {"content": "Create architecture and technical specifications", "status": "completed", "activeForm": "Creating architecture and technical specifications"}, {"content": "Write development workflows and best practices", "status": "completed", "activeForm": "Writing development workflows and best practices"}, {"content": "Create deployment and configuration documentation", "status": "completed", "activeForm": "Creating deployment and configuration documentation"}, {"content": "Generate prompts for AI-assisted development", "status": "completed", "activeForm": "Generating prompts for AI-assisted development"}]