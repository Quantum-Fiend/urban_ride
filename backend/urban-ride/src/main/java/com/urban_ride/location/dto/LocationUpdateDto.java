package com.urban_ride.location.dto;

import lombok.Data;

@Data
public class LocationUpdateDto {
    private Long driverId;
    private Double latitude;
    private Double longitude;
}
