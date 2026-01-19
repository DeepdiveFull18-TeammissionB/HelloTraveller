package com.hellotraveller.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNo;

    private String productName;
    private int totalAmount;
    private String status; // PENDING, COMPLETED, CANCELLED
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    private LocalDateTime createdAt;

    @Builder
    public Order(String orderNo, String productName, int totalAmount, String status,
            String guestName, String guestEmail, String guestPhone) {
        this.orderNo = orderNo;
        this.productName = productName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.createdAt = LocalDateTime.now();
    }

    public void completePayment() {
        this.status = "COMPLETED";
    }

    public void cancel() {
        this.status = "CANCELED";
    }

    public void delete() {
        this.status = "DELETED";
    }
}
