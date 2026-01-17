package com.hellotraveller.repository;

import com.hellotraveller.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import jakarta.annotation.PostConstruct;

@Repository
@RequiredArgsConstructor
public class OrderRepository {

    private final DynamoDbEnhancedClient dynamoDbEnhancedClient;
    private DynamoDbTable<Order> orderTable;

    @PostConstruct
    public void init() {
        this.orderTable = dynamoDbEnhancedClient.table("Orders", TableSchema.fromBean(Order.class));
        // Create table if not exists (Optional for dev, careful in prod)
        // For portfolio/dev, auto-creation is convenient.
        try {
            this.orderTable.createTable();
        } catch (Exception e) {
            System.err.println("Failed to create table: " + e.getMessage());
            e.printStackTrace();
            // Table might already exist or permission error.
            // In a real app we might handle specifically ResourceInUseException
        }
    }

    public void save(Order order) {
        orderTable.putItem(order);
    }

    public Order findById(String orderId) {
        return orderTable.getItem(r -> r.key(k -> k.partitionValue(orderId)));
    }

    public java.util.List<Order> findAll() {
        return orderTable.scan().items().stream().collect(java.util.stream.Collectors.toList());
    }

    public void updateStatusById(String orderID, String newStatus) {
        Order existingOrder = orderTable.getItem(software.amazon.awssdk.enhanced.dynamodb.Key.builder()
                .partitionValue(orderID)
                .build());
        if (existingOrder != null) {
            existingOrder.setStatus(newStatus);
            orderTable.updateItem(existingOrder);
        }
    }
}
