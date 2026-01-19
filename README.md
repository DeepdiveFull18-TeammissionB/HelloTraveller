# HelloTraveller CRM 🌍

> 구름 딥다이브 팀미션 - 풀스택 웹 개발 실습 프로젝트 (CRM 고객 관리 시스템)

## 📌 프로젝트 개요

**HelloTraveller**는 사용자가 전 세계의 여행 상품을 탐색하고 예약할 수 있는 웹 플랫폼입니다.  
본 단계(**v2.0 CRM**)에서는 **Spring Boot 기반의 백엔드 마이그레이션**과 **회원 관리 시스템(CRM)** 구축에 중점을 두었습니다.

- **[실습 4]** 여행 상품 판매 서비스 (Node.js/Express) : 완료
- **[실습 7]** **회원 관리 서비스 (Spring Boot Migration)** : **완료 (Current)**
- **[실습 8]** 쇼핑몰 서비스 : (예정)

## 🛠 기술 스택 (v2.0 CRM)

### Backend
- **Framework**: Spring Boot 3.4.1
- **Language**: Java 17
- **Database**: H2 (In-Memory for Dev) / MySQL (Prod)
- **Security**: Spring Security 6.x (Session Based Auth)
- **API Docs**: Swagger UI (OpenAPI 3.1)
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI System**: Vapor UI (Goorm Design System)
- **State Management**: React Context API
- **Styling**: CSS Modules

## ✨ 주요 기능 (CRM)

### 1. 회원 관리 (Member Management)
- **회원가입/탈퇴**: 안전한 비밀번호 암호화(BCrypt) 및 개인정보 처리
- **로그인/로그아웃**: Spring Security 기반의 세션 인증 방식
- **내 정보 조회**: 현재 로그인한 사용자의 프로필 및 상태 확인

### 2. Spring Boot 마이그레이션
- 기존 Node.js/Express 백엔드를 Java Spring Boot로 전면 재구축
- **Layered Architecture**: Controller, Service, Repository 계층 분리
- **JPA/Hibernate**: 객체 지향적인 데이터베이스 접근 및 관리

### 3. API 문서화 (Swagger UI)
- **Swagger UI 연동**: API 엔드포인트를 시각적으로 확인하고 직접 테스트 가능
- **접속 주소**: `http://localhost:4000/swagger-ui.html`
- internal 파라미터(`@SessionAttribute`) 숨김 처리로 깔끔한 명세 제공

## 🚀 시작하기

### 1. 백엔드 실행 (Spring Boot)
서버 포트가 `4000`으로 설정되어 있습니다.

```bash
cd backend
./mvnw spring-boot:run
```
* **API 서버**: `http://localhost:4000`
* **Swagger UI**: `http://localhost:4000/swagger-ui.html`

### 2. 프론트엔드 실행 (Next.js)

```bash
cd frontend
npm run dev
```
* **웹 클라이언트**: `http://localhost:3000`

## 🧪 테스트 가이드

### API 테스트
Swagger UI를 통해 별도의 도구 없이 브라우저에서 바로 API를 테스트할 수 있습니다.
1. `http://localhost:4000/swagger-ui.html` 접속
2. `auth-controller`에서 로그인 시도
3. `member-controller`에서 내 정보 조회 (`GET /members/me`) 등으로 세션 유지 확인

### 자동화 테스트 (Backend)
```bash
cd backend
./mvnw test
```

## 👥 팀 정보
구름 딥다이브 팀미션 HelloFullstack팀

---
© 2026 HelloTraveller. All rights reserved.
