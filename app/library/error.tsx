'use client';

import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">
        오류가 발생했습니다
      </h1>
      <p className="text-[rgb(var(--foreground-secondary))] text-center max-w-md">
        {error.message || '게임 라이브러리를 불러오는 중에 문제가 발생했습니다.'}
      </p>
      <Button onClick={reset} variant="primary">
        다시 시도
      </Button>
    </div>
  );
}
