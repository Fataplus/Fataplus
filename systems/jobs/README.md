# Jobs

This folder contains all background jobs, scheduled tasks, and asynchronous workflows for Fataplus systems.

## Purpose

- Define all long-running, scheduled, or asynchronous operations that are not handled in the main request/response cycle
- Enable decoupling of heavy or delayed work from user-facing services
- Support event-driven, scheduled, and batch processing
- Centralize job logic for maintainability, monitoring, and retry

## Example Jobs

- **OrderFulfillmentJob:** Process and fulfill orders (shipping, notifications, inventory updates)
- **SyncVendorsJob:** Synchronize vendor/product data with ERP or external systems
- **SendNotificationJob:** Deliver emails, SMS, or push notifications
- **GenerateReportJob:** Produce analytics or financial reports
- **AIAssistantJob:** Process AI assistant requests in the background
- **PaymentReconciliationJob:** Reconcile payments with Stripe or other providers
- **PurgeOldDataJob:** Clean up old records, logs, or temporary files
- **CourseProgressJob:** Update user progress and award certificates
- **ImportDataJob:** Import data from CSV, API, or external sources

## Usage

- Jobs are triggered by events, schedules (cron), or explicit service calls
- Should use typed input/output (see systems/types, e.g., JobInput/JobOutput)
- Should be idempotent and retry-safe
- Should log progress and errors for monitoring
- Can be distributed across workers or queues

## Example

```ts
// Example: SendNotificationJob (skeleton)
export async function SendNotificationJob(input: NotificationDTO): Promise<void> {
  // 1. Validate input
  // 2. Call NotificationAdapter to send message
  // 3. Log result and handle errors/retries
}
```

## Best Practices

- Keep jobs focused and stateless
- Use adapters for all infrastructure access
- Document each job and its input/output in this folder
- Use events to trigger jobs when possible
- Write tests for job logic and error handling
- Monitor and alert on job failures

---
