package com.urban_ride.matching.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matching_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tripId;
    private Long driverId;
    private String status;
}
