# Urban Ride (RideSphere) - Low-Level Design (LLD)

## 1. Domain Entities & Class Architecture

### 1.1 Class Diagram
```mermaid
classDiagram
    class User {
        +Long id
        +String email
        +String passwordHash
        +String firstName
        +String lastName
        +String phoneNumber
        +Role role
        +Boolean isActive
        +Instant createdAt
    }

    class Driver {
        +Long id
        +User user
        +String licenseNumber
        +String vehicleModel
        +String vehicleColor
        +String licensePlate
        +VehicleType vehicleType
        +DriverStatus status
        +Double currentLatitude
        +Double currentLongitude
        +Double rating
        +Integer totalTrips
        +Boolean isVerified
    }

    class Trip {
        +Long id
        +User rider
        +Driver driver
        +Double pickupLatitude
        +Double pickupLongitude
        +Double dropoffLatitude
        +Double dropoffLongitude
        +String pickupAddress
        +String dropoffAddress
        +TripStatus status
        +VehicleType requestedTier
        +BigDecimal fare
        +BigDecimal surgeMultiplier
        +Double distanceKm
        +Integer durationMinutes
        +String otp
        +Instant requestedAt
        +Instant acceptedAt
        +Instant startedAt
        +Instant completedAt
        +Long version
    }

    class Payment {
        +Long id
        +Trip trip
        +User rider
        +BigDecimal amount
        +PaymentMethod paymentMethod
        +PaymentStatus status
        +String transactionRef
        +String idempotencyKey
        +Instant createdAt
    }

    class PricingRule {
        +Long id
        +VehicleType vehicleType
        +BigDecimal baseFare
        +BigDecimal ratePerKm
        +BigDecimal ratePerMinute
        +BigDecimal minimumFare
        +BigDecimal surgeThresholdDemandSupplyRatio
    }

    User "1" <-- "1" Driver : extends identity
    User "1" <-- "*" Trip : requests as rider
    Driver "0..1" <-- "*" Trip : accepts as driver
    Trip "1" <-- "1" Payment : settles
    PricingRule "1" ..> Trip : computes fare
```

---

## 2. State Machine: Trip Lifecycle
```mermaid
stateDiagram-v2
    [*] --> REQUESTED : Rider Submits Request
    REQUESTED --> MATCHING : Matching Engine Dispatches
    MATCHING --> ACCEPTED : Driver Accepts Dispatch
    MATCHING --> CANCELLED : Timeout / No Drivers Available
    REQUESTED --> CANCELLED : Rider Cancels

    ACCEPTED --> ARRIVED : Driver Arrives at Pickup
    ACCEPTED --> CANCELLED : Driver / Rider Cancels with Penalty

    ARRIVED --> IN_PROGRESS : Driver Enters Valid 4-Digit OTP
    ARRIVED --> CANCELLED : No Show (Timeout)

    IN_PROGRESS --> COMPLETED : Driver Confirms Dropoff
    COMPLETED --> [*] : Payment Settled & Rating Submitted
    CANCELLED --> [*]
```

---

## 3. Dynamic Pricing Algorithm

The dynamic pricing service computes trip cost based on base fares, distance, estimated travel time, vehicle tier modifiers, and real-time demand-supply surge:

$$\text{Fare} = \max\left(\text{MinFare}, \left(\text{BaseFare} + (\text{Distance}_{\text{km}} \times \text{Rate}_{\text{km}}) + (\text{Duration}_{\text{min}} \times \text{Rate}_{\text{min}})\right) \times \text{TierMultiplier} \times \text{SurgeFactor}\right)$$

### Surge Factor Calculation
$$\text{DemandSupplyRatio} = \frac{\text{ActiveRequests}_{r}}{\max(1, \text{OnlineDrivers}_{r})}$$

$$\text{SurgeFactor} = 
\begin{cases} 
1.0 & \text{if } \text{DemandSupplyRatio} \le 1.2 \\
1.0 + 0.25 \times (\text{DemandSupplyRatio} - 1.2) & \text{if } 1.2 < \text{DemandSupplyRatio} \le 3.0 \\
2.5 & \text{if } \text{DemandSupplyRatio} > 3.0 \text{ (Capped for regulatory compliance)}
\end{cases}$$

---

## 4. Geospatial Proximity & Matching Algorithm
1. **Spatial Ingestion**: Every active driver streams continuous coordinates `(lat, lon)` over WebSocket `/ws-ride/location` or `POST /api/v1/location/update`.
2. **Redis Geo Storage**: Key `geo:drivers:available:{vehicleType}` stores coordinates:
   ```redis
   GEOADD geo:drivers:available:COMFORT 77.5946 12.9716 driver_102
   ```
3. **Proximity Search**:
   ```redis
   GEORADIUS geo:drivers:available:COMFORT 77.5946 12.9716 5 km WITHCOORD WITHDIST ASC COUNT 10
   ```
4. **Ranking Heuristic**:
   $$\text{Score} = (w_1 \times \text{ProximityRank}) + (w_2 \times \text{DriverRating}) + (w_3 \times \text{AcceptanceRate})$$
   Candidate driver with the lowest composite score is offered the trip first with a 15-second response window.
