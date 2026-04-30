'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [countdown, setCountdown] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Fake countdown timer for next booking (45 min demo)
  useEffect(() => {
    let totalSeconds = 45 * 60;

    const tick = () => {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setCountdown(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      if (totalSeconds > 0) totalSeconds--;
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="mono text-xl font-bold text-[#ecad0a] tracking-tight">
              TrimFlow
            </span>
            <span className="hidden sm:inline text-[10px] mono text-[#484f58] border border-[#30363d] px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </Link>

          {/* Center status bar */}
          <div className="hidden md:flex items-center gap-5 text-xs mono">
            {/* Live dot */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[#3fb950] pulse-dot inline-block"
              />
              <span className="text-[#3fb950] font-medium tracking-wider">LIVE</span>
            </div>

            {/* Countdown */}
            {mounted && user && (
              <div className="flex items-center gap-1.5 text-[#8b949e]">
                <svg className="w-3 h-3 text-[#ecad0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Keyingi bron:</span>
                <span className="text-[#ecad0a]">{countdown}</span>
              </div>
            )}

            {/* StyleCoins */}
            {mounted && user && (
              <div className="flex items-center gap-1 text-[#ecad0a] font-medium">
                <span>⬡</span>
                <span>{user.styleCoins.toLocaleString()}</span>
                <span className="text-[#8b949e] font-normal">StyleCoins</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md transition-colors"
            >
              Home
            </Link>
            {mounted && user && (
              <>
                <Link
                  href="/dashboard/barbers"
                  className="px-3 py-1.5 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md transition-colors"
                >
                  Barbers
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="px-3 py-1.5 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-2">
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#161b22] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#753991] flex items-center justify-center text-xs font-bold text-white mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm text-[#e6edf3] max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <svg className="w-3.5 h-3.5 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-[#30363d]">
                      <p className="text-xs text-[#8b949e]">{user.email}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[#ecad0a] text-xs mono">⬡ {user.styleCoins}</span>
                        <span className="text-[#484f58] text-xs">StyleCoins</span>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 text-sm text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#0d1117] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#f85149] hover:bg-[#0d1117] transition-colors"
                    >
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 text-sm bg-[#753991] hover:bg-[#8a4aaa] text-white rounded-md transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
