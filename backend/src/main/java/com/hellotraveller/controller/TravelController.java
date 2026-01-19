package com.hellotraveller.controller;

import com.hellotraveller.model.Country;
import com.hellotraveller.model.Option;
import com.hellotraveller.model.Product;
import com.hellotraveller.service.TravelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TravelController {

    @Autowired
    private TravelService travelService;

    @GetMapping("/api/tours")
    public List<Product> getProducts() {
        // [복구 로직 수정] travel.json 구조가 평탄화(Country 자체가 상품)되어 있으므로
        // 복잡한 계층 순회 대신 Country -> Product 매핑으로 전환합니다.
        List<Product> allProducts = new ArrayList<>();
        List<Country> countries = travelService.getCountries();

        if (countries != null) {
            String today = java.time.LocalDate.now().plusDays(7).toString();
            String endDate = java.time.LocalDate.now().plusDays(12).toString();

            for (Country country : countries) {
                Product product = new Product();
                product.setName(country.getName());
                product.setImagePath(country.getImagePath());
                product.setDescription(country.getDescription());
                product.setPrice(country.getPrice());
                product.setStartDate(today);
                product.setEndDate(endDate);
                product.setMatchedOptions(new ArrayList<>()); // 기본값
                allProducts.add(product);
            }
        }
        return allProducts;
    }

    @GetMapping("/options")
    public List<Option> getOptions() {
        return travelService.getOptions();
    }
}
