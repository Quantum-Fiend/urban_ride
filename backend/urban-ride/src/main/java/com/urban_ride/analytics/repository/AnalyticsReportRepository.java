package com.urban_ride.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.analytics.model.AnalyticsReport;

public interface AnalyticsReportRepository extends JpaRepository<AnalyticsReport, Long> {
}
