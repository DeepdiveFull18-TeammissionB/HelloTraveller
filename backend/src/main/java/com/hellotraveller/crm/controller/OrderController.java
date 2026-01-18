package com.hellotraveller.crm.controller;

import com.hellotraveller.crm.dto.OrderCreateRequest;
import com.hellotraveller.crm.dto.OrderResponse;
import com.hellotraveller.crm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderCreateRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{orderNo}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderNo) {
        return ResponseEntity.ok(orderService.getOrderByNo(orderNo));
    }

    @PostMapping("/{orderNo}/complete")
    public ResponseEntity<Void> completeOrder(@PathVariable String orderNo) {
        orderService.completeOrder(orderNo);
        return ResponseEntity.ok().build();
    }
}
