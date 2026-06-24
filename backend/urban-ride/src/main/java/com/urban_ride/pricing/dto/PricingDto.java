package com.urban_ride.pricing.dto;

import lombok.Data;

@Data
public class PricingDto {
    private Long id;
    private Double baseFare;
    private Double surgeMultiplier;
}
