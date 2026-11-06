import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GameVault',
  description: '개인 게임 라이브러리 관리 앱',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
        {children}
      </body>
    </html>
  );
}
