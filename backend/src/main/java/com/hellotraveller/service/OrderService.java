package com.hellotraveller.service;

import com.hellotraveller.dto.GuestOrderRequest;
import com.hellotraveller.dto.OrderCreateRequest;
import com.hellotraveller.dto.OrderResponse;
import com.hellotraveller.entity.Order;
import com.hellotraveller.entity.OrderDynamoDb;
import com.hellotraveller.repository.OrderRepository;
import com.hellotraveller.model.CustomerInfo;
import com.hellotraveller.model.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private DynamoDbEnhancedClient dynamoDbEnhancedClient;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {
        // 0. Idempotency Check (Duplicate Prevention)
        LocalDateTime windowStart = LocalDateTime.now().minusSeconds(5);
        return orderRepository.findTopByGuestEmailAndProductNameAndCreatedAtAfter(
                request.getCustomerEmail(),
                request.getProductName(),
                windowStart)
                .map(existingOrder -> {
                    log.warn("Duplicate request detected for email: {} and product: {}. Returning existing order: {}",
                            request.getCustomerEmail(), request.getProductName(), existingOrder.getOrderNo());
                    return OrderResponse.from(existingOrder);
                })
                .orElseGet(() -> {
                    // Proceed with new order creation
                    return processNewOrder(request);
                });
    }

    private OrderResponse processNewOrder(OrderCreateRequest request) {
        String orderNo = generateOrderNo();
        String todayStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy. M. d. a h:mm:ss"));

        // 1. Save to H2 (In-Memory)
        Order order = Order.builder()
                .orderNo(orderNo)
                .productName(request.getProductName())
                .totalAmount(request.getPrice())
                .status("PENDING")
                .guestName(request.getCustomerName())
                .guestEmail(request.getCustomerEmail())
                .guestPhone(request.getCustomerPhone())
                .build();

        @SuppressWarnings("null")
        Order savedOrder = orderRepository.save(order);

        // 2. Save to DynamoDB (Remote Persistence)
        if (dynamoDbEnhancedClient != null) {
            try {
                log.info("Attempting to save order to DynamoDB...");
                DynamoDbTable<OrderDynamoDb> orderTable = dynamoDbEnhancedClient.table("Orders",
                        TableSchema.fromBean(OrderDynamoDb.class));

                CustomerInfo customerInfo = new CustomerInfo(
                        request.getCustomerName(),
                        request.getCustomerEmail(),
                        request.getCustomerPhone());

                OrderItem item = new OrderItem();
                item.setName(request.getProductName());
                item.setPrice((double) request.getPrice());
                item.setCount(request.getPersonCount());
                item.setStartDate(request.getStartDate() != null ? request.getStartDate().toString() : "");
                item.setEndDate(request.getEndDate() != null ? request.getEndDate().toString() : "");

                OrderDynamoDb dynamoOrder = OrderDynamoDb.builder()
                        .orderID(orderNo)
                        .customerInfo(customerInfo)
                        .items(Collections.singletonList(item))
                        .date(todayStr)
                        .status("confirmed")
                        .totalAmount(request.getPrice())
                        .build();

                orderTable.putItem(dynamoOrder);
                log.info("Saved order to DynamoDB: {}", orderNo);

            } catch (Exception e) {
                log.error("Failed to save order to DynamoDB", e);
            }
        } else {
            log.warn("DynamoDbEnhancedClient is null. Skipping DynamoDB save.");
        }

        // Return from saved order, but extra fields (dates) are null in H2 entity.
        // We could populate them manually in OrderResponse if needed, but for 'create',
        // frontend handles it.
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
        updateDynamoDbStatus(orderNo, "COMPLETED");
    }

    @Transactional
    public void deleteOrder(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNo));
        order.delete();
        updateDynamoDbStatus(orderNo, "DELETED");
    }

    @Transactional
    public void cancelOrder(String orderNo) {
        Order order = orderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNo));
        order.cancel();
        updateDynamoDbStatus(orderNo, "CANCELED");
    }

    private void updateDynamoDbStatus(String orderNo, String newStatus) {
        log.info("[DynamoDB] Attempting to update status for order: {} to {}", orderNo, newStatus);
        if (dynamoDbEnhancedClient == null) {
            log.error("[DynamoDB] Error: DynamoDbEnhancedClient is null.");
            return;
        }
        try {
            DynamoDbTable<OrderDynamoDb> orderTable = dynamoDbEnhancedClient.table("Orders",
                    TableSchema.fromBean(OrderDynamoDb.class));

            log.info("[DynamoDB] Fetching item with Key(partitionValue): {}", orderNo);

            OrderDynamoDb orderStats = orderTable.getItem(r -> r.key(k -> k.partitionValue(orderNo)));
            if (orderStats != null) {
                log.info("[DynamoDB] Item FOUND. Current Status: {}", orderStats.getStatus());

                orderStats.setStatus(newStatus);
                orderTable.updateItem(orderStats);

                log.info("[DynamoDB] Update SUCCESS. New Status: {}", newStatus);
            } else {
                log.warn("[DynamoDB] Warning: Order NOT FOUND in DynamoDB for key: {}", orderNo);
            }
        } catch (Exception e) {
            log.error("[DynamoDB] EXECUTION FAILED: {}", e.getMessage(), e);
        }
    }

    public OrderResponse getGuestOrder(GuestOrderRequest request) {
        // 1. Try H2
        return orderRepository.findByOrderNoAndGuestNameAndGuestEmail(
                request.getOrderNo(), request.getName(), request.getEmail())
                .map(OrderResponse::from)
                .orElseGet(() -> {
                    // 2. Fallback to DynamoDB
                    try {
                        DynamoDbTable<OrderDynamoDb> orderTable = dynamoDbEnhancedClient.table("Orders",
                                TableSchema.fromBean(OrderDynamoDb.class));
                        log.info("Fetching from DynamoDB table 'Orders' with Key: {}", request.getOrderNo());
                        OrderDynamoDb dynamoOrder = orderTable
                                .getItem(r -> r.key(k -> k.partitionValue(request.getOrderNo())));

                        if (dynamoOrder != null) {
                            // Verify Name and Email
                            if (dynamoOrder.getCustomerInfo() != null &&
                                    dynamoOrder.getCustomerInfo().getName().equals(request.getName()) &&
                                    dynamoOrder.getCustomerInfo().getEmail().equals(request.getEmail())) {

                                String startDate = "";
                                String endDate = "";
                                Integer personCount = 0;
                                if (dynamoOrder.getItems() != null && !dynamoOrder.getItems().isEmpty()) {
                                    OrderItem item = dynamoOrder.getItems().get(0);
                                    startDate = item.getStartDate();
                                    endDate = item.getEndDate();
                                    personCount = item.getCount();
                                }

                                return OrderResponse.builder()
                                        .orderNo(dynamoOrder.getOrderID())
                                        .productName(dynamoOrder.getItems().isEmpty() ? "Unknown Product"
                                                : dynamoOrder.getItems().get(0).getName())
                                        .totalAmount(dynamoOrder.getTotalAmount())
                                        .status(dynamoOrder.getStatus())
                                        .guestName(dynamoOrder.getCustomerInfo().getName())
                                        // .guestEmail(dynamoOrder.getCustomerInfo().getEmail()) // DTO doesn't have
                                        // email? Check DTO.
                                        // .guestPhone(dynamoOrder.getCustomerInfo().getPhone()) // DTO doesn't have
                                        // phone?
                                        .startDate(startDate)
                                        .endDate(endDate)
                                        .personCount(personCount)
                                        .startDate(startDate)
                                        .endDate(endDate)
                                        .personCount(personCount)
                                        .createdAt(LocalDateTime.parse(dynamoOrder.getDate(),
                                                DateTimeFormatter.ofPattern("yyyy. M. d. a h:mm:ss")))
                                        .build();
                            } else {
                                log.warn("DynamoDB verification failed. Input: [{}, {}] vs DB",
                                        request.getName(), request.getEmail());
                                throw new IllegalArgumentException("주문 정보를 찾았으나 이름/이메일 검증에 실패했습니다.");
                            }
                        } else {
                            log.warn("Order not found in DynamoDB for orderNo: {}", request.getOrderNo());
                        }
                    } catch (IllegalArgumentException e) {
                        throw e;
                    } catch (Exception e) {
                        log.error("Failed to fetch from DynamoDB", e);
                        throw new RuntimeException("시스템 오류로 조회에 실패했습니다: " + e.getMessage());
                    }
                    throw new IllegalArgumentException("일치하는 예약 내역이 없습니다. (H2 & DynamoDB 조회 결과 없음)");
                });
    }

    private String generateOrderNo() {
        return "HT-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
