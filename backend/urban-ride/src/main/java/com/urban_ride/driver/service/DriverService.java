package com.urban_ride.driver.service;

import com.urban_ride.auth.model.User;
import com.urban_ride.driver.dto.DriverDto;
import com.urban_ride.driver.model.Driver;

import java.util.List;

public interface DriverService {
    DriverDto registerDriver(User user, String licenseNumber, String vehicleModel, String vehicleColor, String licensePlate, Driver.VehicleType vehicleType);
    DriverDto updateDriverStatus(Long driverId, Driver.DriverStatus status);
    DriverDto updateDriverLocation(Long driverId, Double latitude, Double longitude);
    DriverDto getDriverByUserId(Long userId);
    List<DriverDto> getAvailableDrivers();
    Driver getDriverEntity(Long driverId);
}
