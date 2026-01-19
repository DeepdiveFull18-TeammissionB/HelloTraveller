# HelloTraveller 🌍

> 구름 딥다이브 팀미션 - 풀스택 웹 개발 실습 프로젝트(여행 상품 플랫폼)

## 📌 프로젝트 개요

구름 딥다이브 과정의 팀 미션으로 진행한 순차적 개발 프로젝트입니다.  
여행 상품 판매부터 회원 관리, 쇼핑몰까지 단계별로 기능을 확장하며 풀스택 개발 역량을 키웁니다.

## 🎯 실습 프로젝트

- **[실습 4]** 여행 상품 판매 서비스 : 완료
- **[실습 7]** 회원 관리 서비스 : 완료
- **[실습 8]** 쇼핑몰 서비스 : 진행중

**HelloTraveller**는 사용자가 전 세계의 여행 상품을 탐색하고 예약할 수 있는 웹 플랫폼입니다.  
Amadeus API를 활용한 실시간 투어 정보 제공, 사용자 위치 기반의 동적 항공 경로 계산, 그리고 대용량 트래픽을 고려한 성능 최적화(Caching) 기술이 적용되어 있습니다.


## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19, TypeScript
- **UI System**: Vapor UI (Goorm Design System)
- **State Management**: React Context API (Order/Cart)
- **Styling**: CSS Modules
- **Build System**: Turbopack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: Amazon DynamoDB (Local/Remote)
- **External API**: Amadeus Travel API

### Infrastructure & Deployment
- **Proxy/CDN**: Amazon CloudFront (HTTPS, Reverse Proxy)
- **Computing**: Amazon EC2 (Ubuntu 24.04, t2.micro)
- **Containerization**: Docker, Docker Compose
- **SSL/TLS**: AWS Certificate Manager (ACM)
- **Memory**: 2GB Swap Memory (Free Tier Optimization)

## ✨ 주요 기능(Base Code)

### 1. 글로벌 투어 상품 추천 (Amadeus API)
- **랜덤 도시 추천**: 매 접속 시 파리, 런던, 뉴욕 등 전 세계 주요 도시 중 한 곳을 랜덤으로 선정하여 관련 투어 상품을 추천합니다.
- **실시간 데이터**: Amadeus API를 통해 현지의 최신 액티비티 정보를 불러옵니다.

### 2. 동적 항공 경로 계산 (Smart Routing)
- **Intelligent Routing**: 사용자의 거주지(서울, 부산, 제주 등)와 여행 목적지(유럽, 아시아 등)를 분석하여 최적의 항공 경로를 보여줍니다.
- **Local Activity 감지**: '북촌', '서울 투어' 등 현지 체험 상품의 경우 항공 경로 대신 '현지 일정 시작/종료'로 직관적으로 표시합니다.

### 3. 성능 최적화 (Backend Caching)
- **In-Memory Caching**: 외부 API 호출 결과를 서버 메모리에 캐싱(TTL 1시간)하여, 로딩 속도를 **1초 이상 -> 0.1초 미만**으로 단축했습니다.
- **데이터 필터링**: 이미지가 없거나 품질이 낮은 상품은 자동으로 필터링하여 사용자에게 최상의 경험을 제공합니다.

### 4. 예약 및 결제 시스템
- **장바구니**: 상품 및 옵션(조식, 픽업 등)을 자유롭게 추가/삭제할 수 있습니다.
- **실시간 가격 계산**: 인원 수, 옵션 변경에 따른 총액을 즉시 계산하여 보여줍니다.
- **주문 내역 처리**: 백엔드 API를 통해 주문 정보를 저장하고 고유 주문번호(HT-YYYYMMDD-...)를 생성합니다.
- **데이터 삭제 전략**:
    - **논리적 삭제 (Soft Delete)**: 주문 취소 시 데이터를 즉시 DB에서 지우지 않고 `status`를 `deleted`로 변경하여 예약 히스토리를 보존하고 데이터 무결성을 유지합니다.
    - **물리적 삭제 (Hard Delete)**: 사용자가 내역 삭제를 명시적으로 요청하거나 개인정보 보호 기간이 만료된 데이터에 한해 물리적으로 삭제 처리하도록 설계되었습니다.


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
* **API 서버**: `http://localhost:4000`
- **Swagger UI 연동**: API 엔드포인트를 시각적으로 확인하고 직접 테스트 가능
- **접속 주소**: `http://localhost:4000/swagger-ui.html`
- internal 파라미터(`@SessionAttribute`) 숨김 처리로 깔끔한 명세 제공

### 2. 프론트엔드 실행 (Next.js)

## 📡 클라우드 최적화 아키텍처
- **S3 -> EC2 마이그레이션**: Next.js의 서버 사이드 렌더링(SSR) 및 동적 라우팅을 100% 활용하기 위해 S3 정적 호스팅에서 EC2 서버 호스팅으로 전환했습니다.
- **통합 역방향 프록시**: CloudFront 하나로 프론트(3000)와 백엔드(4000) 요청을 동시에 처리하여 Mixed Content 문제를 해결하고 보안을 강화했습니다.

## 🚀 시작하기

### 1. 개발 환경 실행 (Local)
* **Backend**: `cd backend && ./mvnw spring-boot:run` (4000 포트)
* **Frontend**: `cd frontend && npm run dev` (3000 포트)
* **로컬 주소**: `http://localhost:3000`

### 2. 운영 환경 배포 (Production - Amazon EC2)
본 프로젝트는 Docker를 통해 운영 환경에 배포됩니다.

```bash
# EC2 접속 후 프로젝트 폴더 이동
cd HelloTraveller_MainTask

# 기존 컨테이너 중지 및 최신 이미지 풀
sudo docker-compose pull
sudo docker-compose down
sudo docker-compose up -d
```

**운영 주소**: `https://hellotraveller.itismy.site` (CDN 주소는 생략)

## 🌐 인프라 구조 (Cloud Architecture)

사용자의 모든 요청은 **CloudFront**를 통해 안전하게(HTTPS) 전달됩니다.

1. **CloudFront (Edge Location)**
   - `/api/*`, `/order`, `/options`: 백엔드 원본(EC2:4000)으로 전달
   - `Default (*)`: 프론트엔드 원본(EC2:3000)으로 전달
2. **EC2 Instance (Docker Compose)**
   - **Frontend Container**: Next.js 서버 (SSR 지원)
   - **Backend Container**: Spring Boot API 서버
   - **Swap Memory**: 2GB 구성으로 프리티어 메모리 부족 해결
3. **Security Group**
   - 3000, 4000 포트 인바운드 허용 (CloudFront 통신용)

## 종료하기 (서버 중단)

실행 중인 프론트엔드/백엔드 서버를 종료하려면 해당 터미널에서 다음 단축키를 입력하세요.

1. **중단 단축키**: 터미널 창에서 `Ctrl + C`를 입력합니다.
2. **확인**: Windows의 경우 `일괄 작업을 끝내시겠습니까 (Y/N)?` 메시지가 나오면 `Y`를 입력하고 Enter를 누르세요.
### 3. 강제 종료 (터미널이 응답하지 않을 때)
만약 `Ctrl + C`로도 종료되지 않는다면, 새 터미널을 열고 다음 명령어를 입력하세요.

**Windows (PowerShell)**
```powershell
# 백엔드(Java/Spring Boot) 강제 종료
taskkill /F /IM java.exe

# 프론트엔드(Node.js) 강제 종료
taskkill /F /IM node.exe
```

**Mac/Linux**
```bash
# 백엔드 강제 종료
pkill -f java

# 프론트엔드 강제 종료
pkill -f node
```

### 4. 빌드 캐시 오류 (Frontend)
"Module not found" 등의 에러가 무한 반복될 경우 캐시를 삭제하세요:

**Windows (PowerShell)**
```powershell
cd frontend
rm -r -force .next
npm run dev
```

**Mac/Linux**
```bash
cd frontend
rm -rf .next
npm run dev
```



## 🧪 코드 품질 및 테스트 가이드 (Testing)

본 프로젝트는 안정적인 서비스 운영을 위해 **GitHub Actions**를 통한 CI/CD 환경이 구축되어 있습니다. 모든 PR/Push 시 자동 테스트가 수행되므로, 로컬에서 반드시 아래 검증을 마친 후 커밋해 주세요.

### 1. Frontend 검증 (Essential)
GitHub Actions의 빌드 실패를 방지하기 위해 커밋 전 반드시 실행해야 합니다.
```bash
cd frontend

# Lint 체크 (문법 및 코드 스타일 검사)
npm run lint

# Unit Test 실행 (Jest)
npm test
```

### 2. Backend 테스트
```bash
cd backend
./mvnw test
```
* **웹 클라이언트**: `http://localhost:3000`

## 🧪 테스트 가이드

### API 테스트
Swagger UI를 통해 별도의 도구 없이 브라우저에서 바로 API를 테스트할 수 있습니다.
1. `http://localhost:4000/swagger-ui.html` 접속
2. `auth-controller`에서 로그인 시도
3. `member-controller`에서 내 정보 조회 (`GET /members/me`) 등으로 세션 유지 확인

### 자동화 테스트 (Backend)

### 3. CI/CD 자동화
- **Lint & Test**: 모든 브랜치에 PUSH 발생 시 자동으로 수행됩니다.
- **Strict Mode**: 린트 에러나 테스트 실패 시 GitHub Actions 빌드가 차단되므로 로컬 검증이 필수입니다.

```
HelloTraveller/
├── backend/                   # Spring Boot API 서버
│   ├── src/                   # 백엔드 자바 소스 (Controller, Service, Model)
│   ├── Dockerfile             # 백엔드 컨테이너 빌드 설정
│   └── pom.xml                # Maven 의존성 및 빌드 설정
├── frontend/                  # Next.js 프론트엔드
│   ├── src/                   # 리액트 컴포넌트 (Pages, Components, Context)
│   ├── Dockerfile             # 프론트엔드 컨테이너 빌드 설정
│   └── package.json           # 노드 패키지 관리
├── .github/                   # GitHub Actions (CI/CD 파이프라인)
├── docker-compose.yml         # 멀티 컨테이너 통합 실행 설정
├── .gitignore                 # Git 제외 파일 목록
└── README.md                  # 프로젝트 전체 가이드
```

## ✨ 주요 기능

- 여행 상품 조회 및 상세 정보 모달 (Vapor UI 기반)
- 실시간 가격 계산 시스템 (React Context)
- 여행 날짜 및 인원 선택 옵션
- 최종 주문 확인 및 제출 기능

## 👥 팀 정보
구름 딥다이브 팀미션 HelloFullstack팀

---

© 2026 HelloTraveller. All rights reserved.
