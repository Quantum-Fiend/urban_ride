# Urban Ride API Contracts & Response Conventions

## 1. Unified API Response Envelope (`ApiResponse<T>`)
Every REST endpoint returns a predictable, consistent envelope:

```json
{
  "success": true,
  "message": "Trip booked successfully",
  "data": {
    "tripId": 1029,
    "status": "MATCHING",
    "otp": "4921",
    "estimatedFare": 22.50
  },
  "timestamp": "2026-11-22T06:15:30.120Z",
  "traceId": "c83b4b8a-f321-4d1a-b67e-128a1923"
}
```

## 2. Standardized Error Response (RFC-7807 ProblemDetails)
When an exception occurs (validation failure, authorization block, entity not found), the server responds with HTTP 4xx/5xx and:

```json
{
  "success": false,
  "errorCode": "TRIP_ALREADY_ACCEPTED",
  "message": "This trip has already been claimed by another driver partner.",
  "errors": [
    {
      "field": "tripId",
      "message": "Invalid state transition from ACCEPTED to ACCEPTED"
    }
  ],
  "timestamp": "2026-11-22T06:15:30.125Z",
  "path": "/api/v1/trips/1029/accept"
}
```

## 3. WebSocket Topic Contract
- `/topic/trips/{tripId}`: Real-time driver location updates & trip status progression.
- `/topic/drivers/{driverId}/offers`: Real-time dispatch offer notifications with countdown timer.
- `/topic/admin/fleet`: Aggregated driver geospatial telemetry stream.
