package com.urban_ride.analytics.dto;

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
public class PlatformStatsDto {
    private long totalUsers;
    private long totalDrivers;
    private long onlineDrivers;
    private long activeTrips;
    private long completedTrips;
    private BigDecimal totalGrossRevenue;
    private BigDecimal averageRating;
    private double surgeIndex;
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String eventType;
        private String description;
        private String timestamp;
        private String status;
    }
}
