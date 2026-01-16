package com.hellotraveller.controller;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.resources.Activity;
import com.amadeus.exceptions.ResponseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct; // Spring Boot 3+ uses Jakarta

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AmadeusController {

    @Autowired
    private Amadeus amadeus;

    // 간단한 인메모리 캐시 (Key: "lat,lon", Value: CacheEntry)
    private final Map<String, CacheEntry> tourCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = 3600000; // 1시간 (밀리초)

    // 주요 도시 리스트 (Cache Warming용)
    private static final List<double[]> PROMO_CITIES = Arrays.asList(
            new double[] { 37.5665, 126.9780 }, // Seoul
            new double[] { 41.3851, 2.1734 }, // Barcelona
            new double[] { 48.8566, 2.3522 }, // Paris
            new double[] { 51.5074, -0.1278 }, // London
            new double[] { 40.7128, -74.0060 }, // New York
            new double[] { 13.7563, 100.5018 }, // Bangkok
            new double[] { 34.6937, 135.5023 }, // Osaka
            new double[] { 41.9028, 12.4964 }, // Rome
            new double[] { 35.6762, 139.6503 } // Tokyo
    );

    // 캐시 엔트리 클래스
    private static class CacheEntry {
        List<Map<String, Object>> data;
        long timestamp;

        CacheEntry(List<Map<String, Object>> data, long timestamp) {
            this.data = data;
            this.timestamp = timestamp;
        }
    }

    // 서버 시작 시 캐시 워밍 (비동기 처리)
    @PostConstruct
    public void initCache() {
        new Thread(() -> {
            System.out.println("========== [Cache Warming] Started ==========");
            for (double[] city : PROMO_CITIES) {
                try {
                    System.out.println("Fetching data for city coords: " + Arrays.toString(city));
                    getTours(city[0], city[1]); // 캐시 적재
                    Thread.sleep(500); // API Rate Limit 방지 딜레이
                } catch (Exception e) {
                    System.err.println("Failed to warm cache for " + Arrays.toString(city) + ": " + e.getMessage());
                }
            }
            System.out.println("========== [Cache Warming] Completed ==========");
        }).start();
    }

    @GetMapping("/tours")
    public List<Map<String, Object>> getTours(@RequestParam Double lat, @RequestParam Double lon)
            throws ResponseException {

        String cacheKey = lat + "," + lon;
        long now = System.currentTimeMillis();

        // 1. 캐시 조회
        if (tourCache.containsKey(cacheKey)) {
            CacheEntry entry = tourCache.get(cacheKey);
            if (now - entry.timestamp < CACHE_TTL) {
                System.out.println("Cache Hit! Returning cached data for: " + cacheKey);
                return entry.data;
            } else {
                System.out.println("Cache Expired for: " + cacheKey);
                tourCache.remove(cacheKey);
            }
        }

        System.out.println("Cache Miss. Fetching from Amadeus API for: " + cacheKey);

        // 2. 외부 API 호출
        Activity[] activities = amadeus.shopping.activities.get(
                Params.with("latitude", lat).and("longitude", lon).and("radius", 20));

        if (activities == null)
            return new ArrayList<>();

        // 3. 데이터 가공 및 필터링 (이미지 없는 항목 제외)
        List<Map<String, Object>> result = Arrays.stream(activities)
                .filter(activity -> {
                    // 이미지가 없거나 배열 길이가 0이면 제외
                    return activity.getPictures() != null && activity.getPictures().length > 0;
                })
                .map(activity -> {
                    Map<String, Object> item = new HashMap<>();
                    try {
                        item.put("name", activity.getName() != null ? activity.getName() : "이름 없는 투어");

                        // 이미지 (필터링을 통과했으므로 안전하게 접근 가능)
                        item.put("imagePath", activity.getPictures()[0]);

                        // 설명
                        String desc = activity.getShortDescription();
                        if (desc == null || desc.isEmpty()) {
                            desc = activity.getDescription();
                        }
                        item.put("description", desc != null ? desc.replaceAll("<[^>]*>", "") : "상세 설명이 준비 중입니다.");

                        // 가격
                        long price = 0;
                        if (activity.getPrice() != null && activity.getPrice().getAmount() != null) {
                            try {
                                double eurPrice = Double.parseDouble(activity.getPrice().getAmount());
                                price = Math.round(eurPrice * 1400);
                            } catch (NumberFormatException e) {
                                price = 0;
                            }
                        }
                        item.put("price", price);

                    } catch (Exception e) {
                        System.err.println("아이템 처리 중 오류 발생: " + e.getMessage());
                    }
                    // 3.1. 스마트 옵션 매칭 (키워드 분석)
                    List<String> matchedOptions = new ArrayList<>();
                    String descriptionLower = (item.get("description").toString() + " " + activity.getName())
                            .toLowerCase();

                    // 키워드 매핑 (Amadeus 설명 -> Frontend 옵션명)
                    Map<String, String> keywordMap = new HashMap<>();
                    keywordMap.put("guide", "현지 가이드 동행");
                    keywordMap.put("escort", "현지 가이드 동행");
                    keywordMap.put("transport", "교통비 포함");
                    keywordMap.put("transfer", "교통비 포함");
                    keywordMap.put("pickup", "교통비 포함");
                    keywordMap.put("boat", "전용 보트 서비스");
                    keywordMap.put("cruise", "전용 보트 서비스");
                    keywordMap.put("sailing", "전용 보트 서비스");
                    keywordMap.put("lunch", "중식 및 생수 제공");
                    keywordMap.put("dinner", "중식 및 생수 제공");
                    keywordMap.put("meal", "중식 및 생수 제공");
                    keywordMap.put("food", "중식 및 생수 제공");
                    keywordMap.put("ticket", "입장료 전부 포함");
                    keywordMap.put("entrance", "입장료 전부 포함");
                    keywordMap.put("admission", "입장료 전부 포함");
                    keywordMap.put("insurance", "여행자 보험");

                    for (String keyword : keywordMap.keySet()) {
                        if (descriptionLower.contains(keyword)) {
                            String optionName = keywordMap.get(keyword);
                            if (!matchedOptions.contains(optionName)) {
                                matchedOptions.add(optionName);
                            }
                        }
                    }
                    item.put("matchedOptions", matchedOptions);

                    return item;
                }).collect(Collectors.toList());

        // 4. 데이터 섞기 및 15개 제한 (네트워크 전송량 최적화)
        Collections.shuffle(result);
        List<Map<String, Object>> limitedResult = result.stream()
                .limit(15)
                .collect(Collectors.toList());

        // 5. 캐시 저장
        tourCache.put(cacheKey, new CacheEntry(limitedResult, now));

        return limitedResult;
    }
}
