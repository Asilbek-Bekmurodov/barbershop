'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api, { getApiErrorMessage, mapBooking } from '@/lib/api';
import { Booking, BookingStatus, TimeSlot } from '@/types';

interface FinanceStatsDto {
  todayRevenue: number;
  weeklyRevenue: number;
  totalRevenue: number;
  todayBookings: number;
  completedBookings: number;
  totalExpenses: number;
  netProfit: number;
}

const emptyStats: FinanceStatsDto = {
  todayRevenue: 0,
  weeklyRevenue: 0,
  totalRevenue: 0,
  todayBookings: 0,
  completedBookings: 0,
  totalExpenses: 0,
  netProfit: 0,
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(status: BookingStatus) {
  const map: Record<BookingStatus, { label: string; variant: 'yellow' | 'blue' | 'green' | 'red' | 'gray' | 'purple' }> = {
    pending: { label: 'Kutilmoqda', variant: 'yellow' },
    confirmed: { label: 'Tasdiqlangan', variant: 'blue' },
    in_progress: { label: 'Jarayonda', variant: 'purple' },
    completed: { label: 'Bajarildi', variant: 'green' },
    cancelled: { label: 'Bekor', variant: 'red' },
  };
  const value = map[status];
  return <Badge variant={value.variant} dot>{value.label}</Badge>;
}

const buildSlots = (bookings: Booking[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  for (let hour = 8; hour <= 18; hour += 1) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const booking = bookings.find((item) => {
      const start = new Date(item.startTime);
      return start.getHours() === hour && ['pending', 'confirmed', 'in_progress'].includes(item.status);
    });

    slots.push({
      time,
      isAvailable: !booking,
      booking: booking ? { clientName: booking.clientName, serviceName: booking.serviceName } : undefined,
    });
  }

  return slots;
};

export default function BarberDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<FinanceStatsDto>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentHour = new Date().getHours();

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [bookingResponse, financeResponse] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/finance/stats'),
      ]);

      setBookings(Array.isArray(bookingResponse.data.data) ? bookingResponse.data.data.map(mapBooking) : []);
      setStats({ ...emptyStats, ...financeResponse.data.data });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Dashboard maʼlumotlarini yuklashda xatolik yuz berdi'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    setError('');

    try {
      const response = await api.patch(`/bookings/${id}`, { status: newStatus });
      const updatedBooking = mapBooking(response.data.data);
      setBookings((prev) => prev.map((booking) => (booking.id === id ? updatedBooking : booking)));
      if (newStatus === 'completed') {
        loadDashboard();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Bron statusini yangilashda xatolik yuz berdi'));
    }
  };

  const todayQueue = useMemo(() => {
    const today = new Date().toDateString();
    return bookings
      .filter((booking) => new Date(booking.startTime).toDateString() === today)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [bookings]);

  const slots = useMemo(() => buildSlots(todayQueue), [todayQueue]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mono text-[#e6edf3]">
            Sartarosh <span className="text-[#ecad0a]">Terminal</span>
          </h1>
          <p className="text-xs text-[#484f58] mono mt-0.5">
            Bugun, {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
          <span className="text-xs text-[#3fb950] mono">ONLINE</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Bugungi Navbat</h2>
            <Badge variant="yellow" dot>{todayQueue.filter((booking) => booking.status === 'pending').length} kutilmoqda</Badge>
          </div>

          <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
            {todayQueue.length === 0 ? (
              <div className="py-10 text-center text-xs mono text-[#484f58]">Bugun bronlar yo'q</div>
            ) : (
              todayQueue.map((booking) => (
                <div key={booking.id} className="relative bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#753991] to-[#209dd7] flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {booking.clientName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e6edf3] truncate">{booking.clientName}</p>
                      <p className="text-xs text-[#8b949e] mt-0.5">{booking.serviceName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs mono text-[#209dd7]">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </span>
                        {statusBadge(booking.status)}
                      </div>
                      <p className="text-xs mono text-[#3fb950] mt-1">{booking.price.toLocaleString()} so'm</p>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="secondary" className="flex-1 text-xs" onClick={() => updateStatus(booking.id, 'confirmed')}>
                        Tasdiqlash
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => updateStatus(booking.id, 'cancelled')}>
                        Bekor
                      </Button>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button size="sm" variant="secondary" className="w-full mt-3 text-xs" onClick={() => updateStatus(booking.id, 'in_progress')}>
                      Start
                    </Button>
                  )}
                  {booking.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 text-xs border-[#3fb950]/40 text-[#3fb950] hover:bg-[#3fb950]/10"
                      onClick={() => updateStatus(booking.id, 'completed')}
                    >
                      Bajarildi
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Jadval</h2>
            <span className="text-xs mono text-[#484f58]">08:00 - 18:00</span>
          </div>

          <div className="p-3 space-y-2">
            {slots.map((slot) => {
              const [hour] = slot.time.split(':').map(Number);
              const isCurrent = hour === currentHour;
              const endHour = String(hour + 1).padStart(2, '0');

              return (
                <div
                  key={slot.time}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-[#3fb950]/60 bg-[#3fb950]/5 shadow-[0_0_8px_rgba(63,185,80,0.12)]'
                      : slot.isAvailable
                        ? 'border-[#209dd7]/30 bg-transparent'
                        : 'border-[#30363d] bg-[#161b22]'
                  }`}
                >
                  <div className="w-20 shrink-0">
                    <span className={`text-xs mono font-bold ${isCurrent ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>
                      {slot.time}
                    </span>
                    <span className="text-[10px] mono text-[#484f58]"> - {endHour}:00</span>
                  </div>

                  <div className={`w-1 h-8 rounded-full shrink-0 ${isCurrent ? 'bg-[#3fb950]' : slot.isAvailable ? 'bg-[#209dd7]/50' : 'bg-[#30363d]'}`} />

                  <div className="flex-1 min-w-0">
                    {slot.booking ? (
                      <>
                        <p className="text-xs font-medium text-[#e6edf3] truncate">{slot.booking.clientName}</p>
                        <p className="text-[10px] text-[#8b949e]">{slot.booking.serviceName}</p>
                      </>
                    ) : (
                      <span className={`text-xs ${isCurrent ? 'text-[#3fb950]' : 'text-[#484f58]'}`}>
                        {isCurrent ? 'Joriy vaqt' : "Bo'sh"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Analytics <span className="text-[#ecad0a]">P&L</span></h2>
          </div>

          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider">Bugungi</p>
                <p className="text-lg font-bold mono text-[#3fb950] mt-1">{stats.todayRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-[#3fb950]/60 mono">so'm</p>
              </div>

              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider">Haftalik</p>
                <p className="text-lg font-bold mono text-[#209dd7] mt-1">{stats.weeklyRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-[#209dd7]/60 mono">so'm</p>
              </div>

              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider">Bronlar</p>
                <p className="text-lg font-bold mono text-[#ecad0a] mt-1">{stats.todayBookings}</p>
                <p className="text-[10px] text-[#ecad0a]/60 mono">bugun</p>
              </div>

              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider">Bajarilgan</p>
                <p className="text-lg font-bold mono text-[#a371c5] mt-1">{stats.completedBookings}</p>
                <p className="text-[10px] text-[#a371c5]/60 mono">jami</p>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
              <p className="text-xs mono text-[#8b949e] mb-3 uppercase tracking-wider">P&L Hisobot</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b949e]">Daromad</span>
                  <span className="mono text-sm font-bold text-[#3fb950]">+{stats.totalRevenue.toLocaleString()} so'm</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b949e]">Xarajat</span>
                  <span className="mono text-sm font-bold text-[#f85149]">-{stats.totalExpenses.toLocaleString()} so'm</span>
                </div>

                <div className="h-px bg-[#30363d] my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b949e]">Sof foyda</span>
                  <span className="mono text-xl font-bold text-[#ecad0a]">{stats.netProfit.toLocaleString()} so'm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
