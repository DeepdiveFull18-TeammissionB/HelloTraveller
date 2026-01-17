package com.hellotraveller.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotraveller.model.Country;
import com.hellotraveller.model.Option;
import com.hellotraveller.model.Order;
import com.hellotraveller.model.TravelData;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class TravelService {

    private TravelData travelData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @org.springframework.beans.factory.annotation.Autowired
    private OrderService orderService;

    @PostConstruct
    public void init() throws IOException {
        // Load travel.json from classpath
        ClassPathResource resource = new ClassPathResource("travel.json");
        travelData = objectMapper.readValue(resource.getInputStream(), TravelData.class);
    }

    public List<Country> getCountries() {
        return travelData.getCountries();
    }

    public List<Option> getOptions() {
        return travelData.getOptions();
    }

    public Order createOrder(double price) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuidPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderId = String.format("HT-%s-%s", datePart, uuidPart);

        Order order = new Order();
        order.setOrderID(orderId);
        order.setTotalAmount(price);
        order.setStatus("confirmed");
        order.setDate(LocalDate.now().toString());

        orderService.createOrder(order);
        return order;
    }

    public List<Order> getOrderHistory() {
        return orderService.getAllOrders();
    }
}
