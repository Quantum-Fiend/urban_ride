package com.urban_ride.driver.repository;

import com.urban_ride.auth.model.User;
import com.urban_ride.driver.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);
    Optional<Driver> findByUserId(Long userId);
    List<Driver> findByStatus(Driver.DriverStatus status);

    @Query("SELECT d FROM Driver d WHERE d.status = 'AVAILABLE' AND d.currentLatitude IS NOT NULL AND d.currentLongitude IS NOT NULL")
    List<Driver> findAvailableDrivers();
}
