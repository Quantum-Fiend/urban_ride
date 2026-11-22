package com.urban_ride.trip.dto;

import com.urban_ride.trip.model.Trip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDto {
    private Long id;
    private Long riderId;
    private String riderName;
    private String riderPhone;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private String vehicleModel;
    private String licensePlate;
    private Double driverLatitude;
    private Double driverLongitude;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double dropoffLatitude;
    private Double dropoffLongitude;
    private String pickupAddress;
    private String dropoffAddress;
    private String status;
    private String vehicleType;
    private BigDecimal fare;
    private BigDecimal surgeMultiplier;
    private Double distanceKm;
    private Integer durationMinutes;
    private String otp;
    private String paymentMethod;
    private String paymentStatus;
    private Instant requestedAt;
    private Instant acceptedAt;
    private Instant startedAt;
    private Instant completedAt;

    public static TripDto fromEntity(Trip trip) {
        TripDtoBuilder builder = TripDto.builder()
                .id(trip.getId())
                .riderId(trip.getRider().getId())
                .riderName(trip.getRider().getFirstName() + " " + trip.getRider().getLastName())
                .riderPhone(trip.getRider().getPhoneNumber())
                .pickupLatitude(trip.getPickupLatitude())
                .pickupLongitude(trip.getPickupLongitude())
                .dropoffLatitude(trip.getDropoffLatitude())
                .dropoffLongitude(trip.getDropoffLongitude())
                .pickupAddress(trip.getPickupAddress())
                .dropoffAddress(trip.getDropoffAddress())
                .status(trip.getStatus().name())
                .vehicleType(trip.getVehicleType().name())
                .fare(trip.getFare())
                .surgeMultiplier(trip.getSurgeMultiplier())
                .distanceKm(trip.getDistanceKm())
                .durationMinutes(trip.getDurationMinutes())
                .otp(trip.getOtp())
                .paymentMethod(trip.getPaymentMethod().name())
                .paymentStatus(trip.getPaymentStatus().name())
                .requestedAt(trip.getRequestedAt())
                .acceptedAt(trip.getAcceptedAt())
                .startedAt(trip.getStartedAt())
                .completedAt(trip.getCompletedAt());

        if (trip.getDriver() != null) {
            builder.driverId(trip.getDriver().getId())
                    .driverName(trip.getDriver().getUser().getFirstName() + " " + trip.getDriver().getUser().getLastName())
                    .driverPhone(trip.getDriver().getUser().getPhoneNumber())
                    .vehicleModel(trip.getDriver().getVehicleModel() + " (" + trip.getDriver().getVehicleColor() + ")")
                    .licensePlate(trip.getDriver().getLicensePlate())
                    .driverLatitude(trip.getDriver().getCurrentLatitude())
                    .driverLongitude(trip.getDriver().getCurrentLongitude());
        }

        return builder.build();
    }
}
