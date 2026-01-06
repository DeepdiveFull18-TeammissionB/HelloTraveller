# HelloTraveller 🌍

> 구름 딥다이브 팀미션 - 풀스택 웹 개발 실습 프로젝트

## 📌 프로젝트 개요

구름 딥다이브 과정의 팀 미션으로 진행한 순차적 개발 프로젝트입니다.  
여행 상품 판매부터 회원 관리, 쇼핑몰까지 단계별로 기능을 확장하며 풀스택 개발 역량을 키웁니다.

## 🎯 실습 프로젝트

- **[실습 4]** 여행 상품 판매 서비스
- **[실습 7]** 회원 관리 서비스
- **[실습 8]** 쇼핑몰 서비스

## 🛠 기술 스택

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Vapor UI (goorm Design System)
- Turbopack (Build System)

### Backend
- Node.js
- Express.js (Port: 4000)

## 🚀 시작하기

### 백엔드 실행
```bash
cd backend
npm install
npm start
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

서버 실행 후 `http://localhost:3000` 접속

## 🔧 문제 해결 (Troubleshooting)

개발 환경 실행 중 터미널에 에러가 반복되거나 포트 충돌이 발생할 경우 다음을 수행하세요:

### 1. 포트 및 프로세스 점유 문제
이미 Node 프로세스가 실행 중이라 포트(3000, 4000)가 사용 중일 때:
```powershell
# 모든 Node 프로세스 강제 종료
taskkill /f /im node.exe
```

### 2. 빌드 캐시 오류
"Module not found" 등의 에러가 무한 반복될 경우 캐시를 삭제하세요:
```powershell
# 프론트엔드 폴더에서 실행
rm -r -force .next
npm run dev
```

## 📂 프로젝트 구조

```
HelloTraveller/
├── backend/                   # Express 서버
├── frontend/                  # Next.js 16 앱
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
