import { Game } from '@/types/games';

interface StatsPanelProps {
  games: Game[];
}

export function StatsPanel({ games }: StatsPanelProps) {
  const total = games.length;
  const playing = games.filter(g => g.status === 'playing').length;
  const completed = games.filter(g => g.status === 'completed').length;
  const backlog = games.filter(g => g.status === 'backlog').length;

  const stats = [
    { label: '전체', value: total, icon: '📚' },
    { label: '플레이 중', value: playing, icon: '🎮' },
    { label: '완료', value: completed, icon: '✓' },
    { label: '예정', value: backlog, icon: '📋' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg p-4 text-center"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-[rgb(var(--primary))] mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-[rgb(var(--foreground-secondary))]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
