package com.urban_ride.trip.service;

import com.urban_ride.auth.model.User;
import com.urban_ride.trip.dto.TripCreateRequest;
import com.urban_ride.trip.dto.TripDto;
import com.urban_ride.trip.model.Trip;

import java.util.List;

public interface TripService {
    TripDto requestTrip(User rider, TripCreateRequest request);
    TripDto acceptTrip(Long tripId, Long driverId);
    TripDto driverArrived(Long tripId, Long driverId);
    TripDto startTrip(Long tripId, Long driverId, String otp);
    TripDto completeTrip(Long tripId, Long driverId);
    TripDto cancelTrip(Long tripId, User user, String reason);
    TripDto getTripById(Long tripId);
    TripDto getActiveTripForRider(User rider);
    TripDto getActiveTripForDriver(Long driverId);
    List<TripDto> getRiderTripHistory(User rider);
    List<TripDto> getDriverTripHistory(Long driverId);
}
