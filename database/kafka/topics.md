# Kafka Topics Specification

| Topic Name | Partitions | Replication Factor | Retention | Key | Payload |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ride.lifecycle.events` | 12 | 3 | 7 days | `tripId` | RideRequested, DriverAccepted, TripStarted, TripCompleted, TripCancelled |
| `driver.telemetry.pings` | 24 | 3 | 24 hours | `driverId` | GPS Coordinates, Speed, Heading, Battery, Timestamp |
| `payments.processed` | 6 | 3 | 30 days | `paymentId` | PaymentCompleted, PaymentFailed, RefundIssued |
| `notifications.dispatch` | 6 | 3 | 24 hours | `userId` | SMS, Email, Push Notification payloads |
| `analytics.metrics` | 12 | 3 | 30 days | `regionId` | Aggregated demand-supply metrics, trip completions |
