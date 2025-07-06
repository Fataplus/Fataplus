# Orchestration

This folder contains all orchestration logic for Fataplus systems.

## Purpose

- Coordinate complex workflows and business processes across multiple services, jobs, and adapters
- Implement use cases that require multiple steps, transactions, or side effects
- Handle sagas, distributed transactions, and compensation logic
- Manage event-driven and scheduled workflows

## Example Orchestrations

- **OrderPlacementOrchestrator:** Handles the full order placement flow (validate, reserve stock, process payment, emit events, send notifications)
- **UserRegistrationOrchestrator:** Manages user signup, email verification, welcome notification, and onboarding
- **CourseEnrollmentOrchestrator:** Coordinates course enrollment, payment, and progress tracking
- **VendorSyncOrchestrator:** Orchestrates periodic vendor/product sync with ERP
- **AIRequestOrchestrator:** Handles AI assistant requests, quota checks, and response delivery
- **PaymentRefundOrchestrator:** Manages refund process, updates order/payment status, and notifies user

## Usage

- Orchestrators are called by API endpoints, jobs, or event listeners to execute business workflows
- Should call services, policies, adapters, and emit events as needed
- Should handle errors, retries, and compensation logic for long-running workflows
- Can be implemented as classes or functions (stateless or stateful as needed)
- Should log all workflow steps and outcomes

## Example

```ts
// Example: OrderPlacementOrchestrator (skeleton)
export async function OrderPlacementOrchestrator(orderInput: OrderDTO) {
  // 1. Validate order and user (call policies)
  // 2. Reserve stock (call ProductService)
  // 3. Process payment (call PaymentAdapter)
  // 4. Create order record (call OrderService)
  // 5. Emit OrderPlacedEvent
  // 6. Send notification (call NotificationAdapter)
  // 7. Handle errors and compensation if needed
}
```

## Best Practices

- Keep orchestration logic separate from business logic (services) and infrastructure (adapters)
- Use clear, typed input/output (see systems/types)
- Make workflows idempotent and retry-safe where possible
- Document each orchestrator and its workflow steps in this folder
- Write integration tests for orchestrators

---
