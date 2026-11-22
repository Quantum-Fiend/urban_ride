package com.urban_ride.driver.service;

import com.urban_ride.auth.model.User;
import com.urban_ride.common.exception.ApiException;
import com.urban_ride.driver.dto.DriverDto;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.driver.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    @Override
    @Transactional
    public DriverDto registerDriver(User user, String licenseNumber, String vehicleModel, String vehicleColor, String licensePlate, Driver.VehicleType vehicleType) {
        if (driverRepository.findByUser(user).isPresent()) {
            throw new ApiException("Driver profile already exists for this user", HttpStatus.CONFLICT);
        }

        Driver driver = Driver.builder()
                .user(user)
                .licenseNumber(licenseNumber)
                .vehicleModel(vehicleModel)
                .vehicleColor(vehicleColor)
                .licensePlate(licensePlate)
                .vehicleType(vehicleType)
                .status(Driver.DriverStatus.OFFLINE)
                .build();

        return DriverDto.fromEntity(driverRepository.save(driver));
    }

    @Override
    @Transactional
    public DriverDto updateDriverStatus(Long driverId, Driver.DriverStatus status) {
        Driver driver = getDriverEntity(driverId);
        driver.setStatus(status);
        return DriverDto.fromEntity(driverRepository.save(driver));
    }

    @Override
    @Transactional
    public DriverDto updateDriverLocation(Long driverId, Double latitude, Double longitude) {
        Driver driver = getDriverEntity(driverId);
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        return DriverDto.fromEntity(driverRepository.save(driver));
    }

    @Override
    public DriverDto getDriverByUserId(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException("Driver not found for user ID: " + userId, HttpStatus.NOT_FOUND));
        return DriverDto.fromEntity(driver);
    }

    @Override
    public List<DriverDto> getAvailableDrivers() {
        return driverRepository.findAvailableDrivers()
                .stream()
                .map(DriverDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Driver getDriverEntity(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ApiException("Driver not found with ID: " + driverId, HttpStatus.NOT_FOUND));
    }
}
