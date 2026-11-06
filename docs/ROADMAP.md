# GameVault - 개발 로드맵

## Phase 1: 프로젝트 초기 설정 및 사용자 인증 ✓ 완료

### 목표
Next.js + Supabase 환경 구성 및 사용자 인증 시스템 완성

### 체크리스트
- [x] Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind)
- [x] Supabase 패키지 설치 및 환경변수 설정
- [x] Supabase 클라이언트 설정 (@supabase/ssr 사용)
- [x] auth 테이블 생성 (Supabase 기본)
- [x] 회원가입 페이지 구현
  - 이메일, 비밀번호 입력 폼
  - 유효성 검사
  - Supabase Auth 연동
- [x] 로그인 페이지 구현
  - 이메일, 비밀번호 입력 폼
  - 세션 유지
  - 리다이렉트 로직
- [x] 로그아웃 기능
- [x] 프로텍트된 라우트 미들웨어
- [x] 기본 레이아웃 (헤더, 사이드바)

### 완료 기준
- [x] npm run build 성공
- 회원가입 및 로그인 작동 확인 필요
- 인증되지 않은 사용자는 /library 접근 불가 (미들웨어 적용됨)
- Supabase 콘솔에서 사용자 생성 확인 필요

---

## Phase 2: 게임 라이브러리 CRUD 구현 ✓ 완료

### 목표
games 테이블 설계 및 CRUD 기능 완성

### 체크리스트
- [x] Supabase games 테이블 생성
  - id, user_id, title, platform, status, rating, review, cover_url, created_at, updated_at
- [x] RLS 정책 설정
  - SELECT: user_id = auth.uid()
  - INSERT: user_id = auth.uid()
  - UPDATE: user_id = auth.uid()
  - DELETE: user_id = auth.uid()
- [x] Supabase 클라이언트 설정 (lib/supabase/client.ts, lib/supabase/server.ts)
- [x] games API 라우트
  - GET /api/games (목록)
  - POST /api/games (생성)
  - GET /api/games/[id] (상세)
  - PUT /api/games/[id] (수정)
  - DELETE /api/games/[id] (삭제)
- [x] 게임 라이브러리 페이지 (/library)
  - 게임 목록 표시 (카드 레이아웃)
  - 통계 대시보드 (상단)
- [x] 게임 등록 페이지 (/library/new)
  - 폼 입력 (제목, 플랫폼, 상태, 커버 URL, 평점, 리뷰)
  - 폼 유효성 검사
- [x] 게임 상세 페이지 (/library/[id])
  - 정보 표시
  - 수정 폼
  - 삭제 버튼 (확인 모달)
- [x] 게임 상태 변경 기능
- [x] 평점 입력 (1~5)
- [x] 리뷰 입력

### 완료 기준
- [x] npm run build 성공
- 게임 등록, 조회, 수정, 삭제 작동 확인 필요
- 각 사용자는 자신의 게임만 조회 가능 (RLS + 서버 검증 적용됨)
- 데이터 검증 성공 필요

---

## Phase 3: UI/UX 개선 및 검색/필터 기능 ✓ 완료

### 목표
완전한 검색, 필터링, 통계 기능 및 UI 완성도 향상

### 체크리스트
- [x] 검색 기능
  - 게임 제목 검색 (실시간 클라이언트 필터링)
- [x] 필터 기능
  - 상태별 필터 (backlog, playing, completed, paused)
  - 전체 필터 탭 추가
- [x] 통계 대시보드
  - 전체 게임 수
  - 플레이 중인 게임 수
  - 완료한 게임 수
  - 플레이 예정 게임 수
- [x] UI 세밀 조정
  - 다크 모드 색상 (블랙, 차콜, 보라색)
  - 게임 카드 디자인 (커버 이미지, 상태 뱃지, 평점)
  - 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
  - 로딩 상태 UI (Suspense boundary)
  - 빈 목록 상태 UI
  - 오류 상태 UI (error.tsx)
- [x] 모달 및 폼 스타일링 (삭제 확인 모달)
- [x] 사이드바 및 네비게이션
- [x] 반응형 그리드 레이아웃

### 완료 기준
- [x] npm run build 성공
- 검색 및 필터 작동 확인 필요
- 통계 정확성 검증 필요
- 반응형 UI 테스트 필요 (모바일 환경)
- 모든 상태(로딩, 빈 목록, 오류) 표시 확인 필요

---

## Phase 4: 최종 테스트 및 배포

### 체크리스트
- [ ] TypeScript 타입 검사 (npx tsc --noEmit)
- [ ] ESLint 검사
- [ ] 회원가입 및 로그인 엔드-투-엔드 테스트
- [ ] CRUD 작업 검증 (브라우저)
- [ ] RLS 보안 테스트 (다른 사용자 계정으로 데이터 접근 불가 확인)
- [ ] 검색 및 필터 정확성 테스트
- [ ] UI/UX 최종 검증
- [ ] 환경변수 보안 검증 (.env.local 제외)
- [ ] GitHub 저장소 업로드
  - .env.local 제외 확인
  - docs 및 CLAUDE.md 포함 확인
  - SQL 마이그레이션 파일 포함 확인
  - 커밋 및 Push

### 완료 기준
- npm run build 성공
- 모든 테스트 통과
- GitHub 저장소에 코드 푸시 완료

---

## 타임라인
- [x] Phase 1: 프로젝트 초기 설정
- [x] Phase 2: 핵심 기능 (CRUD, 인증)
- [x] Phase 3: UI/UX 및 부가 기능
- [ ] Phase 4: 테스트 및 배포
