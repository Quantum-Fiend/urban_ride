package com.urban_ride.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.location.model.DriverLocation;

public interface DriverLocationRepository extends JpaRepository<DriverLocation, Long> {
}
