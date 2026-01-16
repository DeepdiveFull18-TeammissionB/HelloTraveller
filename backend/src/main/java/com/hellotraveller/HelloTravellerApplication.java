package com.hellotraveller;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelloTravellerApplication {

    public static void main(String[] args) {
        // .env 파일을 수동으로 로드하여 시스템 프로퍼티로 설정
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(HelloTravellerApplication.class, args);
    }
}
