import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[rgb(var(--foreground))]">
            GameVault
          </h1>
          <p className="text-xl text-[rgb(var(--foreground-secondary))]">
            당신의 게임 라이브러리를 한곳에서 관리하세요
          </p>
        </div>

        <div className="space-y-3 text-left bg-[rgb(var(--background-secondary))] rounded-lg p-6">
          <h2 className="font-semibold text-[rgb(var(--foreground))] mb-3">기능</h2>
          <ul className="space-y-2 text-[rgb(var(--foreground-secondary))] text-sm">
            <li>✓ 게임 수집 및 정리</li>
            <li>✓ 플레이 상태 추적 (예정, 진행 중, 완료, 일시중단)</li>
            <li>✓ 개인 평점 및 리뷰</li>
            <li>✓ 빠른 검색 및 필터링</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button variant="primary" size="lg" className="w-full">
              로그인
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="w-full">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
