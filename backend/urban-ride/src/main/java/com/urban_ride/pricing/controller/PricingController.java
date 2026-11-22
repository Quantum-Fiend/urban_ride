package com.urban_ride.pricing.controller;

import com.urban_ride.common.response.ApiResponse;
import com.urban_ride.pricing.dto.PricingEstimateDto;
import com.urban_ride.pricing.service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/pricing")
@RequiredArgsConstructor
@Tag(name = "Pricing", description = "Dynamic Surge & Tier Pricing Engine")
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/estimate")
    @Operation(summary = "Get dynamic fare estimates across all vehicle tiers")
    public ResponseEntity<ApiResponse<PricingEstimateDto>> getEstimates(@RequestBody Map<String, Double> payload) {
        Double pickupLat = payload.get("pickupLatitude");
        Double pickupLon = payload.get("pickupLongitude");
        Double dropoffLat = payload.get("dropoffLatitude");
        Double dropoffLon = payload.get("dropoffLongitude");

        PricingEstimateDto estimate = pricingService.calculateEstimates(pickupLat, pickupLon, dropoffLat, dropoffLon);
        return ResponseEntity.ok(ApiResponse.ok(estimate));
    }
}
