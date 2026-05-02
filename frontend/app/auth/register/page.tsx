'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading } from '../../../src/store/authSlice';
import api from '../../../src/lib/api';
import styles from '../auth.module.css';

type RoleType = 'client' | 'barber';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType>('client');
  const [error, setError] = useState('');
  const [loading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLocalLoading(true);
    dispatch(setLoading(true));

    try {
      // 1. Register as client first
      const regResponse = await api.post('/auth/register', { name, email, password });
      const { user, token } = regResponse.data.data;

      // Save token so next request has auth header
      localStorage.setItem('trimflow_token', token);
      dispatch(setToken(token));

      let finalUser = user;

      // 2. If barber selected, create barber profile (role updated server-side)
      if (role === 'barber') {
        const barberResponse = await api.post('/barbers', { bio: '' });
        if (barberResponse.data.user) {
          finalUser = barberResponse.data.user;
        } else {
          finalUser = { ...user, role: 'barber' };
        }
      }

      localStorage.setItem('trimflow_user', JSON.stringify(finalUser));
      dispatch(setUser(finalUser));

      if (finalUser.role === 'barber') {
        router.push('/dashboard/barber');
      } else {
        router.push('/dashboard/barbers');
      }
    } catch (err: unknown) {
      localStorage.removeItem('trimflow_token');
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>
            TrimFlow
          </Link>
        </div>
        <h1 className={styles.title}>Ro&apos;yxatdan o&apos;tish</h1>
        <p className={styles.subtitle}>Yangi hisob yarating</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Rol tanlang</label>
            <div className={styles.rolePicker}>
              <button
                type="button"
                className={[styles.roleCard, role === 'client' ? styles.roleCardActive : ''].join(' ')}
                onClick={() => setRole('client')}
              >
                <span className={styles.roleCardIcon}>[ U ]</span>
                Mijoz
              </button>
              <button
                type="button"
                className={[styles.roleCard, role === 'barber' ? styles.roleCardActive : ''].join(' ')}
                onClick={() => setRole('barber')}
              >
                <span className={styles.roleCardIcon}>[ B ]</span>
                Sartarosh
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ism</label>
            <input
              className={styles.input}
              type="text"
              placeholder="To'liq ismingiz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Parol</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Kamida 6 belgi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? (role === 'barber' ? 'Profil yaratilmoqda...' : 'Ro\'yxatdan o\'tilmoqda...')
              : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>yoki</span>
        </div>

        <button
          className={styles.googleBtn}
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/google`;
          }}
          type="button"
        >
          <span className={styles.googleIcon}>G</span>
          Google orqali ro&apos;yxatdan o&apos;tish
        </button>

        <p className={styles.switchLink}>
          Hisobingiz bormi?{' '}
          <Link href="/auth/login" className={styles.link}>
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
