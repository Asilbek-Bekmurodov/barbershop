'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { setOpen } from '../../store/chatSlice';
import api from '../../lib/api';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOpen } = useSelector((state: RootState) => state.chat);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/health');
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [
        { href: '/dashboard/admin', label: 'Admin' },
        { href: '/dashboard/barbers', label: 'Barberlar' },
        { href: '/dashboard/profile', label: 'Profil' },
      ];
    }
    if (user.role === 'barber') {
      return [
        { href: '/dashboard/barber', label: 'Dashboard' },
        { href: '/dashboard/profile', label: 'Profil' },
      ];
    }
    return [
      { href: '/dashboard/barbers', label: 'Barberlar' },
      { href: '/dashboard/profile', label: 'Profil' },
    ];
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        TrimFlow
      </Link>

      <nav className={styles.nav}>
        {getNavLinks().map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              styles.navLink,
              pathname === link.href || pathname.startsWith(link.href + '/')
                ? styles.navLinkActive
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.right}>
        <div className={styles.statusWrapper}>
          <span className={[styles.statusDot, serverOnline ? styles.online : ''].join(' ')} />
          <span>{serverOnline ? 'Online' : 'Offline'}</span>
        </div>

        {user && (
          <div className={styles.coins}>
            <span className={styles.coinsIcon}>S</span>
            <span>{user.styleCoins ?? 0}</span>
          </div>
        )}

        <button
          className={styles.aiButton}
          onClick={() => dispatch(setOpen(!isOpen))}
          title="TrimAgent AI"
        >
          AI
          <span>TrimAgent</span>
        </button>

        <button className={styles.logoutButton} onClick={handleLogout}>
          Chiqish
        </button>
      </div>
    </header>
  );
};

export default Header;
