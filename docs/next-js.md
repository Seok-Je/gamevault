# Next.js 기술 문서

## Next.js App Router 개요

### 라우팅 구조
- `app/` 디렉토리 기반
- 폴더 이름이 URL 경로
- `page.tsx`가 라우트 컴포넌트
- `layout.tsx`가 레이아웃

```
app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx            # / 페이지
├── login/
│   └── page.tsx        # /login 페이지
├── signup/
│   └── page.tsx        # /signup 페이지
├── library/
│   ├── layout.tsx      # /library 레이아웃
│   ├── page.tsx        # /library 페이지
│   ├── new/
│   │   └── page.tsx    # /library/new 페이지
│   └── [id]/
│       └── page.tsx    # /library/[id] 동적 페이지
└── api/
    └── games/
        ├── route.ts    # GET, POST /api/games
        └── [id]/
            └── route.ts # GET, PUT, DELETE /api/games/[id]
```

## 서버 컴포넌트 vs 클라이언트 컴포넌트

### 서버 컴포넌트 (기본)
- 서버에서 렌더링
- 데이터베이스 직접 접근 가능
- 환경변수 접근 가능
- 번들 크기 감소
- `'use client'` 지시어 없음

### 클라이언트 컴포넌트
- 브라우저에서 렌더링
- 상태 및 이벤트 처리
- 훅(useState, useEffect 등) 사용
- 파일 상단에 `'use client'` 필수

```typescript
'use client';

import { useState } from 'react';

export default function Component() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Middleware로 인증 처리

Middleware는 요청을 가로채 인증 확인:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // 보호된 라우트
  if (request.nextUrl.pathname.startsWith('/library') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/library/:path*'],
};
```

## API 라우트

```typescript
// app/api/games/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // GET 요청 처리
  return NextResponse.json({ games: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // POST 요청 처리
  return NextResponse.json({ success: true });
}

// app/api/games/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  // GET /api/games/[id]
  return NextResponse.json({ game: { id } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({ updated: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  return NextResponse.json({ deleted: true });
}
```

## 클라이언트에서 API 호출

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => setGames(data.games));
  }, []);

  return <div>{/* 게임 목록 */}</div>;
}
```

## TypeScript 타입

```typescript
// types/games.ts
export interface Game {
  id: string;
  user_id: string;
  title: string;
  platform?: string;
  status: 'backlog' | 'playing' | 'completed' | 'paused';
  rating?: number; // 1-5
  review?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export type CreateGameInput = Omit<Game, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateGameInput = Partial<CreateGameInput>;
```

## 동적 라우트

```typescript
// app/library/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function GameDetail({ params }: Props) {
  const { id } = await params;

  // 서버 컴포넌트에서 데이터 페칭
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/games/${id}`, {
    cache: 'no-store',
  });

  return <div>{/* 게임 상세 정보 */}</div>;
}
```

## 환경변수

```typescript
// 공개 환경변수 (브라우저에서 접근 가능)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 비공개 환경변수 (서버에서만 접근 가능)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

## 빌드 및 배포

```bash
# 개발 환경
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 시작
npm start

# 린트 검사
npm run lint
```
