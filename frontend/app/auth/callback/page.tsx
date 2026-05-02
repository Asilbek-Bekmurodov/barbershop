'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../../src/store/authSlice';
import api from '../../../src/lib/api';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUser = async () => {
      try {
        localStorage.setItem('trimflow_token', token);
        dispatch(setToken(token));

        const response = await api.get('/users/me');
        const user = response.data.data;

        localStorage.setItem('trimflow_user', JSON.stringify(user));
        dispatch(setUser(user));

        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (user.role === 'barber') {
          router.push('/dashboard/barber');
        } else {
          router.push('/dashboard/barbers');
        }
      } catch {
        localStorage.removeItem('trimflow_token');
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [searchParams, router, dispatch]);

  return <LoadingSpinner fullPage />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
