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
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class TravelService {

    private TravelData travelData;
    private final List<Order> orderHistory = new ArrayList<>();
    private final Random random = new Random();
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    public List<Order> createOrder(double price) {
        int orderNumber = random.nextInt(1000000);
        Order order = new Order(price, orderNumber);
        orderHistory.add(order);
        return orderHistory;
    }

    public List<Order> getOrderHistory() {
        return orderHistory;
    }
}
