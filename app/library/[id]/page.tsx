'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Game, GameStatus } from '@/types/games';

const statusOptions: GameStatus[] = ['backlog', 'playing', 'completed', 'paused'];
const statusLabels: Record<GameStatus, string> = {
  backlog: '플레이 예정',
  playing: '플레이 중',
  completed: '완료',
  paused: '일시중단',
};

export default function GameDetailPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    status: 'backlog' as GameStatus,
    rating: '',
    review: '',
    cover_url: '',
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) throw new Error('게임을 찾을 수 없습니다');

        const data = await response.json();
        setGame(data.game);
        setFormData({
          title: data.game.title,
          platform: data.game.platform || '',
          status: data.game.status,
          rating: data.game.rating?.toString() || '',
          review: data.game.review || '',
          cover_url: data.game.cover_url || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '게임 조회 실패');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('게임 제목은 필수입니다');
      return;
    }

    const rating = formData.rating ? parseInt(formData.rating) : null;
    if (rating && (rating < 1 || rating > 5)) {
      setError('평점은 1~5 사이여야 합니다');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          platform: formData.platform || undefined,
          status: formData.status,
          rating: rating,
          review: formData.review || undefined,
          cover_url: formData.cover_url || undefined,
        }),
      });

      if (!response.ok) throw new Error('게임 수정 실패');

      const data = await response.json();
      setGame(data.game);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게임 수정 중 오류 발생');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('게임 삭제 실패');

      router.push('/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : '게임 삭제 중 오류 발생');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[rgb(var(--foreground-secondary))] mb-4">
            게임을 찾을 수 없습니다
          </p>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            {formData.title}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            돌아가기
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 커버 이미지 */}
          {formData.cover_url && (
            <div className="md:col-span-1">
              <img
                src={formData.cover_url}
                alt={formData.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSave} className={formData.cover_url ? 'md:col-span-2' : 'md:col-span-3'}>
            <div className="space-y-6">
              <Input
                label="게임 제목"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isSaving || isDeleting}
              />

              <Input
                label="플랫폼"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                disabled={isSaving || isDeleting}
              />

              <div>
                <label className="text-sm font-medium text-[rgb(var(--foreground))] mb-2 block">
                  상태
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSaving || isDeleting}
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
                value={formData.rating}
                onChange={handleChange}
                disabled={isSaving || isDeleting}
              />

              <div>
                <label className="text-sm font-medium text-[rgb(var(--foreground))] mb-2 block">
                  리뷰
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  disabled={isSaving || isDeleting}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-[rgb(var(--background-tertiary))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] resize-none"
                />
              </div>

              <Input
                label="커버 이미지 URL"
                name="cover_url"
                value={formData.cover_url}
                onChange={handleChange}
                disabled={isSaving || isDeleting}
              />

              {error && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isSaving}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  저장
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSaving || isDeleting}
                >
                  삭제
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">
                게임을 삭제하시겠습니까?
              </h2>
              <p className="text-[rgb(var(--foreground-secondary))] mb-6">
                이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  className="flex-1"
                >
                  삭제
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
