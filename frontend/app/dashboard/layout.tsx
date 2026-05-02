'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { setUser, setToken } from '../../src/store/authSlice';
import Header from '../../src/components/layout/Header';
import TrimAgentChat from '../../src/components/ai/TrimAgentChat';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token && user) {
      setIsChecking(false);
      return;
    }

    const storedToken = localStorage.getItem('trimflow_token');
    const storedUser = localStorage.getItem('trimflow_user');

    if (!storedToken || !storedUser) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setToken(storedToken));
      dispatch(setUser(parsedUser));
      setIsChecking(false);
    } catch {
      localStorage.removeItem('trimflow_token');
      localStorage.removeItem('trimflow_user');
      router.push('/auth/login');
    }
  }, [token, user, router, dispatch]);

  if (isChecking) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--trim-bg)' }}>
      <Header />
      <main style={{ padding: '24px' }}>{children}</main>
      <TrimAgentChat />
    </div>
  );
}
