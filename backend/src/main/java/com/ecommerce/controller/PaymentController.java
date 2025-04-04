package com.ecommerce.controller;

import com.ecommerce.dto.PaymentDto;
import com.ecommerce.model.Payment;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    private final PaymentService paymentService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public PaymentController(PaymentService paymentService, JwtTokenProvider jwtTokenProvider) {
        this.paymentService = paymentService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        PaymentDto payment = paymentService.getPaymentByOrderId(orderId, userId);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping
    public ResponseEntity<PaymentDto> processPayment(@Valid @RequestBody PaymentDto paymentDto, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        PaymentDto processedPayment = paymentService.processPayment(paymentDto, userId);
        return new ResponseEntity<>(processedPayment, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentDto> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam Payment.PaymentStatus status,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        PaymentDto updatedPayment = paymentService.updatePaymentStatus(id, status, userId);
        return ResponseEntity.ok(updatedPayment);
    }
    
    // Helper method to extract user ID from the JWT token
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = resolveToken(request);
        return jwtTokenProvider.getUserId(token);
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}