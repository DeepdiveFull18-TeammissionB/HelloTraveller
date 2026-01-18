package com.hellotraveller.crm.service.impl;

import com.hellotraveller.crm.domain.entity.Member;
import com.hellotraveller.crm.dto.MemberLoginRequest;
import com.hellotraveller.crm.dto.MemberResponse;
import com.hellotraveller.crm.dto.MemberSignupRequest;
import com.hellotraveller.crm.repository.MemberRepository;
import com.hellotraveller.crm.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public MemberResponse signUp(MemberSignupRequest request) {
        // 1. 이메일 중복 검사
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다."); // TODO: Custom Exception
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. 엔티티 생성
        Member member = Member.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .phone(request.getPhone())
                .grade(Member.Grade.BASIC)
                .build();

        // 4. 저장
        Member savedMember = memberRepository.save(member);

        return new MemberResponse(savedMember);
    }

    @Override
    public MemberResponse login(MemberLoginRequest request) {
        // 1. 회원 조회
        Member member = memberRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        return new MemberResponse(member);
    }

    @Override
    public MemberResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        return new MemberResponse(member);
    }

    @Override
    @Transactional
    public void withdraw(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        member.withdraw(); // Soft Delete
    }
}
