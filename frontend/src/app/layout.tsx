import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import TrimAgentChat from '@/components/ai/TrimAgentChat';

export const metadata: Metadata = {
  title: 'TrimFlow — Sartaroshlik Terminali',
  description: 'TrimFlow: Real-time navbat, AI yordamchi va professional sartaroshlik xizmatlari.',
  keywords: ['barbershop', 'sartarosh', 'bron qilish', 'TrimFlow'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0d1117] text-[#e6edf3] antialiased">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <TrimAgentChat />
        <footer className="border-t border-[#30363d] py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs mono text-[#484f58]">
            <span>TrimFlow © 2026 — Sartaroshlik terminali</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] inline-block" />
              <span className="text-[#3fb950]">Tizim ishlayapti</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
