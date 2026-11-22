package com.urban_ride.pricing.model;

import com.urban_ride.driver.model.Driver;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Driver.VehicleType vehicleType;

    @Column(nullable = false)
    private BigDecimal baseFare;

    @Column(nullable = false)
    private BigDecimal ratePerKm;

    @Column(nullable = false)
    private BigDecimal ratePerMinute;

    @Column(nullable = false)
    private BigDecimal minimumFare;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
