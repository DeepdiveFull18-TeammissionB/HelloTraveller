package com.hellotraveller.crm.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hellotraveller.crm.domain.entity.Member;
import com.hellotraveller.crm.dto.MemberResponse;
import com.hellotraveller.crm.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
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
public class KakaoOAuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}") // 추가됨
    private String clientSecret;

    // @Value("${kakao.redirect-uri}") // 이제 안 씁니다 (프론트에서 받음)
    // private String redirectUri;

    @Transactional
    public MemberResponse kakaoLogin(String code, String redirectUri) {
        // 1. 인가 코드로 토큰 요청 (Redirect URI 전달 필요)
        String idToken = getKakaoIdToken(code, redirectUri);

        // 2. ID Token 디코딩
        KakaoUserInfo userInfo = decodeIdToken(idToken);

        // 3. 회원가입/로그인
        Member member = memberRepository.findByEmail(userInfo.getEmail())
                .orElseGet(() -> registerKakaoUser(userInfo));

        return new MemberResponse(member);
    }

    private String getKakaoIdToken(String code, String redirectUri) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret); // 필수로 추가됨
        params.add("redirect_uri", redirectUri); // 프론트에서 받은 URI 사용
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class);

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("id_token").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Kakao token parsing failed", e);
        }
    }

    private KakaoUserInfo decodeIdToken(String idToken) {
        // ID Token의 Payload 부분만 Base64 디코딩 (서명 검증 생략 - HTTPS 통신 신뢰)
        String[] chunks = idToken.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String payload = new String(decoder.decode(chunks[1]));

        try {
            JsonNode payloadNode = objectMapper.readTree(payload);
            String sub = payloadNode.get("sub").asText();
            String email = payloadNode.has("email") ? payloadNode.get("email").asText() : sub + "@kakao.com"; // 이메일 없을
                                                                                                              // 경우 대비
            String nickname = payloadNode.has("nickname") ? payloadNode.get("nickname").asText() : "Kakao User";

            return new KakaoUserInfo(sub, email, nickname);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("ID Token decoding failed", e);
        }
    }

    private Member registerKakaoUser(KakaoUserInfo userInfo) {
        // 비밀번호는 랜덤 생성 (소셜 로그인 사용자는 비번으로 로그인할 일 없음)
        String password = UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(password);

        Member newMember = Member.builder()
                .email(userInfo.getEmail())
                .password(encodedPassword)
                .name(userInfo.getNickname())
                .phone(null)
                .grade(Member.Grade.BASIC)
                .build();

        return memberRepository.save(newMember);
    }

    // 내부 클래스 (DTO)
    @lombok.AllArgsConstructor
    @lombok.Getter
    static class KakaoUserInfo {
        private String id;
        private String email;
        private String nickname;
    }
}
