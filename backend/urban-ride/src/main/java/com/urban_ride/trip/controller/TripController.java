package com.urban_ride.trip.controller;

import com.urban_ride.auth.model.User;
import com.urban_ride.auth.service.AuthService;
import com.urban_ride.common.response.ApiResponse;
import com.urban_ride.driver.dto.DriverDto;
import com.urban_ride.driver.service.DriverService;
import com.urban_ride.pricing.dto.PricingEstimateDto;
import com.urban_ride.pricing.service.PricingService;
import com.urban_ride.trip.dto.TripCreateRequest;
import com.urban_ride.trip.dto.TripDto;
import com.urban_ride.trip.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
@Tag(name = "Trips", description = "Ride Dispatch & Lifecycle Coordination")
public class TripController {

    private final TripService tripService;
    private final AuthService authService;
    private final DriverService driverService;
    private final PricingService pricingService;

    @PostMapping("/estimate")
    @Operation(summary = "Calculate dynamic fare estimates and ETAs across all vehicle tiers")
    public ResponseEntity<ApiResponse<PricingEstimateDto>> getEstimates(@RequestBody Map<String, Double> payload) {
        PricingEstimateDto estimate = pricingService.calculateEstimates(
                payload.get("pickupLatitude"), payload.get("pickupLongitude"),
                payload.get("dropoffLatitude"), payload.get("dropoffLongitude")
        );
        return ResponseEntity.ok(ApiResponse.ok(estimate));
    }

    @PostMapping("/request")
    @Operation(summary = "Request a ride and initiate driver dispatch")
    public ResponseEntity<ApiResponse<TripDto>> requestTrip(@Valid @RequestBody TripCreateRequest request) {
        User rider = authService.getCurrentAuthenticatedUser();
        TripDto trip = tripService.requestTrip(rider, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Trip requested successfully", trip));
    }

    @GetMapping("/active/rider")
    @Operation(summary = "Get current active trip for authenticated rider")
    public ResponseEntity<ApiResponse<TripDto>> getActiveTripForRider() {
        User rider = authService.getCurrentAuthenticatedUser();
        TripDto trip = tripService.getActiveTripForRider(rider);
        return ResponseEntity.ok(ApiResponse.ok(trip));
    }

    @GetMapping("/active/driver")
    @Operation(summary = "Get current active trip for authenticated driver")
    public ResponseEntity<ApiResponse<TripDto>> getActiveTripForDriver() {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        TripDto trip = tripService.getActiveTripForDriver(driver.getId());
        return ResponseEntity.ok(ApiResponse.ok(trip));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trip details by ID")
    public ResponseEntity<ApiResponse<TripDto>> getTripById(@PathVariable Long id) {
        TripDto trip = tripService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.ok(trip));
    }

    @PostMapping("/{id}/accept")
    @Operation(summary = "Driver accepts a dispatched trip")
    public ResponseEntity<ApiResponse<TripDto>> acceptTrip(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        TripDto trip = tripService.acceptTrip(id, driver.getId());
        return ResponseEntity.ok(ApiResponse.ok("Trip accepted", trip));
    }

    @PostMapping("/{id}/arrived")
    @Operation(summary = "Driver marks arrival at pickup waypoint")
    public ResponseEntity<ApiResponse<TripDto>> driverArrived(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        TripDto trip = tripService.driverArrived(id, driver.getId());
        return ResponseEntity.ok(ApiResponse.ok("Driver marked arrived", trip));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Driver starts trip with 4-digit PIN verification")
    public ResponseEntity<ApiResponse<TripDto>> startTrip(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        TripDto trip = tripService.startTrip(id, driver.getId(), payload.get("otp"));
        return ResponseEntity.ok(ApiResponse.ok("Trip commenced", trip));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Driver completes trip at dropoff destination")
    public ResponseEntity<ApiResponse<TripDto>> completeTrip(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        TripDto trip = tripService.completeTrip(id, driver.getId());
        return ResponseEntity.ok(ApiResponse.ok("Trip completed successfully", trip));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel trip with specified reason")
    public ResponseEntity<ApiResponse<TripDto>> cancelTrip(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        String reason = payload != null ? payload.getOrDefault("reason", "Cancelled by user") : "Cancelled";
        TripDto trip = tripService.cancelTrip(id, user, reason);
        return ResponseEntity.ok(ApiResponse.ok("Trip cancelled", trip));
    }

    @GetMapping("/history/rider")
    @Operation(summary = "Get ride history for current rider")
    public ResponseEntity<ApiResponse<List<TripDto>>> getRiderHistory() {
        User rider = authService.getCurrentAuthenticatedUser();
        List<TripDto> history = tripService.getRiderTripHistory(rider);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/history/driver")
    @Operation(summary = "Get ride history for current driver")
    public ResponseEntity<ApiResponse<List<TripDto>>> getDriverHistory() {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        List<TripDto> history = tripService.getDriverTripHistory(driver.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
