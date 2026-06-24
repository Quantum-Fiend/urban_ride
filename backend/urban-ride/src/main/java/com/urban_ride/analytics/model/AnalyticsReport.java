package com.urban_ride.analytics.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "analytics_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reportType;
    private String reportData;
}
