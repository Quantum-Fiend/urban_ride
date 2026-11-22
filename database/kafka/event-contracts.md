# Kafka Domain Event Contracts

## 1. RideRequestedEvent
```json
{
  "eventId": "evt_7f8a1290-b321-4f11",
  "eventType": "RIDE_REQUESTED",
  "timestamp": "2026-11-22T06:20:00Z",
  "tripId": 1042,
  "riderId": 88,
  "pickup": {"lat": 12.9716, "lng": 77.5946, "address": "Indiranagar 100ft Rd"},
  "dropoff": {"lat": 12.9352, "lng": 77.6245, "address": "Koramangala 4th Block"},
  "requestedTier": "COMFORT",
  "estimatedFare": 24.50,
  "surgeMultiplier": 1.2
}
```

## 2. TripCompletedEvent
```json
{
  "eventId": "evt_991b34a1-09cd-4a21",
  "eventType": "TRIP_COMPLETED",
  "timestamp": "2026-11-22T06:42:15Z",
  "tripId": 1042,
  "riderId": 88,
  "driverId": 24,
  "finalFare": 24.50,
  "distanceKm": 8.4,
  "durationMinutes": 22,
  "completedAt": "2026-11-22T06:42:15Z"
}
```

## 3. PaymentCompletedEvent
```json
{
  "eventId": "evt_1a82bf90-21a4-44cc",
  "eventType": "PAYMENT_COMPLETED",
  "timestamp": "2026-11-22T06:42:18Z",
  "paymentId": 501,
  "tripId": 1042,
  "amount": 24.50,
  "driverEarnings": 19.60,
  "platformCommission": 4.90,
  "status": "SUCCESS"
}
```
