import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
      <LoadingSpinner />
      <p className="text-[rgb(var(--foreground-secondary))]">게임 라이브러리를 로딩 중...</p>
    </div>
  );
}
