package com.urban_ride.driver.dto;

import com.urban_ride.driver.model.Driver;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {
    private Long id;
    private Long userId;
    private String driverName;
    private String email;
    private String phoneNumber;
    private String vehicleModel;
    private String vehicleColor;
    private String licensePlate;
    private String vehicleType;
    private String status;
    private Double currentLatitude;
    private Double currentLongitude;
    private BigDecimal rating;
    private Integer totalTrips;
    private BigDecimal totalEarnings;
    private Boolean isVerified;

    public static DriverDto fromEntity(Driver driver) {
        return DriverDto.builder()
                .id(driver.getId())
                .userId(driver.getUser().getId())
                .driverName(driver.getUser().getFirstName() + " " + driver.getUser().getLastName())
                .email(driver.getUser().getEmail())
                .phoneNumber(driver.getUser().getPhoneNumber())
                .vehicleModel(driver.getVehicleModel())
                .vehicleColor(driver.getVehicleColor())
                .licensePlate(driver.getLicensePlate())
                .vehicleType(driver.getVehicleType().name())
                .status(driver.getStatus().name())
                .currentLatitude(driver.getCurrentLatitude())
                .currentLongitude(driver.getCurrentLongitude())
                .rating(driver.getRating())
                .totalTrips(driver.getTotalTrips())
                .totalEarnings(driver.getTotalEarnings())
                .isVerified(driver.getIsVerified())
                .build();
    }
}
