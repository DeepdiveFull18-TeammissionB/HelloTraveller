package com.hellotraveller.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private String name;
    private String imagePath;
    private String description;
    private double price;
    private String startDate;
    private String endDate;
    private List<String> matchedOptions; // 스마트 매칭 필드 추가
}
