'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api, { getApiErrorMessage, mapBarber, mapUser } from '@/lib/api';
import { Barber, User } from '@/types';

type UserRole = 'admin' | 'barber' | 'client';
type UserStatus = 'active' | 'blocked';
type FilterTab = 'all' | UserRole;

interface AdminUser extends User {
  status: UserStatus;
  isBlocked: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalBarbers: number;
  totalBookings: number;
  todayBookings: number;
}

const emptyStats: DashboardStats = {
  totalUsers: 0,
  totalBarbers: 0,
  totalBookings: 0,
  todayBookings: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object');

const mapAdminUser = (raw: unknown): AdminUser => {
  const user = mapUser(raw);
  const record = isRecord(raw) ? raw : {};
  const isBlocked = Boolean(record.isBlocked);

  return {
    ...user,
    isBlocked,
    status: isBlocked ? 'blocked' : 'active',
  };
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboardResponse, usersResponse, barbersResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users', { params: { limit: 100 } }),
        api.get('/barbers'),
      ]);

      setStats({ ...emptyStats, ...dashboardResponse.data.data });
      setUsers(Array.isArray(usersResponse.data.data) ? usersResponse.data.data.map(mapAdminUser) : []);
      setBarbers(Array.isArray(barbersResponse.data.data) ? barbersResponse.data.data.map((item: unknown) => mapBarber(item)) : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Admin maʼlumotlarini yuklashda xatolik yuz berdi'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    return activeFilter === 'all' ? users : users.filter((user) => user.role === activeFilter);
  }, [activeFilter, users]);

  const pendingBarbers = useMemo(() => barbers.filter((barber) => !barber.isVerified), [barbers]);

  const updateUser = async (id: string, patch: Partial<Pick<AdminUser, 'role' | 'isBlocked'>>) => {
    setError('');

    try {
      const response = await api.put(`/admin/users/${id}`, patch);
      const updated = mapAdminUser(response.data.data);
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Foydalanuvchini yangilashda xatolik yuz berdi'));
    }
  };

  const toggleBlock = (user: AdminUser) => {
    updateUser(user.id, { isBlocked: !user.isBlocked });
  };

  const changeRole = (user: AdminUser) => {
    const order: UserRole[] = ['client', 'barber', 'admin'];
    const nextRole = order[(order.indexOf(user.role) + 1) % order.length];
    updateUser(user.id, { role: nextRole });
  };

  const approveBarber = async (id: string) => {
    setError('');

    try {
      const response = await api.post(`/admin/verify/${id}`);
      const verified = mapBarber(response.data.data);
      setBarbers((prev) => prev.map((barber) => (barber.id === id ? verified : barber)));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Sartaroshni tasdiqlashda xatolik yuz berdi'));
    }
  };

  const roleBadge = (role: UserRole) => {
    const map: Record<UserRole, { label: string; v: 'purple' | 'blue' | 'gray' }> = {
      admin: { label: 'Admin', v: 'purple' },
      barber: { label: 'Barber', v: 'blue' },
      client: { label: 'Client', v: 'gray' },
    };
    return <Badge variant={map[role].v}>{map[role].label}</Badge>;
  };

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Barcha' },
    { key: 'admin', label: 'Admin' },
    { key: 'barber', label: 'Barber' },
    { key: 'client', label: 'Client' },
  ];

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
            Admin <span className="text-[#ecad0a]">Panel</span>
          </h1>
          <p className="text-xs text-[#484f58] mono mt-0.5">TrimFlow boshqaruv paneli</p>
        </div>
        <Badge variant="red" dot>ADMIN ACCESS</Badge>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Foydalanuvchilar', value: stats.totalUsers, color: 'text-[#209dd7]', bg: 'border-[#209dd7]/30' },
          { label: 'Sartaroshlar', value: stats.totalBarbers, color: 'text-[#753991]', bg: 'border-[#753991]/30' },
          { label: 'Bugungi bronlar', value: stats.todayBookings, color: 'text-[#ecad0a]', bg: 'border-[#ecad0a]/30' },
          { label: 'Jami bronlar', value: stats.totalBookings, color: 'text-[#3fb950]', bg: 'border-[#3fb950]/30' },
        ].map((item) => (
          <div key={item.label} className={`bg-[#161b22] border ${item.bg} rounded-xl p-4`}>
            <p className="text-[10px] text-[#484f58] mono uppercase tracking-wider mb-1">{item.label}</p>
            <p className={`text-2xl font-bold mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Foydalanuvchilar</h2>
            <div className="flex gap-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-2.5 py-1 text-xs rounded-md mono transition-colors ${
                    activeFilter === tab.key
                      ? 'bg-[#ecad0a]/20 text-[#ecad0a] border border-[#ecad0a]/40'
                      : 'text-[#484f58] hover:text-[#8b949e] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#21262d]">
                  {['Foydalanuvchi', 'Rol', 'Status', 'Sana', 'Amallar'].map((header) => (
                    <th key={header} className="px-4 py-2.5 text-left text-[#484f58] mono uppercase tracking-wider font-normal">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`transition-colors hover:bg-[#161b22]/50 ${user.status === 'blocked' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#753991] to-[#209dd7] flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[#e6edf3] font-medium">{user.name}</p>
                          <p className="text-[#484f58]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{roleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'green' : 'red'} dot>
                        {user.status === 'active' ? 'Aktiv' : 'Bloklangan'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 mono text-[#484f58]">{user.createdAt ? user.createdAt.slice(0, 10) : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="text-[10px]" onClick={() => toggleBlock(user)}>
                          {user.status === 'active' ? 'Bloklash' : 'Tiklash'}
                        </Button>
                        <Button size="sm" variant="secondary" className="text-[10px]" onClick={() => changeRole(user)}>
                          Rol
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-xs text-[#484f58] mono">Bu filtrdagi foydalanuvchilar topilmadi</div>
            )}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
            <h2 className="text-sm font-semibold mono text-[#e6edf3]">Tasdiqlash</h2>
            {pendingBarbers.length > 0 && <Badge variant="yellow" dot>{pendingBarbers.length} kutmoqda</Badge>}
          </div>

          <div className="p-3 space-y-3">
            {pendingBarbers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[#484f58] mono">Tasdiqlanmagan sartarosh yo'q</p>
                <p className="text-[10px] text-[#30363d] mono mt-1">Barcha ko'rib chiqildi</p>
              </div>
            ) : (
              pendingBarbers.map((barber) => (
                <div key={barber.id} className="bg-[#161b22] border border-[#21262d] rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#209dd7] to-[#753991] flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {barber.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e6edf3]">{barber.name}</p>
                      <p className="text-[10px] text-[#8b949e] mt-1 italic">{barber.bio || 'Bio kiritilmagan'}</p>
                    </div>
                  </div>

                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => approveBarber(barber.id)}>
                    Tasdiqlash
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
