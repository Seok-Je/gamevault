'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요');
      return false;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6글자 이상이어야 합니다');
      return false;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          setError('이미 등록된 이메일입니다');
        } else {
          setError(signupError.message);
        }
        return;
      }

      if (data?.user) {
        setSuccessMessage(
          '회원가입이 완료되었습니다! 확인 이메일을 확인해주세요. 로그인 페이지로 이동합니다.'
        );
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다');
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
            새 계정을 만들어 시작하세요
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="최소 6글자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}
          {successMessage && (
            <div className="text-sm text-[rgb(var(--success))] bg-[rgb(var(--success))]/10 p-3 rounded">
              {successMessage}
            </div>
          )}

          <Button variant="primary" size="lg" className="w-full" type="submit" isLoading={isLoading}>
            회원가입
          </Button>
        </form>

        <p className="text-center text-[rgb(var(--foreground-secondary))]">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary-hover))]">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
