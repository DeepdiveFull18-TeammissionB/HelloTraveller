package com.hellotraveller.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotraveller.entity.Member;
import com.hellotraveller.dto.MemberResponse;
import com.hellotraveller.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Transactional
    public MemberResponse googleLogin(String code, String redirectUri) {
        String idToken = getGoogleIdToken(code, redirectUri);
        GoogleUserInfo userInfo = decodeIdToken(idToken);

        Member member = memberRepository.findByEmail(userInfo.getEmail())
                .orElseGet(() -> registerGoogleUser(userInfo));

        return new MemberResponse(member);
    }

    private String getGoogleIdToken(String code, String redirectUri) {
        String tokenUrl = "https://oauth2.googleapis.com/token";

        // 구글은 Body에 JSON으로 보내거나 Form-UrlEncoded 둘 다 가능하지만, Form 형식을 사용
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("id_token").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Google ID Token 파싱 실패", e);
        }
    }

    private GoogleUserInfo decodeIdToken(String idToken) {
        // 실제 운영 환경에서는 서명 검증이 필요하지만, 여기서는 페이로드 디코딩만 수행
        // JWT는 Header.Payload.Signature 구조
        String[] parts = idToken.split("\\.");
        if (parts.length < 2) {
            throw new RuntimeException("Invalid ID Token");
        }

        String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(payload, GoogleUserInfo.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("ID Token 디코딩 실패", e);
        }
    }

    private Member registerGoogleUser(GoogleUserInfo userInfo) {
        String password = userInfo.getId();
        String encodedPassword = passwordEncoder.encode(password);

        Member newMember = Member.builder()
                .email(userInfo.getEmail())
                .password(encodedPassword)
                .name(userInfo.getName())
                .phone(null)
                .grade(Member.Grade.BASIC)
                .build();

        @SuppressWarnings("null")
        Member savedMember = memberRepository.save(newMember);
        return savedMember;
    }

    @lombok.AllArgsConstructor
    @lombok.Getter
    static class GoogleUserInfo {
        private String id;
        private String email;
        private String name;
    }
}
