package com.ecommerce.service;

import com.ecommerce.dto.PaymentDto;
import com.ecommerce.exception.InvalidRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Order;
import com.ecommerce.model.Payment;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    
    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }
    
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        
        return mapPaymentToDto(payment);
    }
    
    public PaymentDto getPaymentByOrderId(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Order does not belong to the user");
        }
        
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));
        
        return mapPaymentToDto(payment);
    }
    
    @Transactional
    public PaymentDto processPayment(PaymentDto paymentDto, Long userId) {
        Order order = orderRepository.findById(paymentDto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", paymentDto.getOrderId()));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Order does not belong to the user");
        }

        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            throw new InvalidRequestException("Payment already exists for this order");
        });
        
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(paymentDto.getAmount());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setStatus(Payment.PaymentStatus.COMPLETED); // For simplicity, we'll mark it as completed
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        
        order.setStatus(Order.OrderStatus.PROCESSING);
        orderRepository.save(order);
        
        return mapPaymentToDto(savedPayment);
    }
    
    @Transactional
    public PaymentDto updatePaymentStatus(Long paymentId, Payment.PaymentStatus status, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        

        if (!payment.getOrder().getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Payment does not belong to the user");
        }
        
        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);
        
        return mapPaymentToDto(updatedPayment);
    }
    

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    

    private PaymentDto mapPaymentToDto(Payment payment) {
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setOrderId(payment.getOrder().getId());
        paymentDto.setOrderNumber(payment.getOrder().getOrderNumber());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setPaymentMethod(payment.getPaymentMethod());
        paymentDto.setStatus(payment.getStatus());
        paymentDto.setTransactionId(payment.getTransactionId());
        paymentDto.setPaymentDate(payment.getPaymentDate());
        
        return paymentDto;
    }
}