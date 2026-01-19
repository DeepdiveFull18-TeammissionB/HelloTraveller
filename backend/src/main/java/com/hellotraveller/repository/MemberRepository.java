package com.hellotraveller.repository;

import com.hellotraveller.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 이메일 중복 검사
    boolean existsByEmail(String email);

    // 이메일로 회원 조회
    Optional<Member> findByEmail(String email);

    // 삭제되지 않은 회원 조회 (Optional)
    Optional<Member> findByEmailAndIsDeletedFalse(String email);
}
