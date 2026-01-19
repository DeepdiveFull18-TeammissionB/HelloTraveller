package com.hellotraveller.controller;

import com.hellotraveller.common.api.ApiResponse;
import com.hellotraveller.dto.GuestOrderRequest;
import com.hellotraveller.dto.OrderCreateRequest;
import com.hellotraveller.dto.OrderResponse;
import com.hellotraveller.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody OrderCreateRequest request) {
        String requestId = java.util.UUID.randomUUID().toString();
        log.info("[RequestID: {}] Received Order Create Request for: {}", requestId, request.getCustomerEmail());
        OrderResponse response = orderService.createOrder(request);
        log.info("[RequestID: {}] Order Processed Successfully: {}", requestId, response.getOrderNo());
        return ApiResponse.success(response);
    }

    @GetMapping("/{orderNo}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable String orderNo) {
        return ApiResponse.success(orderService.getOrderByNo(orderNo));
    }

    @PostMapping("/{orderNo}/complete")
    public ApiResponse<Void> completeOrder(@PathVariable String orderNo) {
        orderService.completeOrder(orderNo);
        return ApiResponse.success(null);
    }

    @PostMapping("/{orderNo}/cancel")
    public ApiResponse<Void> cancelOrder(@PathVariable String orderNo) {
        orderService.cancelOrder(orderNo);
        return ApiResponse.success(null);
    }

    @PostMapping("/{orderNo}/delete")
    public ApiResponse<Void> deleteOrder(@PathVariable String orderNo) {
        orderService.deleteOrder(orderNo);
        return ApiResponse.success(null);
    }

    @PostMapping("/guest")
    public ApiResponse<OrderResponse> getGuestOrder(
            @RequestBody GuestOrderRequest request) {
        return ApiResponse.success(orderService.getGuestOrder(request));
    }
}
