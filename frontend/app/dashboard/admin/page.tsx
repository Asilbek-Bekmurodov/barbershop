'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../src/lib/api';
import { AdminDashboard, AdminUser, Booking } from '../../../src/types';
import Badge from '../../../src/components/ui/Badge';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import styles from './admin.module.css';

type TabType = 'dashboard' | 'users';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, page]);

  const fetchDashboard = async () => {
    setDashboardLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data.data);
    } catch {
      // ignore
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(response.data.data);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
      }
    } catch {
      // ignore
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole as AdminUser['role'] } : u))
      );
    } catch {
      // ignore
    }
  };

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { isBlocked: !isBlocked });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: !isBlocked } : u))
      );
    } catch {
      // ignore
    }
  };

  const handleVerifyBarber = async (barberId: string) => {
    try {
      await api.post(`/admin/verify/${barberId}`);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.barberInfo?._id === barberId) {
            return {
              ...u,
              barberInfo: { ...u.barberInfo, isVerified: true },
            };
          }
          return u;
        })
      );
    } catch {
      // ignore
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Admin Panel</h1>

      <div className={styles.tabs}>
        <button
          className={[styles.tab, activeTab === 'dashboard' ? styles.tabActive : ''].join(' ')}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={[styles.tab, activeTab === 'users' ? styles.tabActive : ''].join(' ')}
          onClick={() => setActiveTab('users')}
        >
          Foydalanuvchilar
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          {dashboardLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : dashboardData ? (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Jami foydalanuvchilar</div>
                  <div className={styles.statValue}>{dashboardData.totalUsers}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Jami barberlar</div>
                  <div className={styles.statValue}>{dashboardData.totalBarbers}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Jami bronlar</div>
                  <div className={styles.statValue}>{dashboardData.totalBookings}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Bugungi bronlar</div>
                  <div className={styles.statValue}>{dashboardData.todayBookings}</div>
                </div>
              </div>

              {dashboardData.bookingStats && (
                <div className={styles.statusGrid}>
                  <div className={[styles.statusCard, styles.pending].join(' ')}>
                    <div className={styles.statusCardLabel}>Kutilmoqda</div>
                    <div className={styles.statusCardValue}>{dashboardData.bookingStats.pending}</div>
                  </div>
                  <div className={[styles.statusCard, styles.confirmed].join(' ')}>
                    <div className={styles.statusCardLabel}>Tasdiqlangan</div>
                    <div className={styles.statusCardValue}>{dashboardData.bookingStats.confirmed}</div>
                  </div>
                  <div className={[styles.statusCard, styles.completed].join(' ')}>
                    <div className={styles.statusCardLabel}>Bajarilgan</div>
                    <div className={styles.statusCardValue}>{dashboardData.bookingStats.completed}</div>
                  </div>
                  <div className={[styles.statusCard, styles.cancelled].join(' ')}>
                    <div className={styles.statusCardLabel}>Bekor qilingan</div>
                    <div className={styles.statusCardValue}>{dashboardData.bookingStats.cancelled}</div>
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionHeader}>So&apos;nggi bronlar</div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Mijoz</th>
                      <th>Barber</th>
                      <th>Xizmat</th>
                      <th>Vaqt</th>
                      <th>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentBookings?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyTable}>
                          Bronlar yo&apos;q
                        </td>
                      </tr>
                    ) : (
                      dashboardData.recentBookings?.map((booking: Booking) => (
                        <tr key={booking._id}>
                          <td>{booking.clientId?.name || '-'}</td>
                          <td>{booking.barberId?.userId?.name || '-'}</td>
                          <td>{booking.serviceId?.name || '-'}</td>
                          <td>
                            <span className={styles.monoText}>{formatTime(booking.startTime)}</span>
                          </td>
                          <td>
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--trim-text-muted)', fontSize: 14, textAlign: 'center', padding: 40 }}>
              Dashboard ma&apos;lumotlari yuklanmadi
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {usersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Foydalanuvchilar ro&apos;yxati</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Foydalanuvchi</th>
                    <th>Rol</th>
                    <th>StyleCoins</th>
                    <th>Holat</th>
                    <th>Harakatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyTable}>
                        Foydalanuvchilar yo&apos;q
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.miniAvatar}>
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className={styles.miniAvatarImg}
                                />
                              ) : (
                                getInitials(user.name || 'U')
                              )}
                            </div>
                            <div>
                              <div className={styles.userName}>{user.name}</div>
                              <div className={styles.userEmail}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                            className={styles.roleSelect}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            <option value="client">Client</option>
                            <option value="barber">Barber</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <span className={styles.monoText}>{user.styleCoins || 0}</span>
                        </td>
                        <td>
                          {user.isBlocked ? (
                            <Badge variant="cancelled">Bloklangan</Badge>
                          ) : (
                            <Badge variant="verified">Faol</Badge>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            {user.isBlocked ? (
                              <button
                                className={styles.unblockBtn}
                                onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                              >
                                Blokni ochish
                              </button>
                            ) : (
                              <button
                                className={styles.blockBtn}
                                onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                              >
                                Bloklash
                              </button>
                            )}
                            {user.role === 'barber' && user.barberInfo && !user.barberInfo.isVerified && (
                              <button
                                className={styles.verifyBtn}
                                onClick={() => handleVerifyBarber(user.barberInfo!._id)}
                              >
                                Tasdiqlash
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <span>
                    {page} / {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Oldingi
                  </button>
                  <button
                    className={styles.pageBtn}
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Keyingi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
