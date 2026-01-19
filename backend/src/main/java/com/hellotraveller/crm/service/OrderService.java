package com.hellotraveller.crm.service;

import com.hellotraveller.crm.domain.entity.Order;
import com.hellotraveller.crm.dto.OrderCreateRequest;
import com.hellotraveller.crm.dto.OrderResponse;
import com.hellotraveller.crm.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    @SuppressWarnings("null")
    public OrderResponse createOrder(OrderCreateRequest request) {
        String orderNo = generateOrderNo();

        Order order = Order.builder()
                .orderNo(orderNo)
                .productName(request.getProductName())
                .totalAmount(request.getPrice()) // Mapped price -> totalAmount
                .status("PENDING")
                .guestName(request.getCustomerName()) // Mapped customerName -> guestName
                .guestEmail(request.getCustomerEmail()) // Mapped customerEmail -> guestEmail
                .guestPhone(request.getCustomerPhone()) // Mapped customerPhone -> guestPhone
                .build();

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.from(savedOrder);
    }

    public OrderResponse getOrderByNo(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNo));
        return OrderResponse.from(order);
    }

    @Transactional
    public void completeOrder(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNo));
        order.completePayment();
    }

    private String generateOrderNo() {
        return "HT-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
