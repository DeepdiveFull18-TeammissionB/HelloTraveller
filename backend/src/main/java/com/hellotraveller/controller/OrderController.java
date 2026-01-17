package com.hellotraveller.controller;

import com.hellotraveller.model.Order;
import com.hellotraveller.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public String createOrder(@RequestBody Order order) {
        orderService.createOrder(order);
        return "Order created successfully: " + order.getOrderID();
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable String orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/{orderId}")
    public String deleteOrder(@PathVariable String orderId) {
        orderService.softDeleteOrder(orderId);
        return "Order soft-deleted: " + orderId;
    }
}
