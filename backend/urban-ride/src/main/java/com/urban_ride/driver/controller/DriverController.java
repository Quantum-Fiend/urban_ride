package com.urban_ride.driver.controller;

import com.urban_ride.auth.model.User;
import com.urban_ride.auth.service.AuthService;
import com.urban_ride.common.response.ApiResponse;
import com.urban_ride.driver.dto.DriverDto;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.driver.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@Tag(name = "Drivers", description = "Driver Telemetry & Operations")
public class DriverController {

    private final DriverService driverService;
    private final AuthService authService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated driver profile")
    public ResponseEntity<ApiResponse<DriverDto>> getMyProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(driver));
    }

    @PatchMapping("/status")
    @Operation(summary = "Toggle driver status between OFFLINE, AVAILABLE, ON_TRIP")
    public ResponseEntity<ApiResponse<DriverDto>> updateStatus(@RequestBody Map<String, String> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        Driver.DriverStatus newStatus = Driver.DriverStatus.valueOf(payload.get("status").toUpperCase());
        DriverDto updated = driverService.updateDriverStatus(driver.getId(), newStatus);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
    }

    @PostMapping("/location")
    @Operation(summary = "Broadcast driver GPS location coordinates")
    public ResponseEntity<ApiResponse<DriverDto>> updateLocation(@RequestBody Map<String, Double> coords) {
        User user = authService.getCurrentAuthenticatedUser();
        DriverDto driver = driverService.getDriverByUserId(user.getId());
        DriverDto updated = driverService.updateDriverLocation(driver.getId(), coords.get("latitude"), coords.get("longitude"));
        return ResponseEntity.ok(ApiResponse.ok("Location updated", updated));
    }

    @GetMapping("/available")
    @Operation(summary = "Fetch all currently available drivers with live coordinates")
    public ResponseEntity<ApiResponse<List<DriverDto>>> getAvailableDrivers() {
        List<DriverDto> drivers = driverService.getAvailableDrivers();
        return ResponseEntity.ok(ApiResponse.ok(drivers));
    }
}
