import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateGameInput } from '@/types/games';

export async function GET(request: NextRequest) {
  try {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: games, error } = await client
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ games: games || [] });
  } catch (error) {
    console.error('GET /api/games:', error);
    return NextResponse.json(
      { error: '게임 목록 조회 실패' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateGameInput = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: '게임 제목은 필수입니다' },
        { status: 400 }
      );
    }

    const { data: game, error } = await client
      .from('games')
      .insert({
        user_id: user.id,
        title: body.title,
        platform: body.platform || null,
        status: body.status || 'backlog',
        rating: body.rating || null,
        review: body.review || null,
        cover_url: body.cover_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error('POST /api/games:', error);
    return NextResponse.json(
      { error: '게임 등록 실패' },
      { status: 500 }
    );
  }
}
