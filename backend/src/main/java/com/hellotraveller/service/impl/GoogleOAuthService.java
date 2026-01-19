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
import org.springframework.http.HttpEntity; // 이거 다시 추가!
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
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
        RestTemplate restTemplate = new RestTemplate();

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

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://oauth2.googleapis.com/token",
                request,
                String.class);

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("id_token").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Google token parsing failed", e);
        }
    }

    private GoogleUserInfo decodeIdToken(String idToken) {
        String[] chunks = idToken.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String payload = new String(decoder.decode(chunks[1]));

        try {
            JsonNode payloadNode = objectMapper.readTree(payload);
            String sub = payloadNode.get("sub").asText();
            String email = payloadNode.get("email").asText();
            String name = payloadNode.has("name") ? payloadNode.get("name").asText() : "Google User";

            return new GoogleUserInfo(sub, email, name);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("ID Token decoding failed", e);
        }
    }

    private Member registerGoogleUser(GoogleUserInfo userInfo) {
        String password = UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(password);

        Member newMember = Member.builder()
                .email(userInfo.getEmail())
                .password(encodedPassword)
                .name(userInfo.getName())
                .phone(null)
                .grade(Member.Grade.BASIC)
                .build();

        return memberRepository.save(newMember);
    }

    @lombok.AllArgsConstructor
    @lombok.Getter
    static class GoogleUserInfo {
        private String id;
        private String email;
        private String name;
    }
}
