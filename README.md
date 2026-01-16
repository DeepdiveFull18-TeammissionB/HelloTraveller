# HelloTraveller 🌍

> 구름 딥다이브 팀미션 - 풀스택 웹 개발 실습 프로젝트(여행 상품 플랫폼)

## 📌 프로젝트 개요

구름 딥다이브 과정의 팀 미션으로 진행한 순차적 개발 프로젝트입니다.  
여행 상품 판매부터 회원 관리, 쇼핑몰까지 단계별로 기능을 확장하며 풀스택 개발 역량을 키웁니다.

## 🎯 실습 프로젝트

- **[실습 4]** 여행 상품 판매 서비스
- **[실습 7]** 회원 관리 서비스
- **[실습 8]** 쇼핑몰 서비스

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
- **External API**: Amadeus Travel API

## ✨ 주요 기능

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

## 🚀 시작하기

### 1. Backend 실행 (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
* 서버는 `http://localhost:8080` 포트에서 실행됩니다. (Amadeus API 키 설정 필요)

### 2. Frontend 실행 (Next.js)
```bash
cd frontend
npm install
npm run dev
```
* 브라우저에서 `http://localhost:3000`으로 접속하세요.

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

## 📂 프로젝트 구조

```
HelloTraveller/
├── backend/                   # Spring Boot 서버 (API, Caching)
│   ├── src/main/java/         # Java 소스 코드 (Controller, Service)
│   └── pom.xml                # Maven 의존성 관리
├── frontend/                  # Next.js 클라이언트
│   ├── src/app/               # 페이지 라우팅 (App Router)
│   ├── src/components/        # 재사용 컴포넌트 (Vapor UI)
│   └── src/services/          # API 통신 및 비즈니스 로직
└── Documentation/             # 프로젝트 문서 및 디버깅 로그
├── .gitignore                 # Git 무시 파일
└── README.md                  # 프로젝트 설명
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
