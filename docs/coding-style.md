# GameVault 코딩 스타일 가이드

## TypeScript

### 타입 정의
항상 명시적 타입을 정의합니다:

```typescript
// Good
interface Game {
  id: string;
  title: string;
  status: GameStatus;
}

type GameStatus = 'backlog' | 'playing' | 'completed' | 'paused';

// Bad
const game: any = { id: '123' };
```

### 함수 시그니처
입출력 타입을 명시합니다:

```typescript
// Good
function getGameById(id: string): Promise<Game | null> {
  // ...
}

// Bad
function getGameById(id) {
  // ...
}
```

## React & Next.js

### 컴포넌트 구조

```typescript
// 클라이언트 컴포넌트
'use client';

import { useState } from 'react';

interface GameCardProps {
  game: Game;
  onDelete: (id: string) => Promise<void>;
}

export default function GameCard({ game, onDelete }: GameCardProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(game.id);
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="...">
      {/* 컴포넌트 JSX */}
    </div>
  );
}
```

### 서버 컴포넌트 with 데이터 페칭

```typescript
// app/library/page.tsx (서버 컴포넌트)
import { createClient } from '@/lib/supabase/server';

export default async function LibraryPage() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: games } = await client
    .from('games')
    .select()
    .eq('user_id', user.id);

  return (
    <div>
      {/* 페이지 JSX */}
    </div>
  );
}
```

## 파일 구조

```
lib/
├── supabase/
│   ├── client.ts          # 클라이언트 Supabase 인스턴스
│   └── server.ts          # 서버 Supabase 인스턴스
├── api/                   # API 호출 유틸리티
│   └── games.ts
└── utils/                 # 유틸리티 함수

types/
└── games.ts               # 타입 정의

app/
├── (auth)/                # 인증 관련 라우트
│   ├── login/
│   └── signup/
├── (dashboard)/           # 대시보드 라우트
│   └── library/
├── api/                   # API 라우트
├── components/            # 공유 컴포넌트
├── layout.tsx
└── page.tsx

components/
├── ui/                    # UI 컴포넌트
├── auth/                  # 인증 컴포넌트
└── games/                 # 게임 관련 컴포넌트
```

## 네이밍 컨벤션

### 파일 및 폴더
- kebab-case: `game-card.tsx`, `auth-layout.tsx`
- 폴더: 소문자 `app/library/new`

### 함수 및 변수
- camelCase: `getGameById`, `handleDelete`
- 상수: UPPER_SNAKE_CASE: `MAX_RATING = 5`

### 컴포넌트
- PascalCase: `GameCard`, `LibraryPage`

### 타입
- PascalCase: `Game`, `GameStatus`

## Tailwind CSS

### 클래스 순서
1. 레이아웃: `flex`, `grid`, `absolute`
2. 박스 모델: `w-full`, `p-4`, `m-2`
3. 텍스트: `text-lg`, `font-bold`, `text-white`
4. 배경: `bg-gray-900`, `bg-purple-600`
5. 테두리: `border`, `rounded-lg`
6. 효과: `shadow`, `opacity`
7. 상태: `hover:`, `focus:`, `disabled:`

```typescript
// Good
<div className="flex items-center justify-between w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
  {/* content */}
</div>

// Bad
<div className="bg-gray-800 flex p-4 w-full rounded-lg items-center justify-between">
  {/* content */}
</div>
```

### 다크 모드
```typescript
// Tailwind는 기본적으로 다크 모드를 지원하므로, dark: 클래스 사용 불가
// 대신 색상을 직접 지정
<div className="bg-gray-900 text-white">
  {/* 항상 다크 모드 */}
</div>
```

## 주석 및 문서화

주석은 '왜'를 설명합니다:

```typescript
// Good
// 게임 상태 변경 후 UI 즉시 갱신 (낙관적 업데이트)
setGames(games.map(g => g.id === gameId ? { ...g, status } : g));

// Bad
// 게임 상태를 업데이트
games = games.map(g => ...);
```

## 오류 처리

```typescript
// 클라이언트
try {
  await deleteGame(gameId);
  setGames(games.filter(g => g.id !== gameId));
} catch (error) {
  const message = error instanceof Error ? error.message : '작업 실패';
  setError(message);
}

// API 라우트
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await client
      .from('games')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/games/[id]:', error);
    return NextResponse.json(
      { error: '게임 삭제 실패' },
      { status: 500 }
    );
  }
}
```

## 성능 최적화

1. **이미지**: next/image 사용 (MVP에서는 외부 URL)
2. **번들**: 불필요한 라이브러리 최소화
3. **데이터**: 필요한 필드만 select
4. **캐싱**: 자주 변경되지 않는 데이터만 캐시

```typescript
// Good
const { data } = await supabase
  .from('games')
  .select('id, title, cover_url, status, rating')
  .eq('user_id', userId);

// Bad
const { data } = await supabase
  .from('games')
  .select('*')
  .eq('user_id', userId);
```
