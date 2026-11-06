'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[rgb(var(--background-secondary))] border-r border-[rgb(var(--border))] flex flex-col h-full">
      <div className="p-6 border-b border-[rgb(var(--border))]">
        <Link href="/library" className="text-2xl font-bold text-[rgb(var(--primary))]">
          GameVault
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <Link href="/library">
          <div className="px-4 py-2 rounded-lg hover:bg-[rgb(var(--background-tertiary))] transition-colors text-[rgb(var(--foreground))]">
            라이브러리
          </div>
        </Link>
        <Link href="/library/new">
          <div className="px-4 py-2 rounded-lg hover:bg-[rgb(var(--background-tertiary))] transition-colors text-[rgb(var(--foreground))]">
            게임 추가
          </div>
        </Link>
      </nav>

      <div className="p-6 border-t border-[rgb(var(--border))] space-y-3">
        {userEmail && (
          <div className="text-xs text-[rgb(var(--foreground-secondary))] truncate">
            {userEmail}
          </div>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
