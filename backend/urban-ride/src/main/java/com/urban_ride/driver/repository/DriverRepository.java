package com.urban_ride.driver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.driver.model.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {
}
