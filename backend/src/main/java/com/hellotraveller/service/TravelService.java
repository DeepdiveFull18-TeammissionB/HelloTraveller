package com.hellotraveller.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotraveller.model.Country;
import com.hellotraveller.model.Option;
import com.hellotraveller.model.Product;
import com.hellotraveller.model.State;
import com.hellotraveller.model.TravelData;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TravelService {

    private TravelData travelData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // In-memory Cache for Combined Products - Currently using strict local JSON
    // mode
    // private final Map<String, List<Product>> productCache = new
    // ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("travel.json");
            travelData = objectMapper.readValue(resource.getInputStream(), TravelData.class);
            updateProductDates();

            // Initial Async Cache Population
            // refreshProductCache(); // Disabled as per current requirement

        } catch (Exception e) {
            System.err.println("Critical Init Error: " + e.getMessage());
            travelData = new TravelData();
        }
    }

    private void updateProductDates() {
        if (travelData == null || travelData.getCountries() == null)
            return;
        LocalDate today = LocalDate.now();
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

    public List<Product> getAllProducts() {
        // Temporary switch to strict JSON mode as requested by user
        return convertFallbackToProducts();

        /*
         * long now = System.currentTimeMillis();
         * 
         * // 1. Try Cache
         * if (!productCache.isEmpty() && now - lastCacheTime < CACHE_TTL) {
         * return productCache.values().stream()
         * .flatMap(List::stream)
         * .collect(Collectors.toList());
         * }
         * 
         * // 2. Refresh Async if expired
         * if (now - lastCacheTime >= CACHE_TTL) {
         * new Thread(this::refreshProductCache).start();
         * }
         * 
         * // 3. Fallback to Local JSON if cache empty
         * if (productCache.isEmpty()) {
         * return convertFallbackToProducts();
         * }
         * 
         * return productCache.values().stream()
         * .flatMap(List::stream)
         * .collect(Collectors.toList());
         */
    }

    /*
     * private void refreshProductCache() {
     * try {
     * System.out.println("Refreshing Product Cache from Amadeus API...");
     * List<Map<String, Object>> apiData = new ArrayList<>();
     * 
     * // Fetch for a few key cities to populate the main list
     * apiData.addAll(amadeusController.getTours(37.5665, 126.9780)); // Seoul
     * apiData.addAll(amadeusController.getTours(48.8566, 2.3522)); // Paris
     * 
     * if (!apiData.isEmpty()) {
     * List<Product> products =
     * apiData.stream().map(this::mapApiToProduct).collect(Collectors.toList());
     * productCache.put("all", products);
     * // lastCacheTime = System.currentTimeMillis();
     * System.out.println("Product Cache Updated. Total items: " + products.size());
     * }
     * } catch (Exception e) {
     * System.err.println("Failed to refresh product cache: " + e.getMessage());
     * }
     * }
     */

    /*
     * private Product mapApiToProduct(Map<String, Object> apiItem) {
     * Product p = new Product();
     * p.setName((String) apiItem.get("name"));
     * p.setImagePath((String) apiItem.get("imagePath"));
     * p.setDescription((String) apiItem.get("description"));
     * p.setPrice(Double.parseDouble(apiItem.get("price").toString()));
     * 
     * // Default Dates
     * LocalDate today = LocalDate.now();
     * p.setStartDate(today.plusDays(7).toString());
     * p.setEndDate(today.plusDays(10).toString());
     * 
     * // Type safety: Proper conversion from API data
     * Object optionsObj = apiItem.get("matchedOptions");
     * if (optionsObj instanceof List<?>) {
     * List<String> options = new ArrayList<>();
     * for (Object obj : (List<?>) optionsObj) {
     * if (obj instanceof String) {
     * options.add((String) obj);
     * }
     * }
     * p.setMatchedOptions(options);
     * }
     * return p;
     * }
     */

    public List<Country> getCountries() {
        return (travelData != null && travelData.getCountries() != null) ? travelData.getCountries()
                : Collections.emptyList();
    }

    public List<Option> getOptions() {
        return (travelData != null && travelData.getOptions() != null) ? travelData.getOptions()
                : Collections.emptyList();
    }

    private List<Product> convertFallbackToProducts() {
        List<Product> products = new ArrayList<>();
        if (travelData != null && travelData.getCountries() != null) {
            for (Country country : travelData.getCountries()) {
                if (country.getStates() != null) {
                    for (State state : country.getStates()) {
                        if (state.getProducts() != null) {
                            products.addAll(state.getProducts());
                        }
                    }
                }
            }
        }
        return products;
    }
}
