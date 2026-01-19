package com.hellotraveller.crm.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password; // Encrypted

    @Column(nullable = false, length = 20)
    private String name;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(nullable = false)
    private boolean isDeleted = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public Member(String email, String password, String name, String phone, Grade grade) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.grade = grade != null ? grade : Grade.BASIC;
        this.isDeleted = false;
    }

    public void updateInfo(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public void withdraw() {
        this.isDeleted = true;
    }

    public enum Grade {
        BASIC, VIP
    }
}
