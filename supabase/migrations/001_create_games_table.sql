-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'playing', 'completed', 'paused')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for user_id (frequent queries)
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_status ON games(user_id, status);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- RLS Policy: SELECT - Users can view only their own games
CREATE POLICY "Users can view own games"
ON games
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: INSERT - Users can create their own games
CREATE POLICY "Users can create own games"
ON games
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: UPDATE - Users can update their own games
CREATE POLICY "Users can update own games"
ON games
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: DELETE - Users can delete their own games
CREATE POLICY "Users can delete own games"
ON games
FOR DELETE
USING (auth.uid() = user_id);
