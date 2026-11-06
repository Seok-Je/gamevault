import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StatsPanel } from '@/components/games/StatsPanel';
import { GameList } from '@/components/games/GameList';

export const instant = false;

export default async function LibraryPage() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: games, error } = await client
    .from('games')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch games:', error);
  }

  const gameList = games || [];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            내 게임 라이브러리
          </h1>
        </div>

        <StatsPanel games={gameList} />

        <GameList games={gameList} />
      </div>
    </div>
  );
}
