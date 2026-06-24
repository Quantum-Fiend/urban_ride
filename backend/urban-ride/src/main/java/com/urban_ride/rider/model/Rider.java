package com.urban_ride.rider.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "riders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Double rating;
}
