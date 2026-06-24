package com.urban_ride.rider.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.rider.model.Rider;

public interface RiderRepository extends JpaRepository<Rider, Long> {
}
