package com.hellotraveller.config;

import com.amadeus.Amadeus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmadeusConfig {

    @Value("${amadeus.client.id:dummy}")
    private String id;

    @Value("${amadeus.client.secret:dummy}")
    private String secret;

    @Bean
    public Amadeus amadeus() {
        // [복구] 서버 기동을 방해하지 않도록 키가 없을 때의 예외 처리를 강화한 원본 지향 코드
        try {
            return Amadeus.builder(id, secret).build();
        } catch (Exception e) {
            return null; // Bean 생성은 하되 API 호출 시 에러가 나게 함 (기동에는 지장 없음)
        }
    }
}