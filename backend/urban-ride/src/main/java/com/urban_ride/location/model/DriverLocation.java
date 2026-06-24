package com.urban_ride.location.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "driver_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long driverId;
    private Double latitude;
    private Double longitude;
}
