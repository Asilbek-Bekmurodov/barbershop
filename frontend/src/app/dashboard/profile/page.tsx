'use client';

import React, { useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api, { getApiErrorMessage, mapBooking, mapUser } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Booking, BookingStatus, User } from '@/types';

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${date.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' })} ${date.toLocaleTimeString(
    'uz-UZ',
    { hour: '2-digit', minute: '2-digit' }
  )}`;
}

function statusBadge(status: BookingStatus) {
  const map: Record<BookingStatus, { label: string; v: 'yellow' | 'blue' | 'purple' | 'green' | 'red' }> = {
    pending: { label: 'Kutilmoqda', v: 'yellow' },
    confirmed: { label: 'Tasdiqlangan', v: 'blue' },
    in_progress: { label: 'Jarayonda', v: 'purple' },
    completed: { label: 'Bajarildi', v: 'green' },
    cancelled: { label: 'Bekor', v: 'red' },
  };
  const value = map[status];
  return <Badge variant={value.v} dot>{value.label}</Badge>;
}

export default function ProfilePage() {
  const { user: authUser, setUser } = useAuthStore();
  const [user, setLocalUser] = useState<User | null>(authUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(authUser?.name || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const [userResponse, bookingResponse] = await Promise.all([
          api.get('/users/me'),
          api.get('/bookings/my'),
        ]);
        const nextUser = mapUser(userResponse.data.data);
        const nextBookings = Array.isArray(bookingResponse.data.data)
          ? bookingResponse.data.data.map(mapBooking)
          : [];

        if (active) {
          setLocalUser(nextUser);
          setUser(nextUser);
          setEditName(nextUser.name);
          setBookings(nextBookings);
        }
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, 'Profilni yuklashda xatolik yuz berdi'));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [setUser]);

  const cancelBooking = async (id: string) => {
    setError('');

    try {
      const response = await api.patch(`/bookings/${id}`, { status: 'cancelled' });
      const cancelled = mapBooking(response.data.data);
      setBookings((prev) => prev.map((booking) => (booking.id === id ? cancelled : booking)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Bronni bekor qilishda xatolik yuz berdi'));
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError('');

    try {
      const response = await api.put('/users/profile', { name: editName });
      const updatedUser = mapUser(response.data.data);
      setLocalUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Profilni saqlashda xatolik yuz berdi'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d1117] p-4">
        <div className="max-w-5xl mx-auto rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
          {error || 'Profil topilmadi'}
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter((booking) => ['pending', 'confirmed', 'in_progress'].includes(booking.status));
  const history = bookings.filter((booking) => ['completed', 'cancelled'].includes(booking.status));

  return (
    <div className="min-h-screen bg-[#0d1117] p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        {error && (
          <div className="rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
            {error}
          </div>
        )}

        <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#753991] to-[#209dd7] flex items-center justify-center text-4xl font-bold text-white border-2 border-[#30363d] shrink-0">
              {user.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-[#e6edf3] focus:outline-none focus:border-[#209dd7]"
                    placeholder="Ism"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={saveProfile} isLoading={saving}>
                      Saqlash
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Bekor
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-[#e6edf3]">{user.name}</h1>
                    <Badge variant="blue">{user.role}</Badge>
                  </div>
                  <p className="text-sm text-[#8b949e] mt-1">{user.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-xs text-[#209dd7] hover:text-[#1a8bbf] mono transition-colors"
                  >
                    Tahrirlash
                  </button>
                </>
              )}
            </div>

            <div className="bg-[#0d1117] border border-[#ecad0a]/30 rounded-xl p-4 text-center shrink-0">
              <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider mb-1">StyleCoins</p>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-[#ecad0a] text-2xl">⬡</span>
                <span className="text-3xl font-bold mono text-[#ecad0a]">{user.styleCoins.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-[#ecad0a]/60 mono mt-1">
                ≈ {(user.styleCoins * 100).toLocaleString()} so'm
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Faol Bronlar</h2>
            <Badge variant="blue" dot>{activeBookings.length} ta</Badge>
          </div>

          <div className="divide-y divide-[#21262d]">
            {activeBookings.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[#484f58] mono">Faol bronlar yo'q</p>
              </div>
            ) : (
              activeBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[#161b22]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#209dd7] to-[#753991] flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {booking.barberName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#e6edf3]">{booking.barberName}</span>
                      {statusBadge(booking.status)}
                    </div>
                    <p className="text-xs text-[#8b949e] mt-0.5">{booking.serviceName}</p>
                    <p className="text-xs mono text-[#209dd7] mt-0.5">{formatDateTime(booking.startTime)}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold mono text-[#e6edf3]">{booking.price.toLocaleString()} so'm</p>
                    <p className="text-[10px] text-[#ecad0a] mono">+{booking.styleCoinsEarned} coins</p>
                  </div>

                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-2.5 py-1 text-xs rounded-md border border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 mono transition-colors shrink-0"
                    >
                      Bekor
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Bron Tarixi</h2>
            <span className="text-xs text-[#484f58] mono">{history.length} ta yozuv</span>
          </div>

          <div className="divide-y divide-[#21262d]">
            {history.map((booking) => (
              <div
                key={booking.id}
                className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#161b22]/30 ${
                  booking.status === 'cancelled' ? 'opacity-50' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-[#8b949e] shrink-0">
                  {booking.barberName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#e6edf3]">{booking.barberName}</span>
                    {statusBadge(booking.status)}
                  </div>
                  <p className="text-xs text-[#484f58] mt-0.5">
                    {booking.serviceName} · {formatDateTime(booking.startTime)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm mono text-[#8b949e]">{booking.price.toLocaleString()} so'm</p>
                  {booking.status === 'completed' && (
                    <p className="text-[10px] text-[#ecad0a]/70 mono">+{booking.styleCoinsEarned} coins</p>
                  )}
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-[#484f58] mono">Tarix hali bo'sh</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
