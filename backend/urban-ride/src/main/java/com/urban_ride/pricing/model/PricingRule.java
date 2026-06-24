package com.urban_ride.pricing.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double baseFare;
    private Double perKmRate;
    private Double perMinuteRate;
    private Double surgeMultiplier;
}
