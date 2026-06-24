package com.urban_ride.driver.dto;

import lombok.Data;

@Data
public class DriverDto {
    private Long id;
    private String licenseNumber;
    private Double rating;
    private Boolean isOnline;
}
