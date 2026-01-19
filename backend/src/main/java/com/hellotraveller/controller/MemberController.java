package com.hellotraveller.controller;

import com.hellotraveller.common.api.ApiResponse;
import com.hellotraveller.common.consts.SessionConst;
import com.hellotraveller.dto.MemberLoginRequest;
import com.hellotraveller.dto.MemberResponse;
import com.hellotraveller.dto.MemberSignupRequest;
import com.hellotraveller.service.MemberService;
import com.hellotraveller.service.impl.GoogleOAuthService;
import com.hellotraveller.service.impl.KakaoOAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class MemberController {

    private final MemberService memberService;
    private final KakaoOAuthService kakaoOAuthService;
    private final GoogleOAuthService googleOAuthService; // Service Injection

    // === 인증 (Auth) ===

    @PostMapping("/auth/kakao")
    public ApiResponse<Map<String, String>> kakaoLogin(@RequestBody Map<String, String> body,
            HttpServletRequest httpRequest) {
        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        MemberResponse loginMember = kakaoOAuthService.kakaoLogin(code, redirectUri);

        return createSessionAndResponse(httpRequest, loginMember, "카카오 로그인 되었습니다.");
    }

    @PostMapping("/auth/google")
    public ApiResponse<Map<String, String>> googleLogin(@RequestBody Map<String, String> body,
            HttpServletRequest httpRequest) {
        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        MemberResponse loginMember = googleOAuthService.googleLogin(code, redirectUri);

        return createSessionAndResponse(httpRequest, loginMember, "구글 로그인 되었습니다.");
    }

    private ApiResponse<Map<String, String>> createSessionAndResponse(HttpServletRequest httpRequest,
            MemberResponse member, String msg) {
        HttpSession session = httpRequest.getSession();
        session.setAttribute(SessionConst.LOGIN_MEMBER, member);

        Map<String, String> data = new HashMap<>();
        data.put("sessionId", session.getId());
        data.put("email", member.getEmail());
        data.put("name", member.getName());
        return ApiResponse.success(msg, data);
    }

    @PostMapping("/members/signup")
    public ApiResponse<MemberResponse> signup(@Valid @RequestBody MemberSignupRequest request) {
        MemberResponse response = memberService.signUp(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/auth/login")
    public ApiResponse<Map<String, String>> login(@Valid @RequestBody MemberLoginRequest request,
            HttpServletRequest httpRequest) {
        MemberResponse loginMember = memberService.login(request);

        // 세션 생성
        HttpSession session = httpRequest.getSession();
        session.setAttribute(SessionConst.LOGIN_MEMBER, loginMember);

        Map<String, String> data = new HashMap<>();
        data.put("sessionId", session.getId());

        return ApiResponse.success("로그인 되었습니다.", data);
    }

    @PostMapping("/auth/logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ApiResponse.success("로그아웃 되었습니다.", null);
    }

    // === 회원 관리 (Members) ===

    @GetMapping("/members/me")
    public ApiResponse<MemberResponse> getMyInfo(
            @io.swagger.v3.oas.annotations.Parameter(hidden = true) @SessionAttribute(name = SessionConst.LOGIN_MEMBER, required = false) MemberResponse loginMember) {
        if (loginMember == null) {
            throw new RuntimeException("로그인이 필요한 서비스입니다."); // 401
        }

        // 세션에 있는 정보가 최신이 아닐 수 있으므로 DB 조회
        MemberResponse currentInfo = memberService.getMyInfo(loginMember.getId());
        return ApiResponse.success(currentInfo);
    }

    @DeleteMapping("/members/me")
    public ApiResponse<Void> withdraw(
            @io.swagger.v3.oas.annotations.Parameter(hidden = true) @SessionAttribute(name = SessionConst.LOGIN_MEMBER, required = false) MemberResponse loginMember,
            HttpServletRequest request) {
        if (loginMember == null) {
            throw new RuntimeException("로그인이 필요한 서비스입니다.");
        }

        memberService.withdraw(loginMember.getId());

        // 세션 만료
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ApiResponse.success("회원 탈퇴가 완료되었습니다.", null);
    }
}
