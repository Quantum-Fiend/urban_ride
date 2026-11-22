package com.urban_ride.driver.model;

import com.urban_ride.auth.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String vehicleModel;

    @Column(nullable = false)
    private String vehicleColor;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VehicleType vehicleType = VehicleType.ECONOMY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DriverStatus status = DriverStatus.OFFLINE;

    private Double currentLatitude;
    private Double currentLongitude;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(nullable = false)
    @Builder.Default
    private Integer totalTrips = 0;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public enum VehicleType {
        ECONOMY, COMFORT, XL, BLACK, EV
    }

    public enum DriverStatus {
        OFFLINE, AVAILABLE, ON_TRIP, SUSPENDED
    }
}
