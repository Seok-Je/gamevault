'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다');
        } else {
          setError(signInError.message);
        }
        return;
      }

      router.push('/library');
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">GameVault</h1>
          <p className="mt-2 text-[rgb(var(--foreground-secondary))]">
            게임 라이브러리에 로그인하세요
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

          <Button variant="primary" size="lg" className="w-full" type="submit" isLoading={isLoading}>
            로그인
          </Button>
        </form>

        <p className="text-center text-[rgb(var(--foreground-secondary))]">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-hover))]">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
