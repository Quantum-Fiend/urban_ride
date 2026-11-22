package com.urban_ride.pricing.service;

import com.urban_ride.common.utils.GeoUtils;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.pricing.dto.PricingEstimateDto;
import com.urban_ride.pricing.model.PricingRule;
import com.urban_ride.pricing.repository.PricingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PricingService {

    private final PricingRuleRepository pricingRuleRepository;

    public PricingEstimateDto calculateEstimates(double pickupLat, double pickupLon, double dropoffLat, double dropoffLon) {
        double distanceKm = GeoUtils.calculateDistanceKm(pickupLat, pickupLon, dropoffLat, dropoffLon);
        int durationMinutes = GeoUtils.estimateDurationMinutes(distanceKm);

        // Simulated dynamic surge factor based on time of day (1.0 to 1.4)
        BigDecimal surgeMultiplier = new BigDecimal("1.15");

        List<PricingEstimateDto.TierEstimate> tierEstimates = new ArrayList<>();

        for (Driver.VehicleType tier : Driver.VehicleType.values()) {
            PricingRule rule = pricingRuleRepository.findByVehicleType(tier)
                    .orElse(getDefaultRule(tier));

            BigDecimal distanceCharge = rule.getRatePerKm().multiply(BigDecimal.valueOf(distanceKm));
            BigDecimal timeCharge = rule.getRatePerMinute().multiply(BigDecimal.valueOf(durationMinutes));
            BigDecimal rawTotal = rule.getBaseFare().add(distanceCharge).add(timeCharge);

            BigDecimal surgedTotal = rawTotal.multiply(surgeMultiplier).setScale(2, RoundingMode.HALF_UP);
            BigDecimal finalFare = surgedTotal.max(rule.getMinimumFare());

            tierEstimates.add(PricingEstimateDto.TierEstimate.builder()
                    .tier(tier.name())
                    .tierName(getTierDisplayName(tier))
                    .description(getTierDescription(tier))
                    .fare(finalFare)
                    .baseFare(rule.getBaseFare())
                    .surgeMultiplier(surgeMultiplier)
                    .etaMinutes(Math.max(3, (int) (Math.random() * 5) + 3))
                    .capacity(tier == Driver.VehicleType.XL ? 6 : (tier == Driver.VehicleType.BLACK ? 4 : 4))
                    .build());
        }

        return PricingEstimateDto.builder()
                .distanceKm(distanceKm)
                .durationMinutes(durationMinutes)
                .tiers(tierEstimates)
                .build();
    }

    public BigDecimal calculateSingleFare(Driver.VehicleType tier, double distanceKm, int durationMinutes, BigDecimal surge) {
        PricingRule rule = pricingRuleRepository.findByVehicleType(tier)
                .orElse(getDefaultRule(tier));

        BigDecimal distanceCharge = rule.getRatePerKm().multiply(BigDecimal.valueOf(distanceKm));
        BigDecimal timeCharge = rule.getRatePerMinute().multiply(BigDecimal.valueOf(durationMinutes));
        BigDecimal rawTotal = rule.getBaseFare().add(distanceCharge).add(timeCharge);

        BigDecimal finalFare = rawTotal.multiply(surge).setScale(2, RoundingMode.HALF_UP);
        return finalFare.max(rule.getMinimumFare());
    }

    private PricingRule getDefaultRule(Driver.VehicleType tier) {
        return switch (tier) {
            case COMFORT -> PricingRule.builder().vehicleType(tier).baseFare(new BigDecimal("5.00")).ratePerKm(new BigDecimal("1.75")).ratePerMinute(new BigDecimal("0.35")).minimumFare(new BigDecimal("9.00")).build();
            case XL -> PricingRule.builder().vehicleType(tier).baseFare(new BigDecimal("7.50")).ratePerKm(new BigDecimal("2.25")).ratePerMinute(new BigDecimal("0.45")).minimumFare(new BigDecimal("12.00")).build();
            case BLACK -> PricingRule.builder().vehicleType(tier).baseFare(new BigDecimal("10.00")).ratePerKm(new BigDecimal("3.25")).ratePerMinute(new BigDecimal("0.65")).minimumFare(new BigDecimal("18.00")).build();
            case EV -> PricingRule.builder().vehicleType(tier).baseFare(new BigDecimal("4.00")).ratePerKm(new BigDecimal("1.30")).ratePerMinute(new BigDecimal("0.25")).minimumFare(new BigDecimal("7.00")).build();
            default -> PricingRule.builder().vehicleType(tier).baseFare(new BigDecimal("3.50")).ratePerKm(new BigDecimal("1.25")).ratePerMinute(new BigDecimal("0.25")).minimumFare(new BigDecimal("6.00")).build();
        };
    }

    private String getTierDisplayName(Driver.VehicleType tier) {
        return switch (tier) {
            case COMFORT -> "Urban Comfort";
            case XL -> "Urban XL (6 Seats)";
            case BLACK -> "Urban Black Luxury";
            case EV -> "Urban Green Electric";
            default -> "Urban Economy";
        };
    }

    private String getTierDescription(Driver.VehicleType tier) {
        return switch (tier) {
            case COMFORT -> "Spacious newer sedans with top-rated driver partners.";
            case XL -> "Premium SUVs with seating for up to 6 passengers.";
            case BLACK -> "High-end luxury vehicles with executive service.";
            case EV -> "Zero-emission quiet electric vehicles for sustainable travel.";
            default -> "Reliable, affordable everyday private rides.";
        };
    }
}
