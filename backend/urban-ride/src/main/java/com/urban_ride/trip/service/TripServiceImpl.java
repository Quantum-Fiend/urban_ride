package com.urban_ride.trip.service;

import com.urban_ride.auth.model.User;
import com.urban_ride.auth.repository.UserRepository;
import com.urban_ride.common.exception.ApiException;
import com.urban_ride.common.utils.GeoUtils;
import com.urban_ride.driver.model.Driver;
import com.urban_ride.driver.repository.DriverRepository;
import com.urban_ride.matching.service.MatchingService;
import com.urban_ride.payment.model.Payment;
import com.urban_ride.payment.repository.PaymentRepository;
import com.urban_ride.pricing.service.PricingService;
import com.urban_ride.trip.dto.TripCreateRequest;
import com.urban_ride.trip.dto.TripDto;
import com.urban_ride.trip.model.Trip;
import com.urban_ride.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final PricingService pricingService;
    private final MatchingService matchingService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final List<Trip.TripStatus> ACTIVE_STATUSES = Arrays.asList(
            Trip.TripStatus.REQUESTED,
            Trip.TripStatus.MATCHING,
            Trip.TripStatus.ACCEPTED,
            Trip.TripStatus.ARRIVED,
            Trip.TripStatus.IN_PROGRESS
    );

    @Override
    @Transactional
    public TripDto requestTrip(User rider, TripCreateRequest request) {
        // Check if rider already has an active trip
        Optional<Trip> existing = tripRepository.findFirstByRiderAndStatusInOrderByRequestedAtDesc(rider, ACTIVE_STATUSES);
        if (existing.isPresent()) {
            return TripDto.fromEntity(existing.get());
        }

        double distanceKm = GeoUtils.calculateDistanceKm(
                request.getPickupLatitude(), request.getPickupLongitude(),
                request.getDropoffLatitude(), request.getDropoffLongitude()
        );
        int durationMinutes = GeoUtils.estimateDurationMinutes(distanceKm);

        Driver.VehicleType tier = request.getVehicleType() != null ? request.getVehicleType() : Driver.VehicleType.ECONOMY;
        BigDecimal surgeMultiplier = new BigDecimal("1.15");
        BigDecimal calculatedFare = pricingService.calculateSingleFare(tier, distanceKm, durationMinutes, surgeMultiplier);

        // Generate 4-digit secure OTP for trip commencement
        String otp = String.format("%04d", new SecureRandom().nextInt(10000));

        Trip trip = Trip.builder()
                .rider(rider)
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .dropoffLatitude(request.getDropoffLatitude())
                .dropoffLongitude(request.getDropoffLongitude())
                .pickupAddress(request.getPickupAddress())
                .dropoffAddress(request.getDropoffAddress())
                .status(Trip.TripStatus.REQUESTED)
                .vehicleType(tier)
                .fare(calculatedFare)
                .surgeMultiplier(surgeMultiplier)
                .distanceKm(distanceKm)
                .durationMinutes(durationMinutes)
                .otp(otp)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : Trip.PaymentMethod.WALLET)
                .paymentStatus(Trip.PaymentStatus.PENDING)
                .build();

        trip = tripRepository.save(trip);

        // Auto-match best available driver
        Optional<Driver> candidate = matchingService.findBestCandidate(trip);
        if (candidate.isPresent()) {
            Driver driver = candidate.get();
            trip.setDriver(driver);
            trip.setStatus(Trip.TripStatus.ACCEPTED);
            trip.setAcceptedAt(Instant.now());
            driver.setStatus(Driver.DriverStatus.ON_TRIP);
            driverRepository.save(driver);
            trip = tripRepository.save(trip);

            matchingService.broadcastOfferToDriver(driver, trip);
        } else {
            trip.setStatus(Trip.TripStatus.MATCHING);
            trip = tripRepository.save(trip);
        }

        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    @Transactional
    public TripDto acceptTrip(Long tripId, Long driverId) {
        Trip trip = findTrip(tripId);
        Driver driver = findDriver(driverId);

        if (trip.getStatus() != Trip.TripStatus.REQUESTED && trip.getStatus() != Trip.TripStatus.MATCHING) {
            throw new ApiException("Trip is no longer open for acceptance", HttpStatus.CONFLICT);
        }

        trip.setDriver(driver);
        trip.setStatus(Trip.TripStatus.ACCEPTED);
        trip.setAcceptedAt(Instant.now());
        driver.setStatus(Driver.DriverStatus.ON_TRIP);

        driverRepository.save(driver);
        trip = tripRepository.save(trip);

        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    @Transactional
    public TripDto driverArrived(Long tripId, Long driverId) {
        Trip trip = findTrip(tripId);
        validateTripDriver(trip, driverId);

        if (trip.getStatus() != Trip.TripStatus.ACCEPTED) {
            throw new ApiException("Cannot mark arrived from current status: " + trip.getStatus());
        }

        trip.setStatus(Trip.TripStatus.ARRIVED);
        trip = tripRepository.save(trip);

        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    @Transactional
    public TripDto startTrip(Long tripId, Long driverId, String otp) {
        Trip trip = findTrip(tripId);
        validateTripDriver(trip, driverId);

        if (trip.getStatus() != Trip.TripStatus.ARRIVED && trip.getStatus() != Trip.TripStatus.ACCEPTED) {
            throw new ApiException("Cannot start trip in status: " + trip.getStatus());
        }

        if (otp == null || !otp.trim().equals(trip.getOtp())) {
            throw new ApiException("Invalid 4-digit ride OTP. Please ask rider for PIN.", HttpStatus.FORBIDDEN);
        }

        trip.setStatus(Trip.TripStatus.IN_PROGRESS);
        trip.setStartedAt(Instant.now());
        trip = tripRepository.save(trip);

        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    @Transactional
    public TripDto completeTrip(Long tripId, Long driverId) {
        Trip trip = findTrip(tripId);
        validateTripDriver(trip, driverId);

        if (trip.getStatus() != Trip.TripStatus.IN_PROGRESS) {
            throw new ApiException("Trip is not in progress");
        }

        trip.setStatus(Trip.TripStatus.COMPLETED);
        trip.setCompletedAt(Instant.now());

        // Process financial settlement
        Driver driver = trip.getDriver();
        driver.setStatus(Driver.DriverStatus.AVAILABLE);
        driver.setTotalTrips(driver.getTotalTrips() + 1);

        // Driver gets 80% net payout, platform retains 20%
        BigDecimal driverShare = trip.getFare().multiply(new BigDecimal("0.80")).setScale(2, RoundingMode.HALF_UP);
        driver.setTotalEarnings(driver.getTotalEarnings().add(driverShare));
        driverRepository.save(driver);

        // Deduct from Rider wallet if WALLET payment method
        User rider = trip.getRider();
        if (trip.getPaymentMethod() == Trip.PaymentMethod.WALLET) {
            if (rider.getWalletBalance().compareTo(trip.getFare()) >= 0) {
                rider.setWalletBalance(rider.getWalletBalance().subtract(trip.getFare()));
                userRepository.save(rider);
                trip.setPaymentStatus(Trip.PaymentStatus.SUCCESS);
            } else {
                trip.setPaymentStatus(Trip.PaymentStatus.PENDING);
            }
        } else {
            trip.setPaymentStatus(Trip.PaymentStatus.SUCCESS);
        }

        // Record payment transaction
        Payment payment = Payment.builder()
                .trip(trip)
                .user(rider)
                .amount(trip.getFare())
                .paymentMethod(trip.getPaymentMethod())
                .status(trip.getPaymentStatus())
                .transactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .idempotencyKey(UUID.randomUUID().toString())
                .build();
        paymentRepository.save(payment);

        trip = tripRepository.save(trip);
        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    @Transactional
    public TripDto cancelTrip(Long tripId, User user, String reason) {
        Trip trip = findTrip(tripId);
        if (trip.getStatus() == Trip.TripStatus.COMPLETED || trip.getStatus() == Trip.TripStatus.CANCELLED) {
            throw new ApiException("Trip is already finalized");
        }

        trip.setStatus(Trip.TripStatus.CANCELLED);
        trip.setCancellationReason(reason);
        trip.setCancelledAt(Instant.now());

        if (trip.getDriver() != null) {
            Driver driver = trip.getDriver();
            driver.setStatus(Driver.DriverStatus.AVAILABLE);
            driverRepository.save(driver);
        }

        trip = tripRepository.save(trip);
        broadcastTripUpdate(trip);
        return TripDto.fromEntity(trip);
    }

    @Override
    public TripDto getTripById(Long tripId) {
        return TripDto.fromEntity(findTrip(tripId));
    }

    @Override
    public TripDto getActiveTripForRider(User rider) {
        return tripRepository.findFirstByRiderAndStatusInOrderByRequestedAtDesc(rider, ACTIVE_STATUSES)
                .map(TripDto::fromEntity)
                .orElse(null);
    }

    @Override
    public TripDto getActiveTripForDriver(Long driverId) {
        Driver driver = findDriver(driverId);
        return tripRepository.findFirstByDriverAndStatusInOrderByRequestedAtDesc(driver, ACTIVE_STATUSES)
                .map(TripDto::fromEntity)
                .orElse(null);
    }

    @Override
    public List<TripDto> getRiderTripHistory(User rider) {
        return tripRepository.findByRiderOrderByRequestedAtDesc(rider)
                .stream()
                .map(TripDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripDto> getDriverTripHistory(Long driverId) {
        Driver driver = findDriver(driverId);
        return tripRepository.findByDriverOrderByRequestedAtDesc(driver)
                .stream()
                .map(TripDto::fromEntity)
                .collect(Collectors.toList());
    }

    private Trip findTrip(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ApiException("Trip not found with ID: " + tripId, HttpStatus.NOT_FOUND));
    }

    private Driver findDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ApiException("Driver not found with ID: " + driverId, HttpStatus.NOT_FOUND));
    }

    private void validateTripDriver(Trip trip, Long driverId) {
        if (trip.getDriver() == null || !trip.getDriver().getId().equals(driverId)) {
            throw new ApiException("Action unauthorized for this driver partner", HttpStatus.FORBIDDEN);
        }
    }

    private void broadcastTripUpdate(Trip trip) {
        try {
            messagingTemplate.convertAndSend("/topic/trips/" + trip.getId(), TripDto.fromEntity(trip));
        } catch (Exception e) {
            log.warn("WebSocket broadcast failed for trip {}: {}", trip.getId(), e.getMessage());
        }
    }
}
