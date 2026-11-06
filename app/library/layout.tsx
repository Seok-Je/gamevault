import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';

export const instant = false;

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-[rgb(var(--background))]">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
