import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js 16 Proxy Pattern
 * 요청을 가로채 Supabase SSR 인증을 처리합니다.
 *
 * 기능:
 * - /library 경로 접근 시 사용자 인증 확인
 * - 미인증 사용자는 /login으로 리다이렉트
 * - 인증 사용자가 /login, /signup 접근 시 /library로 리다이렉트
 * - Supabase 세션 자동 갱신
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next(
              {
                request: {
                  headers: request.headers,
                },
              }
            );
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 세션 갱신
  const { data: { user } } = await supabase.auth.getUser();

  // /library 경로 보호
  if (request.nextUrl.pathname.startsWith('/library')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 인증된 사용자가 /login, /signup 접근 시 /library로 리다이렉트
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/library', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/library/:path*', '/login', '/signup'],
};
