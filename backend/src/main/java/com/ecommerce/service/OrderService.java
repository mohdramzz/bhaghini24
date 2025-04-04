package com.ecommerce.service;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.exception.InvalidRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    
    public List<OrderDto> getOrdersByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapOrderToDto)
                .collect(Collectors.toList());
    }
    
    public OrderDto getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        // Check if the order belongs to the user
        if (!order.getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Order does not belong to the user");
        }
        
        return mapOrderToDto(order);
    }
    
    public OrderDto getOrderByOrderNumber(String orderNumber, Long userId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Order does not belong to the user");
        }
        
        return mapOrderToDto(order);
    }
    
    @Transactional
    public OrderDto createOrder(OrderDto orderDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(orderDto.getShippingAddress());
        order.setBillingAddress(orderDto.getBillingAddress());
        order.setStatus(Order.OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        
        for (OrderItemDto itemDto : orderDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new InvalidRequestException("Not enough stock for product: " + product.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            savedOrder.addOrderItem(orderItem);
            

            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        savedOrder.calculateTotalAmount();
        

        Order completedOrder = orderRepository.save(savedOrder);
        
        return mapOrderToDto(completedOrder);
    }
    
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new InvalidRequestException("Order does not belong to the user");
        }
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        return mapOrderToDto(updatedOrder);
    }
    
    private OrderDto mapOrderToDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setOrderNumber(order.getOrderNumber());
        orderDto.setUserId(order.getUser().getId());
        orderDto.setStatus(order.getStatus());
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setShippingAddress(order.getShippingAddress());
        orderDto.setBillingAddress(order.getBillingAddress());
        orderDto.setCreatedAt(order.getCreatedAt());
        orderDto.setUpdatedAt(order.getUpdatedAt());
        
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(this::mapOrderItemToDto)
                .collect(Collectors.toList());
        orderDto.setItems(itemDtos);
        
        return orderDto;
    }
    
    private OrderItemDto mapOrderItemToDto(OrderItem orderItem) {
        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setId(orderItem.getId());
        itemDto.setProductId(orderItem.getProduct().getId());
        itemDto.setProductName(orderItem.getProduct().getName());
        itemDto.setQuantity(orderItem.getQuantity());
        itemDto.setPrice(orderItem.getPrice());
        itemDto.setSubtotal(orderItem.getSubtotal());
        
        return itemDto;
    }
}