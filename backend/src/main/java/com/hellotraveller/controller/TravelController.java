package com.hellotraveller.controller;

import com.hellotraveller.model.Country;
import com.hellotraveller.model.Option;
import com.hellotraveller.model.Order;
import com.hellotraveller.model.OrderRequest;
import com.hellotraveller.service.TravelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class TravelController {

    @Autowired
    private TravelService travelService;

    @GetMapping("/products")
    public List<Country> getProducts() {
        return travelService.getCountries();
    }

    @GetMapping("/options")
    public List<Option> getOptions() {
        return travelService.getOptions();
    }

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = travelService.createOrder(request.getTotals().getTotal());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}
