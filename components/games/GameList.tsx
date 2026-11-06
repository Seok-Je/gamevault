'use client';

import { useState, useMemo } from 'react';
import { Game, GameStatus } from '@/types/games';
import { GameCard } from './GameCard';
import { EmptyState } from './EmptyState';

interface GameListProps {
  games: Game[];
}

const statusOptions: GameStatus[] = ['backlog', 'playing', 'completed', 'paused'];
const statusLabels: Record<GameStatus, string> = {
  backlog: '플레이 예정',
  playing: '플레이 중',
  completed: '완료',
  paused: '일시중단',
};

export function GameList({ games }: GameListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || game.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [games, searchQuery, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="게임 제목 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--foreground-secondary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
        />

        {/* 상태 필터 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'all'
                ? 'bg-[rgb(var(--primary))] text-white'
                : 'bg-[rgb(var(--background-secondary))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background-tertiary))]'
            }`}
          >
            전체
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === status
                  ? 'bg-[rgb(var(--primary))] text-white'
                  : 'bg-[rgb(var(--background-secondary))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--background-tertiary))]'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* 게임 목록 */}
      {filteredGames.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
