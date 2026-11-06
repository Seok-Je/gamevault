import Link from 'next/link';
import { Game, GameStatus } from '@/types/games';

interface GameCardProps {
  game: Game;
}

const statusLabels: Record<GameStatus, string> = {
  backlog: '플레이 예정',
  playing: '플레이 중',
  completed: '완료',
  paused: '일시중단',
};

const statusColors: Record<GameStatus, string> = {
  backlog: 'bg-blue-600',
  playing: 'bg-[rgb(var(--warning))]',
  completed: 'bg-[rgb(var(--success))]',
  paused: 'bg-gray-600',
};

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/library/${game.id}`}>
      <div className="group cursor-pointer rounded-lg overflow-hidden bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] transition-all hover:shadow-lg hover:shadow-[rgb(var(--primary))]/20">
        {/* 커버 이미지 */}
        <div className="relative h-64 bg-[rgb(var(--background-tertiary))] overflow-hidden">
          {game.cover_url ? (
            <img
              src={game.cover_url}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[rgb(var(--foreground-secondary))]">
              이미지 없음
            </div>
          )}

          {/* 상태 뱃지 */}
          <div className={`absolute top-2 right-2 ${statusColors[game.status]} text-white text-xs font-semibold px-2 py-1 rounded`}>
            {statusLabels[game.status]}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-[rgb(var(--foreground))] line-clamp-2">
            {game.title}
          </h3>

          {game.platform && (
            <p className="text-sm text-[rgb(var(--foreground-secondary))]">
              플랫폼: {game.platform}
            </p>
          )}

          {game.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-[rgb(var(--foreground))]">
                {game.rating}/5
              </span>
            </div>
          )}

          {game.review && (
            <p className="text-sm text-[rgb(var(--foreground-secondary))] line-clamp-2">
              {game.review}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
