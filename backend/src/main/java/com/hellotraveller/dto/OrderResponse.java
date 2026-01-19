package com.hellotraveller.dto;

import com.hellotraveller.entity.Order;
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
    private String guestEmail;
    private String guestPhone;
    private LocalDateTime createdAt;
    private String startDate;
    private String endDate;
    private Integer personCount;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .orderNo(order.getOrderNo())
                .productName(order.getProductName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .guestName(order.getGuestName())
                .guestEmail(order.getGuestEmail())
                .guestPhone(order.getGuestPhone())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
