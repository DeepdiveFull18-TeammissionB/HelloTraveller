package com.hellotraveller.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotraveller.model.Country;
import com.hellotraveller.model.Option;
import com.hellotraveller.model.TravelData;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class TravelService {

    private TravelData travelData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        try {
            // 외부 API 호출 일체 차단 (서버 기동 안정성 확보)
            ClassPathResource resource = new ClassPathResource("travel.json");
            travelData = objectMapper.readValue(resource.getInputStream(), TravelData.class);

            updateProductDates(); // Call the new method to update dates
        } catch (Exception e) {
            System.err.println("Critical Init Error: " + e.getMessage());
            travelData = new TravelData();
        }
    }

    private void updateProductDates() {
        if (travelData == null || travelData.getCountries() == null)
            return;

        LocalDate today = LocalDate.now();

        // 원본 로직 복구: 모든 계층을 돌며 날짜 주입 (오늘 기준)
        travelData.getCountries().forEach(country -> {
            if (country.getStates() != null) {
                country.getStates().forEach(state -> {
                    if (state.getProducts() != null) {
                        state.getProducts().forEach(product -> {
                            product.setStartDate(today.plusDays(7).toString());
                            product.setEndDate(today.plusDays(12).toString());
                        });
                    }
                });
            }
        });
    }

    public List<Country> getCountries() {
        return (travelData != null && travelData.getCountries() != null) ? travelData.getCountries()
                : Collections.emptyList();
    }

    public List<Option> getOptions() {
        return (travelData != null && travelData.getOptions() != null) ? travelData.getOptions()
                : Collections.emptyList();
    }
}
