import type { Metadata } from 'next';
import './globals.css';
import Providers from '../src/components/Providers';

export const metadata: Metadata = {
  title: 'TrimFlow - Barbershop Terminal',
  description: 'Real-time navbat boshqaruvi, AI chat yordamchisi va moliyaviy analitika',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
