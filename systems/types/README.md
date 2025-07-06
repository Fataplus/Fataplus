# Types

This folder contains all shared TypeScript types, interfaces, and enums for Fataplus systems.

## Purpose

- Define all domain models, DTOs, event payloads, and type contracts used across systems
- Ensure type safety and consistency between services, jobs, adapters, policies, events, and orchestrators
- Enable code sharing and refactoring across modules
- Serve as the single source of truth for all system-wide types

## Example Types

- **UserDTO:** User profile, roles, and permissions
- **OrderDTO:** Order details, status, and line items
- **ProductDTO:** Product information, pricing, and inventory
- **CourseDTO:** Course metadata, modules, and progress
- **NotificationDTO:** Notification payloads (email, SMS, push)
- **PaymentDTO:** Payment request/response
- **VendorDTO:** Vendor and supplier data
- **AIRequestDTO:** AI assistant request/response
- **PolicyContext:** Context for policy checks (user, action, resource)
- **EventDTO:** Base event payload structure
- **JobInput/JobOutput:** Input/output for jobs

## Usage

- Types are imported and used by all systems modules (services, jobs, adapters, policies, events, orchestration)
- Should be versioned and documented
- Should use enums for status, roles, and other fixed values
- Should be organized by domain (user, order, product, etc.)
- Should be tested for compatibility and correctness

## Example

```ts
// Example: UserDTO
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // ...other fields
}

export enum UserRole {
  Farmer = "farmer",
  Vendor = "vendor",
  Admin = "admin",
  // ...
}
```

## Best Practices

- Keep types focused and reusable
- Use interfaces for data models and DTOs
- Use enums for fixed value sets (roles, status, etc.)
- Document each type and its fields in this folder
- Use types everywhere for input/output, events, jobs, and policies
- Refactor and update types as the domain evolves

---
