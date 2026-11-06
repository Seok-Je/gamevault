export interface Game {
  id: string;
  user_id: string;
  title: string;
  platform: string | null;
  status: GameStatus;
  rating: number | null;
  review: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export type GameStatus = 'backlog' | 'playing' | 'completed' | 'paused';

export type CreateGameInput = {
  title: string;
  platform?: string;
  status: GameStatus;
  rating?: number;
  review?: string;
  cover_url?: string;
};

export type UpdateGameInput = Partial<CreateGameInput>;
