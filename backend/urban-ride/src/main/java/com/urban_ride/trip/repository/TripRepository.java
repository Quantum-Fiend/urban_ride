package com.urban_ride.trip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.trip.model.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
