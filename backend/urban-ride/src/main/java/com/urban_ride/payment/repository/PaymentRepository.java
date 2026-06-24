package com.urban_ride.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urban_ride.payment.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
