package com.urban_ride.matching.dto;

import lombok.Data;

@Data
public class MatchingDto {
    private Long id;
    private Long tripId;
    private Long driverId;
    private String status;
}
