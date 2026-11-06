import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">🎮</div>
      <h2 className="text-2xl font-semibold text-[rgb(var(--foreground))] mb-2">
        게임이 없습니다
      </h2>
      <p className="text-[rgb(var(--foreground-secondary))] mb-6 max-w-md">
        첫 번째 게임을 추가하여 라이브러리를 시작하세요
      </p>
      <Link href="/library/new">
        <Button variant="primary">게임 추가</Button>
      </Link>
    </div>
  );
}
