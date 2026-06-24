package com.urban_ride.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.matching.model.MatchingLog;

public interface MatchingLogRepository extends JpaRepository<MatchingLog, Long> {
}
