# Policies

This folder contains all authorization and business rule policies for Fataplus systems.

## Purpose

- Define and enforce access control, permissions, and business rules for all actions in the system
- Centralize all policy logic for maintainability and auditability
- Enable consistent, testable, and composable policy checks across services, jobs, and orchestrators
- Support both RBAC (role-based access control) and fine-grained business rules

## Example Policies

- **CanPlaceOrderPolicy:** Checks if a user can place an order (role, quota, account status)
- **CanEditProductPolicy:** Checks if a vendor or admin can edit a product
- **CanAccessCoursePolicy:** Checks if a user has access to a course (enrollment, payment, role)
- **IsAdminPolicy:** Checks if a user has admin privileges
- **CanSendNotificationPolicy:** Checks if a user or system can send a notification
- **CanSyncVendorPolicy:** Checks if a vendor sync is allowed (rate limits, permissions)
- **CanUseAIAssistantPolicy:** Checks if a user can access AI assistant (quota, subscription)
- **CanViewReportPolicy:** Checks if a user can view analytics or financial reports

## Usage

- Policies are called by services, jobs, and orchestrators before performing sensitive or restricted actions
- Should be pure functions or classes that return boolean or error
- Should use typed input (see systems/types, e.g., PolicyContext)
- Can be composed for complex rules (e.g., AND/OR/NOT)
- Should be unit tested for all edge cases

## Example

```ts
// Example: CanPlaceOrderPolicy (skeleton)
export function CanPlaceOrderPolicy(context: PolicyContext): boolean {
  // 1. Check user role (must be 'farmer' or 'vendor')
  // 2. Check account status (active)
  // 3. Check order quota (not exceeded)
  // 4. Return true if all checks pass, false otherwise
}
```

## Best Practices

- Keep policies focused and composable
- Do not mix infrastructure or side effects into policies
- Document each policy and its rules in this folder
- Use enums and types for clarity (see systems/types)
- Write unit tests for all policy logic
- Use policies everywhere permissions or business rules are required

---
