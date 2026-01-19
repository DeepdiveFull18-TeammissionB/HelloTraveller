package com.hellotraveller.dto;

import com.hellotraveller.entity.Member;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MemberResponse {
    private final Long id;
    private final String email;
    private final String name;
    private final String grade;
    private final LocalDateTime createdAt;

    public MemberResponse(Member member) {
        this.id = member.getId();
        this.email = member.getEmail();
        this.name = member.getName();
        this.grade = member.getGrade().name();
        this.createdAt = member.getCreatedAt();
    }
}
