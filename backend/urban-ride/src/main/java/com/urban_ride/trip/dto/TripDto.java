package com.urban_ride.trip.dto;

import lombok.Data;

@Data
public class TripDto {
    private Long id;
    private Long riderId;
    private Long driverId;
    private String status;
    private Double fare;
}
