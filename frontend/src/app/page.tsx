'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const stats = [
  { value: '127', label: 'Aktiv Sartarosh' },
  { value: '3,429', label: 'Muvaffaqiyatli Bron' },
  { value: '⬡ 15,000', label: 'StyleCoins Tarqatildi' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-time Navbat',
    description: 'Jonli monitoring texnologiyasi bilan sartaroshxonadagi navbatni real vaqtda kuzating. Band slotlar, bo\'sh o\'rinlar — barchasi bir ekranda.',
    accent: '#209dd7',
    tag: 'LIVE',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.659 1.591L19.5 14.5M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-1.409 1.409a2.25 2.25 0 01-1.591.659H7.5a2.25 2.25 0 01-1.591-.659L4.5 14.5m15 0l.75 1.5M4.5 14.5l-.75 1.5" />
      </svg>
    ),
    title: 'TrimAgent AI',
    description: 'Sun\'iy intellekt yordamchingiz bron qilishda, uslub tanlashda va eng mos sartaroshni topishda yordam beradi. 24/7 mavjud.',
    accent: '#753991',
    tag: 'AI',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'P&L Analitika',
    description: 'Sartaroshlar uchun to\'liq moliyaviy hisobot: kunlik, haftalik, oylik daromad. Eng ko\'p talab qilinadigan xizmatlar va mijozlar tahlili.',
    accent: '#ecad0a',
    tag: 'PRO',
  },
];

export default function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#e6edf3 1px, transparent 1px), linear-gradient(90deg, #e6edf3 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#753991]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#209dd7]/10 blur-3xl pointer-events-none" />

        <div
          className={`relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Status chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-[#30363d] bg-[#161b22] text-xs mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] pulse-dot inline-block" />
            <span className="text-[#3fb950]">Tizim jonli</span>
            <span className="text-[#484f58]">—</span>
            <span className="text-[#8b949e]">127 sartarosh onlayn</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            O'z uslubingizni{' '}
            <br className="hidden sm:block" />
            kuting emas,{' '}
            <span className="text-[#ecad0a] relative">
              bron qiling
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ecad0a]/40 rounded" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8b949e] max-w-2xl mb-10 leading-relaxed">
            TrimFlow — Sartaroshlik terminali.{' '}
            <span className="text-[#e6edf3]">Real-time navbat</span>,{' '}
            <span className="text-[#e6edf3]">AI yordamchi</span> va professional xizmat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-14">
            <Link href="/dashboard/barbers">
              <Button variant="primary" size="lg" className="gap-2 min-w-[180px]">
                Bron Qilish
                <span>→</span>
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                Hisob yaratish
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="w-full max-w-2xl border border-[#30363d] rounded-lg bg-[#161b22] px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#30363d]">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5 sm:px-6 py-1 sm:py-0">
                  <span className="mono text-[#ecad0a] text-xl font-bold">{stat.value}</span>
                  <span className="text-[#8b949e] text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 border-t border-[#30363d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="mono text-xs text-[#484f58] tracking-widest mb-2">IMKONIYATLAR</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e6edf3]">
              Terminal darajasida nazorat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                hoverable
                className={`transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${idx * 100 + 200}ms` } as React.CSSProperties}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.accent}15`, color: feature.accent }}
                >
                  {feature.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-[#e6edf3]">{feature.title}</h3>
                  <span
                    className="text-[10px] mono px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${feature.accent}20`, color: feature.accent }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <p className="text-sm text-[#8b949e] leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
