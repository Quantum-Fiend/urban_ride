package com.urban_ride.analytics.controller;

import com.urban_ride.analytics.dto.PlatformStatsDto;
import com.urban_ride.analytics.service.AnalyticsService;
import com.urban_ride.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Platform KPIs & Fleet Intelligence")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregate platform health, revenue, and active fleet statistics")
    public ResponseEntity<ApiResponse<PlatformStatsDto>> getDashboardStats() {
        PlatformStatsDto stats = analyticsService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
