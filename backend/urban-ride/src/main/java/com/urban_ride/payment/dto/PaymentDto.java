package com.urban_ride.payment.dto;

import lombok.Data;

@Data
public class PaymentDto {
    private Long id;
    private Long tripId;
    private Double amount;
    private String status;
}
