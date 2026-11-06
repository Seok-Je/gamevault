# GameVault 개발 환경 & 규칙

## 프로젝트 개요
GameVault는 Next.js 15 + Supabase를 사용하는 개인 게임 라이브러리 관리 웹앱입니다.

- **저장소**: https://github.com/Seok-Je/gamevault
- **기술 스택**: Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL
- **배포**: Vercel (예상)

## 폴더 구조

```
gamevault/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 라우트 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # 대시보드 라우트 그룹
│   │   └── library/
│   ├── api/               # API 라우트
│   ├── components/        # 페이지별 컴포넌트
│   ├── layout.tsx
│   └── page.tsx
├── components/            # 공유 컴포넌트
├── lib/                   # 유틸리티 & 클라이언트
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── api/
├── types/                 # TypeScript 타입
├── public/                # 정적 자산
├── styles/                # 전역 스타일
├── docs/                  # 프로젝트 문서
│   ├── PRD.md
│   ├── ROADMAP.md
│   ├── next-js.md
│   ├── supabase.md
│   └── coding-style.md
├── supabase/
│   └── migrations/        # SQL 마이그레이션
├── .env.local             # 환경변수 (커밋 금지)
├── .env.example           # 환경변수 예시
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── CLAUDE.md             # 이 파일
```

## 환경변수 보안

**중요**: .env.local을 .gitignore에 포함하고 GitHub에 업로드하지 않습니다.

```env
# .env.local (커밋 금지)
NEXT_PUBLIC_SUPABASE_URL=https://guphcqqfirtzypikoamg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_twD2k6MAad4T4i7GSIa1ig_X2AwDEI7

# .env.example (커밋 필수, 실제 값 대신 플레이스홀더 사용)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
```

**금지**: Service Role Key, 비밀번호, API 키를 환경변수로 저장하지 않음.

## Supabase 설정

### 환경변수
```typescript
// 공개 변수만 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
```

### 클라이언트 설정
- `@supabase/ssr`을 사용하여 Next.js App Router와 SSR에 최적화
- 클라이언트: `lib/supabase/client.ts` (createBrowserClient)
- 서버: `lib/supabase/server.ts` (createServerClient)

## Git 작업 규칙

### 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
chore: 빌드, 패키지 업데이트
refactor: 코드 리팩토링
```

예시:
```
feat: implement game library CRUD
fix: fix RLS policy for games table
docs: add supabase authentication guide
```

### 브랜치 관리
- main: 안정적인 버전
- 기능 구현 시 별도 브랜치에서 작업 후 main으로 머지 (향후)

### Push 전 확인사항
- [ ] .env.local 포함 확인
- [ ] npm run build 성공
- [ ] TypeScript 오류 없음
- [ ] docs 및 CLAUDE.md 포함

## 개발 워크플로우

### 개발 환경 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속

### 빌드 및 테스트
```bash
# 프로덕션 빌드
npm run build

# 타입 검사
npx tsc --noEmit

# 린트
npm run lint
```

### Supabase 마이그레이션
SQL 파일은 `supabase/migrations/` 에 저장하고 Supabase 콘솔의 SQL Editor에서 실행합니다.

## 개발 규칙

### DO
- 모든 컴포넌트에 TypeScript 타입 적용
- RLS로 데이터 보안 확보
- 에러 처리 및 로딩 상태 표시
- 반응형 디자인 적용 (모바일 포함)
- API 라우트에서 인증 확인

### DON'T
- 환경변수에 민감한 정보 저장 (.env.local)
- 공개 키 외에 비밀 키 사용
- 클라이언트에서 직접 데이터베이스 접근 (항상 API/RLS)
- any 타입 사용
- 불필요한 라이브러리 추가
- 기존 game-vfx-supabase, notion-cms-project 수정

### 인증 & 보안
- Supabase Auth 세션 쿠키 기반
- RLS로 행 단위 접근 제어
- auth.uid() = user_id 조건 필수
- 로그인하지 않은 사용자는 /library 접근 불가

## 문서 참고

- `docs/next-js.md`: Next.js App Router 및 API 라우트
- `docs/supabase.md`: Supabase 인증 및 데이터베이스
- `docs/coding-style.md`: 코딩 스타일 가이드
- `docs/PRD.md`: 프로젝트 요구사항
- `docs/ROADMAP.md`: 개발 단계별 체크리스트

## 추가 정보

### MVP 범위
- 사용자 인증 (회원가입, 로그인, 로그아웃)
- 게임 CRUD 작업
- 게임 상태 관리 (backlog, playing, completed, paused)
- 평점 (1~5) 및 리뷰
- 검색 및 상태별 필터
- 통계 대시보드
- 다크 모드 UI (블랙, 차콜, 보라색)

### 제외됨 (향후 버전)
- 외부 게임 검색 API
- 게임 태그
- 소셜 기능
- 모바일 앱

## 도움말
프로젝트에 대한 질문이나 추가 지침이 필요하면 이 문서를 참고하세요.
