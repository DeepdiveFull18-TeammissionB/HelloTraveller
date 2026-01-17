package com.hellotraveller.config;

import com.amadeus.Amadeus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmadeusConfig {
    @Bean
    public Amadeus amadeus(
            @Value("${amadeus.client.id}") String id,
            @Value("${amadeus.client.secret}") String secret) {
        return Amadeus.builder(id, secret).build();
    }
}