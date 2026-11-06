'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateGameInput, GameStatus } from '@/types/games';

const statusOptions: GameStatus[] = ['backlog', 'playing', 'completed', 'paused'];
const statusLabels: Record<GameStatus, string> = {
  backlog: '플레이 예정',
  playing: '플레이 중',
  completed: '완료',
  paused: '일시중단',
};

export default function NewGamePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateGameInput>({
    title: '',
    status: 'backlog',
    platform: '',
    rating: undefined,
    review: '',
    cover_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('게임 제목은 필수입니다');
      return;
    }

    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      setError('평점은 1~5 사이여야 합니다');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '게임 등록 실패');
      }

      router.push('/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : '게임 등록 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-8">
          게임 추가
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="게임 제목 *"
            name="title"
            placeholder="예: The Legend of Zelda"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Input
            label="플랫폼"
            name="platform"
            placeholder="예: PC, Nintendo Switch, PS5"
            value={formData.platform || ''}
            onChange={handleChange}
            disabled={isLoading}
          />

          <div>
            <label className="text-sm font-medium text-[rgb(var(--foreground))] mb-2 block">
              상태
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--background-tertiary))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="평점 (1~5)"
            name="rating"
            type="number"
            min="1"
            max="5"
            placeholder="3"
            value={formData.rating || ''}
            onChange={handleChange}
            disabled={isLoading}
          />

          <div>
            <label className="text-sm font-medium text-[rgb(var(--foreground))] mb-2 block">
              리뷰
            </label>
            <textarea
              name="review"
              placeholder="개인 리뷰를 작성하세요..."
              value={formData.review || ''}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--background-tertiary))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--foreground-secondary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] resize-none"
            />
          </div>

          <Input
            label="커버 이미지 URL"
            name="cover_url"
            placeholder="https://example.com/image.jpg"
            value={formData.cover_url || ''}
            onChange={handleChange}
            disabled={isLoading}
          />

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="flex-1"
            >
              게임 등록
            </Button>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
