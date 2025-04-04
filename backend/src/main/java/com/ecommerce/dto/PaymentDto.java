package com.ecommerce.dto;

import com.ecommerce.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    private String orderNumber;
    
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod paymentMethod;
    
    private Payment.PaymentStatus status;
    
    private String transactionId;
    
    private LocalDateTime paymentDate;
}