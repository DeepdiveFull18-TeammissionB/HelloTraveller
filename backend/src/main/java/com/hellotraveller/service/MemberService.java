package com.hellotraveller.service;

import com.hellotraveller.dto.MemberLoginRequest;
import com.hellotraveller.dto.MemberResponse;
import com.hellotraveller.dto.MemberSignupRequest;

public interface MemberService {

    /**
     * 회원 가입
     */
    MemberResponse signUp(MemberSignupRequest request);

    /**
     * 로그인
     * 
     * @return 로그인 성공한 회원의 ID (또는 세션에 저장할 객체)
     */
    MemberResponse login(MemberLoginRequest request);

    /**
     * 내 정보 조회
     */
    MemberResponse getMyInfo(Long memberId);

    /**
     * 회원 탈퇴
     */
    void withdraw(Long memberId);
}
