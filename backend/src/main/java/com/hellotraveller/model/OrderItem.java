package com.hellotraveller.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String name;
    private String type;
    private int count;
    private Double price;
    private String imagePath;
    private String startDate;
    private String endDate;
}
