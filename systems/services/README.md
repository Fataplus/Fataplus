# Services

This folder contains all core business services for Fataplus systems.

## Purpose

- Encapsulate all business logic, domain operations, and use cases
- Serve as the main entry point for orchestrators, jobs, and API endpoints to perform business actions
- Coordinate domain models, policies, adapters, and events
- Enforce business rules and workflows at the application level

## Example Services

- **UserService:** User registration, authentication, profile management
- **OrderService:** Order creation, validation, fulfillment, and status updates
- **ProductService:** Product catalog management, inventory, pricing
- **CourseService:** Course enrollment, progress tracking, certification
- **NotificationService:** Sending notifications via adapters (email, SMS, push)
- **PaymentService:** Payment processing, refunds, reconciliation
- **VendorService:** Vendor onboarding, product sync, analytics
- **AIAssistantService:** AI query handling, context management, quota enforcement

## Usage

- Services are called by orchestrators, jobs, API endpoints, and other services
- Should use types from `systems/types` for input/output
- Should call adapters for all infrastructure access (DB, APIs, etc.)
- Should emit events for significant domain changes
- Should enforce policies for authorization and business rules

## Example

```ts
// Example: OrderService (skeleton)
import { OrderDTO } from "../types";
import { OrderAdapter } from "../adapters";
import { emitEvent } from "../events";
import { checkPolicy } from "../policies";

export class OrderService {
  async createOrder(input: OrderDTO, user: UserDTO) {
    // 1. Check business and authorization policies
    await checkPolicy("order:create", { user, input });

    // 2. Persist order using adapter
    const order = await OrderAdapter.create(input);

    // 3. Emit event for downstream jobs
    await emitEvent("OrderPlaced", { order });

    // 4. Return result
    return order;
  }
}
```

## Best Practices

- Keep services focused on business logic, not infrastructure
- Use dependency injection for adapters and policies
- Document each service and its methods in this folder
- Write unit and integration tests for all service logic
- Emit events for all important domain changes
- Use types everywhere for input/output

---
