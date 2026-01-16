package com.hellotraveller.controller;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.resources.Activity;
import com.amadeus.exceptions.ResponseException;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AmadeusController {

    @Autowired
    private Amadeus amadeus;

    @GetMapping("/tours")
    public List<Map<String, Object>> getTours(@RequestParam Double lat, @RequestParam Double lon)
            throws ResponseException {
        Activity[] activities = amadeus.shopping.activities.get(
                Params.with("latitude", lat).and("longitude", lon).and("radius", 20));

        // 검색 결과가 없는 경우 빈 리스트 리턴 (에러 방지)
        if (activities == null)
            return new ArrayList<>();

        return Arrays.stream(activities).map(activity -> {
            Map<String, Object> item = new HashMap<>();
            try {
                item.put("name", activity.getName() != null ? activity.getName() : "이름 없는 투어");

                // 1. 이미지 Null 체크
                String image = "";
                if (activity.getPictures() != null && activity.getPictures().length > 0) {
                    image = activity.getPictures()[0];
                }
                item.put("imagePath", image);

                // 2. 설명 Null 체크 및 추출
                String desc = activity.getShortDescription();
                if (desc == null || desc.isEmpty()) {
                    desc = activity.getDescription();
                }
                item.put("description", desc != null ? desc.replaceAll("<[^>]*>", "") : "상세 설명이 준비 중입니다.");

                // 3. 가격 Null 체크 (500 에러의 가장 큰 원인)
                double price = 0;
                if (activity.getPrice() != null && activity.getPrice().getAmount() != null) {
                    try {
                        price = Double.parseDouble(activity.getPrice().getAmount());
                    } catch (NumberFormatException e) {
                        price = 0;
                    }
                }
                item.put("price", price);

            } catch (Exception e) {
                // 개별 아이템 처리 중 에러 발생 시 로그만 찍고 넘어감
                System.err.println("아이템 처리 중 오류 발생: " + e.getMessage());
            }
            return item;
        }).collect(Collectors.toList());
    }
}