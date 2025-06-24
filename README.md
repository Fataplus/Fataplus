# Fataplus - Digital Agriculture Platform for Madagascar

A comprehensive digital platform designed specifically for Madagascar's agricultural sector, built with NuxtHub (Nuxt 3, Vue 3, TypeScript) and optimized for Cloudflare deployment.

## 🌱 Platform Overview

**Fataplus** is a three-pillar agricultural platform connecting farmers, vendors, and agricultural knowledge across Madagascar:

### 🏪 **Marketplace**
- Multi-category e-commerce (seeds, tools, fertilizers, equipment)
- Real-time order tracking and delivery management
- Integrated payment processing with Stripe
- Vendor management and rating system
- AI-powered product recommendations
- Multi-language support (French/Malagasy)

### 📚 **Learning Management System (LMS)**
- AI-powered personalized learning paths
- Interactive courses with video content and subtitles
- Gamification with badges, points, and leaderboards
- Automated quiz generation and assessment
- Certificate generation with digital signatures
- Integration with Outline knowledge base

### 👥 **Community Platform**
- Comprehensive farmer profiles with verification
- Real-time messaging and group chat
- Agricultural events and workshop management
- Expert forums and Q&A system
- Farmer-to-farmer matchmaking and mentorship
- Collaborative project management

## 🏗️ Architecture

### **Modular Domain-Driven Design**
```
Fataplus/
├── modules/                    # Domain-specific modules
│   ├── marketplace/           # E-commerce functionality
│   ├── learning/              # LMS and AI features
│   └── community/             # Social and networking
├── shared/                    # Cross-domain utilities
│   ├── components/ui/         # Reusable UI components
│   ├── composables/           # Shared composables
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Utility functions
├── integrations/              # External service integrations
│   ├── dolibarr/             # ERP integration
│   ├── nextcloud/            # File management
│   ├── docuseal/             # Document signing
│   ├── outline/              # Knowledge base
│   └── stripe/               # Payment processing
├── server/                    # Backend API and database
│   ├── api/                  # REST API endpoints
│   ├── database/             # Database schema and migrations
│   └── middleware/           # Server middleware
└── tests/                     # Comprehensive testing suite
    ├── unit/                 # Unit tests
    ├── integration/          # Integration tests
    ├── e2e/                 # End-to-end tests
    └── fixtures/            # Test data
```

## 🛠️ Technology Stack

### **Frontend**
- **Nuxt 3** - Vue.js meta-framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Nuxt UI** - Component library
- **Pinia** - State management

### **Backend**
- **Nitro** - Server engine
- **Drizzle ORM** - Type-safe database toolkit
- **SQLite** - Development database
- **Auth.js** - Authentication system
- **Zod** - Schema validation

### **Integrations**
- **Stripe** - Payment processing
- **OpenAI** - AI-powered features
- **Cloudinary** - Media management
- **Pusher** - Real-time communications
- **Dolibarr** - ERP integration
- **Nextcloud** - File management
- **DocuSeal** - Document signing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **TypeScript** - Static typing

## 🎯 Key Features Implemented

### **✅ Project Foundation**
- [x] **Scalable folder structure** with domain-driven architecture
- [x] **TypeScript configuration** with strict mode and path mapping
- [x] **ESLint & Prettier** for code quality and consistency
- [x] **Testing infrastructure** with Vitest and Playwright
- [x] **Comprehensive type definitions** for all domains

### **✅ Development Workflow**
- [x] **Domain-specific .cursor/rules** for guided development
- [x] **Git workflow** with proper .gitignore
- [x] **Package.json scripts** for development, testing, and deployment
- [x] **EditorConfig** for team consistency

### **✅ Marketplace Module**
- [x] **Products store** with Pinia state management
- [x] **Cart functionality** with local storage persistence
- [x] **Product management** composables and utilities
- [x] **ProductCard component** with responsive design
- [x] **Database schema** for products, orders, and vendors

### **✅ Shared Components**
- [x] **LoadingSpinner** - Reusable loading component
- [x] **EmptyState** - Consistent empty state handling
- [x] **Type-safe API responses** and error handling

### **✅ Database Design**
- [x] **User management** schema with profiles and sessions
- [x] **Marketplace** schema with products, orders, and reviews
- [x] **Notification system** with type-safe messages
- [x] **Modular schema** organization by domain

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ (recommend Node 18 or 20 for better-sqlite3 compatibility)
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd Fataplus

# Install dependencies (use Node 18 or 20)
npm install

# Set up environment variables
cp .env.example .env

# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### **Development Scripts**
```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint issues
npm run format                 # Format code with Prettier
npm run format:check           # Check code formatting
npm run typecheck              # TypeScript type checking

# Testing
npm test                       # Run unit tests
npm run test:ui                # Run tests with UI
npm run test:coverage          # Run tests with coverage
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Run E2E tests with UI

# Database
npm run db:generate            # Generate migrations
npm run db:migrate             # Run migrations
npm run db:studio             # Open Drizzle Studio

# Deployment
npm run deploy                 # Deploy to Cloudflare
```

## 🎨 Design Principles

### **Accessibility First**
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

### **Mobile-First Responsive Design**
- Progressive enhancement
- Touch-friendly interfaces
- Offline capabilities
- Fast loading times

### **Internationalization**
- French and Malagasy language support
- RTL layout support ready
- Cultural adaptation for Madagascar

### **Security by Design**
- Input validation with Zod schemas
- XSS and CSRF protection
- Secure authentication flow
- Data encryption at rest

## 📱 Integration Roadmap

### **Phase 1: Core Platform** ✅
- [x] Marketplace foundation
- [x] User management
- [x] Basic UI components
- [x] Database schema

### **Phase 2: Learning System** 🚧
- [ ] Course management
- [ ] AI-powered recommendations
- [ ] Progress tracking
- [ ] Certificate generation

### **Phase 3: Community Features** 🚧
- [ ] Real-time messaging
- [ ] Event management
- [ ] Forum system
- [ ] Expert matching

### **Phase 4: Advanced Integrations** 📋
- [ ] Dolibarr ERP integration
- [ ] Nextcloud file management
- [ ] DocuSeal document workflow
- [ ] Advanced analytics

## 🌐 Deployment

### **Cloudflare Configuration**
The platform is optimized for Cloudflare deployment with:
- **Pages** for static site hosting
- **Workers** for serverless functions
- **D1** for database (SQLite)
- **R2** for file storage
- **Analytics** for performance monitoring

### **Environment Variables**
Create a `.env` file with the following variables:
```env
# Authentication
NUXT_AUTH_SECRET=your-auth-secret

# Database
DATABASE_URL=your-database-url

# OpenAI
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Pusher
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
```

## 🤝 Contributing

### **Development Guidelines**
1. Follow the domain-driven architecture
2. Use TypeScript strict mode
3. Write comprehensive tests
4. Follow the established coding standards
5. Update documentation for new features

### **Code Quality Standards**
- **ESLint** rules for consistent code style
- **Prettier** for automatic code formatting
- **TypeScript** for type safety
- **Test coverage** minimum 80%
- **Component documentation** for public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Team

Built with ❤️ for Madagascar's agricultural community by the Fataplus team.

---

*Fataplus - Empowering Madagascar's agricultural future through technology* 