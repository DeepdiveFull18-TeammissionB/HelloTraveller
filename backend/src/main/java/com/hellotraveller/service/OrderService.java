package com.hellotraveller.service;

import com.hellotraveller.model.Order;
import com.hellotraveller.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public void createOrder(Order order) {
        orderRepository.save(order);
    }

    public Order getOrder(String orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void softDeleteOrder(String orderId) {
        orderRepository.updateStatusById(orderId, "deleted");
    }
}
