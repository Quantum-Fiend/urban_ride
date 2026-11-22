package com.urban_ride.payment.controller;

import com.urban_ride.auth.model.User;
import com.urban_ride.auth.service.AuthService;
import com.urban_ride.common.response.ApiResponse;
import com.urban_ride.payment.model.Payment;
import com.urban_ride.payment.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Multi-Modal Payments & Wallet Ledger")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;

    @GetMapping("/trip/{tripId}")
    @Operation(summary = "Get payment transaction for a trip")
    public ResponseEntity<ApiResponse<Payment>> getPaymentForTrip(@PathVariable Long tripId) {
        Payment payment = paymentRepository.findByTripId(tripId)
                .orElse(null);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    @PostMapping("/wallet/topup")
    @Operation(summary = "Top up digital wallet balance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> topUpWallet(@RequestBody Map<String, BigDecimal> payload) {
        User user = authService.getCurrentAuthenticatedUser();
        BigDecimal amount = payload.getOrDefault("amount", BigDecimal.ZERO);
        user.setWalletBalance(user.getWalletBalance().add(amount));

        return ResponseEntity.ok(ApiResponse.ok("Wallet recharged successfully",
                Map.of("newBalance", user.getWalletBalance())));
    }
}
