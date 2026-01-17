package com.hellotraveller.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInfo {
    private String name;
    private String email;
    private String phone;
}
