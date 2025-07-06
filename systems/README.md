# Fataplus Systems Layer

This directory centralizes all cross-domain business logic, orchestration, reusable services, policies, jobs, and event-driven workflows for the Fataplus platform.

## Purpose

- Decouple business logic from domain modules (marketplace, learning, community)
- Enable maintainable, scalable, and testable cross-domain workflows
- Provide reusable, framework-agnostic (TypeScript) services and orchestrators
- Support both Nuxt (main platform) and Next.js (fataplus-app SaaS shell) via adapters

## Structure

```
systems/
├── orchestration/   # Workflow engines, orchestrators (e.g., PurchaseWorkflow)
├── services/        # Reusable business services (NotificationService, PaymentService, etc.)
├── policies/        # RBAC, quotas, feature flags, business rules
├── jobs/            # Scheduled/background jobs (reminders, batch analytics)
├── events/          # Event types, event bus, pub/sub utilities
├── adapters/        # Nuxt/Nitro and Next.js API adapters
└── types/           # Shared types/interfaces for system modules
```

## Core Modules

- **NotificationService:** Email, in-app, SMS, Pusher notifications
- **PaymentService:** Stripe, Whop, payment orchestration
- **RBACService:** Role/permission checks for admin, vendor, farmer, etc.
- **AnalyticsService:** Cross-domain metrics and reporting
- **AIQuotaService:** Track and enforce AI usage quotas
- **EventBus:** Simple event bus for intra-system communication
- **PurchaseWorkflow:** Orchestrator for product purchase → payment → course unlock → notification
- **Adapters:** For Nuxt server, API endpoints, and Next.js API routes

## Integration

- Refactor domain modules to use system services via adapters
- Expose system APIs to the fataplus-app SaaS shell as needed
- All system modules are framework-agnostic and testable

## Implementation Roadmap

1. Scaffold subfolders with `index.ts` and `README.md`
2. Implement `NotificationService` and `EventBus`
3. Implement a proof-of-concept cross-domain workflow (purchase triggers course unlock and notification)
4. Document usage and integration patterns in `docs/`
5. Incrementally migrate business logic from domain modules to systems

## Benefits

- Improved maintainability, scalability, and testability
- Clear separation of business logic and orchestration from domain implementation
- Easier cross-platform (Nuxt/Next.js) integration and future extensibility

---
