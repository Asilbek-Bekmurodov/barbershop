'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { setUser } from '../../../src/store/authSlice';
import api from '../../../src/lib/api';
import { Booking } from '../../../src/types';
import Badge from '../../../src/components/ui/Badge';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import styles from './profile.module.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsTab, setBookingsTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my');
        setBookings(response.data.data);
      } catch {
        // ignore
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await api.put('/users/profile', { name });
      const updatedUser = response.data.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem('trimflow_user', JSON.stringify(updatedUser));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' +
      d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const activeBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress'
  );

  const completedBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedBookings = bookingsTab === 'active' ? activeBookings : completedBookings;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Profil</h1>

      <div className={styles.grid}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
              ) : (
                getInitials(user?.name || 'U')
              )}
            </div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>

          <div className={styles.coinsCard}>
            <div className={styles.coinsLabel}>StyleCoins balansi</div>
            <div className={styles.coinsValue}>{user?.styleCoins ?? 0} SC</div>
          </div>

          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ism</label>
              <input
                className={styles.formInput}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="To'liq ismingiz"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rol</label>
              <input
                className={styles.formInput}
                type="text"
                value={user?.role || ''}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving || !name.trim()}
            >
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>

            {saveSuccess && (
              <div className={styles.successMsg}>Profil muvaffaqiyatli yangilandi</div>
            )}
          </div>
        </div>

        <div className={styles.bookingsSection}>
          <div className={styles.bookingsTabs}>
            <button
              className={[
                styles.bookingsTab,
                bookingsTab === 'active' ? styles.bookingsTabActive : '',
              ].join(' ')}
              onClick={() => setBookingsTab('active')}
            >
              Faol bronlar ({activeBookings.length})
            </button>
            <button
              className={[
                styles.bookingsTab,
                bookingsTab === 'completed' ? styles.bookingsTabActive : '',
              ].join(' ')}
              onClick={() => setBookingsTab('completed')}
            >
              Tarix ({completedBookings.length})
            </button>
          </div>

          {bookingsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className={styles.emptyBookings}>
              {bookingsTab === 'active'
                ? 'Faol bronlar yo\'q'
                : 'Bron tarixi yo\'q'}
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {displayedBookings.map((booking) => (
                <div key={booking._id} className={styles.bookingItem}>
                  <div className={styles.bookingLeft}>
                    <div className={styles.bookingService}>{booking.serviceId?.name}</div>
                    <div className={styles.bookingBarber}>
                      Barber: {booking.barberId?.userId?.name || '-'}
                    </div>
                    <div className={styles.bookingTime}>{formatTime(booking.startTime)}</div>
                  </div>
                  <div className={styles.bookingRight}>
                    <div className={styles.bookingPrice}>
                      {booking.serviceId?.price?.toLocaleString()} so&apos;m
                    </div>
                    <Badge variant={booking.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'}>
                      {booking.status === 'pending'
                        ? 'Kutilmoqda'
                        : booking.status === 'confirmed'
                        ? 'Tasdiqlangan'
                        : booking.status === 'in_progress'
                        ? 'Jarayonda'
                        : booking.status === 'completed'
                        ? 'Bajarildi'
                        : 'Bekor qilindi'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
