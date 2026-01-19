package com.hellotraveller.entity;

import com.hellotraveller.model.CustomerInfo;
import com.hellotraveller.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDynamoDb {

    private String orderID;
    private CustomerInfo customerInfo;
    private List<OrderItem> items;
    private String date;
    private String status;
    private Integer totalAmount;

    @DynamoDbPartitionKey
    public String getOrderID() {
        return orderID;
    }
}
