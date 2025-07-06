# Events

This folder contains all domain and integration events for Fataplus systems.

## Purpose

- Define all events that represent significant actions, state changes, or notifications in the system
- Enable event-driven architecture for decoupling, extensibility, and observability
- Support both domain events (business-level) and integration events (external systems)
- Facilitate communication between services, jobs, orchestrators, and adapters

## Example Events

- **OrderPlacedEvent:** Emitted when a new order is placed
- **OrderFulfilledEvent:** Emitted when an order is fulfilled
- **ProductCreatedEvent:** Emitted when a new product is added
- **UserRegisteredEvent:** Emitted when a user registers
- **PaymentSucceededEvent:** Emitted when a payment is successful
- **NotificationSentEvent:** Emitted after a notification is delivered
- **VendorSyncedEvent:** Emitted after vendor data is synced with ERP
- **AIRequestCompletedEvent:** Emitted after an AI assistant request is processed
- **CourseCompletedEvent:** Emitted when a user completes a course

## Usage

- Events are emitted by services, jobs, and orchestrators to signal state changes or actions
- Can be handled by event listeners, jobs, or external integrations
- Should use typed payloads (see systems/types, e.g., EventDTO)
- Can be persisted, published to queues, or broadcast via WebSockets
- Should be versioned and documented

## Example

```ts
// Example: OrderPlacedEvent (skeleton)
export interface OrderPlacedEvent {
  type: "OrderPlaced";
  payload: {
    orderId: string;
    userId: string;
    timestamp: Date;
    // ...other relevant fields
  };
}
```

## Best Practices

- Use clear, descriptive event names (verb + noun, e.g., OrderPlaced)
- Keep event payloads minimal but sufficient for consumers
- Document each event and its payload in this folder
- Version events if payloads change
- Write tests for event emission and handling
- Use events to decouple business logic and enable extensibility

---
