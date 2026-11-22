package com.urban_ride.trip.repository;

import com.urban_ride.auth.model.User;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.trip.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRiderOrderByRequestedAtDesc(User rider);
    List<Trip> findByDriverOrderByRequestedAtDesc(Driver driver);
    List<Trip> findByStatus(Trip.TripStatus status);
    Optional<Trip> findFirstByRiderAndStatusInOrderByRequestedAtDesc(User rider, List<Trip.TripStatus> statuses);
    Optional<Trip> findFirstByDriverAndStatusInOrderByRequestedAtDesc(Driver driver, List<Trip.TripStatus> statuses);

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status = 'COMPLETED'")
    long countCompletedTrips();

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status IN ('REQUESTED', 'MATCHING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS')")
    long countActiveTrips();
}
