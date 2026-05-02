'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken, setLoading } from '../../../src/store/authSlice';
import api from '../../../src/lib/api';
import styles from '../auth.module.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      localStorage.setItem('trimflow_token', token);
      localStorage.setItem('trimflow_user', JSON.stringify(user));

      dispatch(setToken(token));
      dispatch(setUser(user));

      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'barber') {
        router.push('/dashboard/barber');
      } else {
        router.push('/dashboard/barbers');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login yoki parol noto\'g\'ri');
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/google`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>
            TrimFlow
          </Link>
        </div>
        <h1 className={styles.title}>Kirish</h1>
        <p className={styles.subtitle}>Hisobingizga kiring</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
              placeholder="Parolingiz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>yoki</span>
        </div>

        <button
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          type="button"
        >
          <span className={styles.googleIcon}>G</span>
          Google orqali kirish
        </button>

        <p className={styles.switchLink}>
          Hisobingiz yo&apos;qmi?{' '}
          <Link href="/auth/register" className={styles.link}>
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </div>
    </div>
  );
}
