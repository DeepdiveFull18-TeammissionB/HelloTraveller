package com.hellotraveller.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {
    private String productName;
    private int price; // Renamed from totalAmount
    private String customerName; // Renamed from guestName
    private String customerEmail; // Renamed from guestEmail
    private String customerPhone; // Renamed from guestPhone
    private int personCount; // Added field

    // 여행 시작일과 종료일 (프론트 달력 데이터)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;
}
