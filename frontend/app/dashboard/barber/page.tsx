'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import api from '../../../src/lib/api';
import { Booking, Service, FinanceStats } from '../../../src/types';
import Badge from '../../../src/components/ui/Badge';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import styles from './barber.module.css';
import { io, Socket } from 'socket.io-client';

type TabType = 'queue' | 'finance' | 'services';

export default function BarberDashboardPage() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('queue');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
  const [financeLoading, setFinanceLoading] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [barberId, setBarberId] = useState('');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [addingExpense, setAddingExpense] = useState(false);

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });
  const [addingService, setAddingService] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchBarberInfo();

    if (token) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001', {
        auth: { token },
      });
      socketRef.current = socket;

      socket.on('booking:new', (booking: Booking) => {
        setBookings((prev) => [booking, ...prev]);
      });

      socket.on('booking:update', (booking: Booking) => {
        setBookings((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  const fetchBarberInfo = async () => {
    try {
      const res = await api.get('/barbers');
      const barbers = res.data.data;
      const myBarber = barbers.find((b: { userId: { email: string } }) => b.userId?.email === user?.email);
      if (myBarber) setBarberId(myBarber._id);
    } catch {
      // ignore
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data.data);
    } catch {
      // ignore
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchFinance = async () => {
    setFinanceLoading(true);
    try {
      const response = await api.get('/finance/stats');
      setFinanceStats(response.data.data);
    } catch {
      // ignore
    } finally {
      setFinanceLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!barberId) return;
    setServicesLoading(true);
    try {
      const response = await api.get(`/services/${barberId}`);
      setServices(response.data.data);
    } catch {
      // ignore
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'finance' && !financeStats) {
      fetchFinance();
    }
    if (activeTab === 'services' && barberId) {
      fetchServices();
    }
  }, [activeTab, barberId]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.data.data : b))
      );
    } catch {
      // ignore
    }
  };

  const handleAddExpense = async () => {
    if (!expenseDesc || !expenseAmount) return;
    setAddingExpense(true);
    try {
      await api.post('/finance/expense', {
        description: expenseDesc,
        amount: parseFloat(expenseAmount),
      });
      setExpenseDesc('');
      setExpenseAmount('');
      await fetchFinance();
    } catch {
      // ignore
    } finally {
      setAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await api.delete(`/finance/expense/${expenseId}`);
      await fetchFinance();
    } catch {
      // ignore
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price || !newService.duration) return;
    setAddingService(true);
    try {
      await api.post('/services', {
        name: newService.name,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
        description: newService.description,
      });
      setNewService({ name: '', price: '', duration: '', description: '' });
      setShowAddService(false);
      if (barberId) fetchServices();
    } catch {
      // ignore
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await api.delete(`/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
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
    const d = new Date(isoString);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.startTime).toDateString();
    const today = new Date().toDateString();
    return bookingDate === today;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Barber Dashboard</h1>

      <div className={styles.tabs}>
        <button
          className={[styles.tab, activeTab === 'queue' ? styles.tabActive : ''].join(' ')}
          onClick={() => setActiveTab('queue')}
        >
          Navbatlar
        </button>
        <button
          className={[styles.tab, activeTab === 'finance' ? styles.tabActive : ''].join(' ')}
          onClick={() => setActiveTab('finance')}
        >
          Daromad
        </button>
        <button
          className={[styles.tab, activeTab === 'services' ? styles.tabActive : ''].join(' ')}
          onClick={() => setActiveTab('services')}
        >
          Xizmatlar
        </button>
      </div>

      {activeTab === 'queue' && (
        <div>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            Real-time yangilanmoqda
          </div>

          {bookingsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mijoz</th>
                    <th>Xizmat</th>
                    <th>Narx</th>
                    <th>Vaqt</th>
                    <th>Holat</th>
                    <th>Harakat</th>
                  </tr>
                </thead>
                <tbody>
                  {todayBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyTable}>
                        Bugun uchun bronlar yo&apos;q
                      </td>
                    </tr>
                  ) : (
                    todayBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <div className={styles.clientCell}>
                            <div className={styles.miniAvatar}>
                              {booking.clientId?.avatar ? (
                                <img
                                  src={booking.clientId.avatar}
                                  alt={booking.clientId.name}
                                  className={styles.miniAvatarImg}
                                />
                              ) : (
                                getInitials(booking.clientId?.name || 'M')
                              )}
                            </div>
                            <span>{booking.clientId?.name || 'Mijoz'}</span>
                          </div>
                        </td>
                        <td>{booking.serviceId?.name}</td>
                        <td>
                          <span className={styles.monoText}>
                            {booking.serviceId?.price?.toLocaleString()} so&apos;m
                          </span>
                        </td>
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
                        <td>
                          <div className={styles.actionBtns}>
                            {booking.status === 'pending' && (
                              <button
                                className={[styles.actionBtn, styles.btnConfirm].join(' ')}
                                onClick={() => handleStatusChange(booking._id, 'confirmed')}
                              >
                                Tasdiqlash
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                className={[styles.actionBtn, styles.btnProgress].join(' ')}
                                onClick={() => handleStatusChange(booking._id, 'in_progress')}
                              >
                                Boshlash
                              </button>
                            )}
                            {booking.status === 'in_progress' && (
                              <button
                                className={[styles.actionBtn, styles.btnComplete].join(' ')}
                                onClick={() => handleStatusChange(booking._id, 'completed')}
                              >
                                Yakunlash
                              </button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <button
                                className={[styles.actionBtn, styles.btnCancel].join(' ')}
                                onClick={() => handleStatusChange(booking._id, 'cancelled')}
                              >
                                Bekor
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'finance' && (
        <div>
          {financeLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : financeStats ? (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Bugungi daromad</div>
                  <div className={styles.statValue}>
                    {financeStats.todayRevenue?.toLocaleString()} so&apos;m
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Haftalik daromad</div>
                  <div className={styles.statValue}>
                    {financeStats.weeklyRevenue?.toLocaleString()} so&apos;m
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Jami daromad</div>
                  <div className={styles.statValue}>
                    {financeStats.totalRevenue?.toLocaleString()} so&apos;m
                  </div>
                </div>
              </div>

              <div className={styles.netProfitCard}>
                <div className={styles.netProfitLabel}>Net foyda</div>
                <div className={styles.netProfitValue}>
                  {financeStats.netProfit?.toLocaleString()} so&apos;m
                </div>
              </div>

              <div className={styles.financeSection}>
                <div className={styles.sectionTitle}>Xarajat qo&apos;shish</div>
                <div className={styles.expenseForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tavsif</label>
                    <input
                      className={styles.formInput}
                      placeholder="Xarajat tavsifi"
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Miqdor (so&apos;m)</label>
                    <input
                      className={styles.formInput}
                      type="number"
                      placeholder="0"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className={styles.addExpenseBtn}
                    onClick={handleAddExpense}
                    disabled={addingExpense || !expenseDesc || !expenseAmount}
                  >
                    {addingExpense ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                  </button>
                </div>
              </div>

              <div className={styles.financeSection}>
                <div className={styles.sectionTitle}>Xarajatlar</div>
                {financeStats.expenses?.length === 0 ? (
                  <div style={{ color: 'var(--trim-text-muted)', fontSize: 14, textAlign: 'center', padding: 24 }}>
                    Xarajatlar yo&apos;q
                  </div>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Tavsif</th>
                          <th>Miqdor</th>
                          <th>Sana</th>
                          <th>Harakat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financeStats.expenses?.map((expense) => (
                          <tr key={expense._id}>
                            <td>{expense.description}</td>
                            <td>
                              <span className={styles.monoText}>
                                {expense.amount?.toLocaleString()} so&apos;m
                              </span>
                            </td>
                            <td>{formatDate(expense.date)}</td>
                            <td>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteExpense(expense._id)}
                              >
                                O&apos;chirish
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--trim-text-muted)', fontSize: 14, textAlign: 'center', padding: 40 }}>
              Moliyaviy ma&apos;lumotlar yuklanmadi
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <div className={styles.servicesHeader}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--trim-text)' }}>
              Mening xizmatlarim
            </div>
            <button
              style={{
                padding: '8px 16px',
                background: 'var(--trim-purple)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={() => setShowAddService(!showAddService)}
            >
              {showAddService ? 'Bekor qilish' : '+ Xizmat qo\'shish'}
            </button>
          </div>

          {showAddService && (
            <div className={styles.addServiceForm}>
              <div className={styles.sectionTitle}>Yangi xizmat</div>
              <div className={styles.addServiceGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nomi</label>
                  <input
                    className={styles.formInput}
                    placeholder="Xizmat nomi"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Narxi (so&apos;m)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    placeholder="0"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Davomiyligi (min)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    placeholder="30"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 12 }}>
                <label className={styles.formLabel}>Tavsif (ixtiyoriy)</label>
                <input
                  className={styles.formInput}
                  placeholder="Xizmat tavsifi"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
              <div className={styles.addServiceActions}>
                <button
                  style={{
                    padding: '8px 20px',
                    background: 'var(--trim-purple)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                  onClick={handleAddService}
                  disabled={addingService}
                >
                  {addingService ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          )}

          {servicesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <LoadingSpinner />
            </div>
          ) : services.length === 0 ? (
            <div style={{ color: 'var(--trim-text-muted)', fontSize: 14, textAlign: 'center', padding: 40 }}>
              Xizmatlar yo&apos;q. Yangi xizmat qo&apos;shing.
            </div>
          ) : (
            services.map((service) => (
              <div key={service._id} className={styles.serviceCard}>
                <div className={styles.serviceCardInfo}>
                  <div className={styles.serviceCardName}>{service.name}</div>
                  {service.description && (
                    <div className={styles.serviceCardDesc}>{service.description}</div>
                  )}
                </div>
                <div className={styles.serviceCardMeta}>
                  <span className={styles.serviceCardPrice}>
                    {service.price?.toLocaleString()} so&apos;m
                  </span>
                  <span className={styles.serviceCardDuration}>{service.duration} min</span>
                </div>
                <div className={styles.serviceCardActions}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteService(service._id)}
                  >
                    O&apos;chirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
