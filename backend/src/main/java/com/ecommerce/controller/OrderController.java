package com.ecommerce.controller;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.model.Order;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public OrderController(OrderService orderService, JwtTokenProvider jwtTokenProvider) {
        this.orderService = orderService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @GetMapping
    public ResponseEntity<List<OrderDto>> getUserOrders(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        OrderDto order = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        OrderDto order = orderService.getOrderByOrderNumber(orderNumber, userId);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        OrderDto createdOrder = orderService.createOrder(orderDto, userId);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        OrderDto updatedOrder = orderService.updateOrderStatus(id, status, userId);
        return ResponseEntity.ok(updatedOrder);
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