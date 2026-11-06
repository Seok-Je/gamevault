import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateGameInput } from '@/types/games';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: game, error } = await client
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '게임을 찾을 수 없습니다' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('GET /api/games/[id]:', error);
    return NextResponse.json(
      { error: '게임 조회 실패' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateGameInput = await request.json();

    const { data: game, error } = await client
      .from('games')
      .update({
        ...(body.title && { title: body.title }),
        ...(body.platform !== undefined && { platform: body.platform }),
        ...(body.status && { status: body.status }),
        ...(body.rating !== undefined && { rating: body.rating }),
        ...(body.review !== undefined && { review: body.review }),
        ...(body.cover_url !== undefined && { cover_url: body.cover_url }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '게임을 찾을 수 없습니다' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('PUT /api/games/[id]:', error);
    return NextResponse.json(
      { error: '게임 수정 실패' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error } = await client
      .from('games')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/games/[id]:', error);
    return NextResponse.json(
      { error: '게임 삭제 실패' },
      { status: 500 }
    );
  }
}
