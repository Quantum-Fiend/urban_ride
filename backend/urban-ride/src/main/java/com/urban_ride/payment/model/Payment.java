package com.urban_ride.payment.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tripId;
    private Double amount;
    private String status;
    private String paymentMethod;
    private String transactionId;
}
