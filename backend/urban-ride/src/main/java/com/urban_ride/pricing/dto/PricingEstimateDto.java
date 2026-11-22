package com.urban_ride.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingEstimateDto {
    private Double distanceKm;
    private Integer durationMinutes;
    private List<TierEstimate> tiers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TierEstimate {
        private String tier;
        private String tierName;
        private String description;
        private BigDecimal fare;
        private BigDecimal baseFare;
        private BigDecimal surgeMultiplier;
        private Integer etaMinutes;
        private Integer capacity;
    }
}
