# Supabase 기술 문서

## Supabase 소개

Supabase는 Firebase의 오픈소스 대안으로, PostgreSQL 데이터베이스, 인증, 실시간 기능을 제공합니다.

### 핵심 기능
- **PostgreSQL 데이터베이스**: 완전한 SQL 쿼리 지원
- **인증**: 이메일, OAuth, MFA 지원
- **Row Level Security (RLS)**: 행 단위 접근 제어
- **실시간 Subscriptions**: 데이터 변경 감시
- **Storage**: 파일 업로드 (MVP에서 미사용)

## @supabase/ssr 설정

@supabase/ssr은 Next.js App Router와 SSR을 위한 최적화된 라이브러리입니다.

```typescript
// lib/supabase/client.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키 설정 불가 (무시)
          }
        },
      },
    }
  );
}
```

## Supabase Auth

### 회원가입

```typescript
'use client';

import { supabase } from '@/lib/supabase/client';

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### 로그인

```typescript
'use client';

import { supabase } from '@/lib/supabase/client';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### 로그아웃

```typescript
'use client';

import { supabase } from '@/lib/supabase/client';

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### 현재 사용자 확인

```typescript
// 클라이언트에서
const { data: { user } } = await supabase.auth.getUser();

// 서버에서
const client = await createClient();
const { data: { user } } = await client.auth.getUser();
```

## 데이터베이스 쿼리

### 조회

```typescript
const { data, error } = await supabase
  .from('games')
  .select()
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### 생성

```typescript
const { data, error } = await supabase
  .from('games')
  .insert({
    user_id: userId,
    title: 'Game Title',
    platform: 'PC',
    status: 'backlog',
  })
  .select();
```

### 수정

```typescript
const { data, error } = await supabase
  .from('games')
  .update({
    title: 'New Title',
    status: 'playing',
    rating: 4,
  })
  .eq('id', gameId)
  .eq('user_id', userId)
  .select();
```

### 삭제

```typescript
const { error } = await supabase
  .from('games')
  .delete()
  .eq('id', gameId)
  .eq('user_id', userId);
```

## Row Level Security (RLS)

RLS는 데이터베이스 행 단위로 접근 제어하는 보안 기능입니다.

### games 테이블 RLS 정책

**정책 1: SELECT**
```sql
CREATE POLICY "Users can view own games"
ON games
FOR SELECT
USING (auth.uid() = user_id);
```

**정책 2: INSERT**
```sql
CREATE POLICY "Users can create own games"
ON games
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**정책 3: UPDATE**
```sql
CREATE POLICY "Users can update own games"
ON games
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**정책 4: DELETE**
```sql
CREATE POLICY "Users can delete own games"
ON games
FOR DELETE
USING (auth.uid() = user_id);
```

## 타입 생성

Supabase CLI로 타입을 자동 생성할 수 있습니다:

```bash
npx supabase gen types typescript --project-id guphcqqfirtzypikoamg > types/supabase.ts
```

## 오류 처리

```typescript
const { data, error } = await supabase
  .from('games')
  .select();

if (error) {
  console.error('Database error:', error.message);
  // 사용자에게 오류 메시지 표시
}
```

## 실시간 구독 (선택사항)

데이터 변경을 실시간으로 감시:

```typescript
const subscription = supabase
  .channel('games')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'games' },
    (payload) => console.log('변경:', payload)
  )
  .subscribe();

// 구독 해제
subscription.unsubscribe();
```
