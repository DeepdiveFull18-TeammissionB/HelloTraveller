package com.hellotraveller.crm.dto;

import com.hellotraveller.crm.domain.entity.Order;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class OrderResponse {
    private String orderNo;
    private String productName;
    private int totalAmount;
    private String status;
    private String guestName;
    private LocalDateTime createdAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .orderNo(order.getOrderNo())
                .productName(order.getProductName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .guestName(order.getGuestName())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
