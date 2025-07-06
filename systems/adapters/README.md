# Adapters

This folder contains all infrastructure adapters for Fataplus systems.

## Purpose

- Abstract and encapsulate all access to external systems, databases, APIs, and services
- Provide a clean, testable interface for services, jobs, and orchestrators to interact with infrastructure
- Enable easy swapping, mocking, or extension of infrastructure dependencies
- Decouple business logic from implementation details of external systems

## Example Adapters

- **DatabaseAdapter:** CRUD operations for users, products, orders, etc. (e.g., Drizzle ORM, SQLite, D1)
- **PaymentAdapter:** Integrate with Stripe or other payment providers
- **NotificationAdapter:** Send emails, SMS, push notifications (e.g., Nodemailer, Pusher, Cloudinary)
- **VendorAdapter:** Sync with ERP or external vendor/product systems (e.g., Dolibarr, Nextcloud)
- **AIAdapter:** Call external AI APIs (e.g., OpenAI, Workers AI)
- **StorageAdapter:** Manage file uploads/downloads (e.g., Cloudinary, R2)
- **AuthAdapter:** Handle authentication and JWT (e.g., Auth.js, custom JWT)
- **WebSocketAdapter:** Real-time communication (e.g., Pusher, Socket.io)
- **ExternalApiAdapter:** Integrate with third-party APIs (e.g., weather, market prices)

## Usage

- Adapters are called by services, jobs, and orchestrators to perform infrastructure operations
- Should expose a typed, promise-based interface
- Should handle all error mapping and retries internally
- Should be stateless and reusable
- Should be mockable for testing

## Example

```ts
// Example: PaymentAdapter (skeleton)
export class PaymentAdapter {
  static async charge(input: ChargeDTO): Promise<PaymentResult> {
    // 1. Call Stripe API
    // 2. Map Stripe response to PaymentResult
    // 3. Handle errors and retries
  }
}
```

## Best Practices

- Keep adapters focused on a single external system or protocol
- Do not mix business logic into adapters
- Document each adapter and its methods in this folder
- Use environment variables for credentials and endpoints
- Write integration and unit tests for all adapters
- Use adapters everywhere infrastructure access is needed

---
