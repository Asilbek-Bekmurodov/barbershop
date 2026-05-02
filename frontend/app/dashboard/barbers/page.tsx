'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../src/lib/api';
import { Barber } from '../../../src/types';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import styles from './barbers.module.css';

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await api.get('/barbers');
        const allBarbers: Barber[] = response.data.data;
        setBarbers(allBarbers.filter((b) => b.isVerified));
      } catch {
        setError('Barberlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Barberlar</h1>
        <p className={styles.subtitle}>
          Tasdiqlangan sartaroshlar katalogi. Bron qiling va vaqtingizni tejang.
        </p>
      </div>

      {error && (
        <div style={{ color: 'var(--trim-red)', marginBottom: 24, fontSize: 14 }}>{error}</div>
      )}

      {barbers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>Barberlar topilmadi</div>
          <p>Hozircha tasdiqlangan barberlar yo&apos;q.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {barbers.map((barber) => (
            <div key={barber._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {barber.userId?.avatar ? (
                    <img
                      src={barber.userId.avatar}
                      alt={barber.userId.name}
                      className={styles.avatarImg}
                    />
                  ) : (
                    getInitials(barber.userId?.name || 'B')
                  )}
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{barber.userId?.name || 'Barber'}</div>
                  <div className={styles.verifiedBadge}>Tasdiqlangan</div>
                  <div className={styles.rating}>
                    * {barber.rating?.toFixed(1) || '5.0'}
                    <span className={styles.ratingCount}>reyting</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardBody}>
                {barber.bio && <p className={styles.bio}>{barber.bio}</p>}

                {barber.workingHours && (
                  <div className={styles.hours}>
                    <span className={styles.hoursLabel}>Ish vaqti: </span>
                    {barber.workingHours.start} - {barber.workingHours.end}
                  </div>
                )}

                <Link href={`/dashboard/booking/${barber._id}`} className={styles.bookBtn}>
                  Bron qilish
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
