'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import api, { getApiErrorMessage, mapBarber, mapService } from '@/lib/api';
import { Barber } from '@/types';

type FilterType = 'all' | 'available' | 'top';

function SkeletonCard() {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-[#30363d]" />
        <div className="flex-1">
          <div className="h-4 bg-[#30363d] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#30363d] rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-[#30363d] rounded w-full mb-2" />
      <div className="h-3 bg-[#30363d] rounded w-2/3 mb-4" />
      <div className="h-9 bg-[#30363d] rounded" />
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[#ecad0a]">★</span>
      <span className="text-sm font-medium text-[#e6edf3] mono">{rating.toFixed(1)}</span>
    </div>
  );
}

function AvatarPlaceholder({ name }: { name: string }) {
  const colors = ['#753991', '#209dd7', '#ecad0a', '#3fb950', '#f85149'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mono shrink-0"
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    let active = true;

    const loadBarbers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/barbers');
        const rawBarbers = Array.isArray(response.data.data) ? response.data.data : [];
        const mapped = await Promise.all(
          rawBarbers.map(async (raw: unknown) => {
            const baseBarber = mapBarber(raw);
            const serviceResponse = await api.get(`/services/${baseBarber.id}`);
            const services = Array.isArray(serviceResponse.data.data)
              ? serviceResponse.data.data.map(mapService)
              : [];
            return mapBarber(raw, services);
          })
        );

        if (active) setBarbers(mapped);
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, 'Sartaroshlarni yuklashda xatolik yuz berdi'));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBarbers();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return barbers.filter((barber) => {
      if (filter === 'available') return barber.isAvailable;
      if (filter === 'top') return barber.rating >= 4.7;
      return true;
    });
  }, [barbers, filter]);

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Barcha' },
    { key: 'available', label: "Bo'sh" },
    { key: 'top', label: 'Eng yaxshi' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 fade-in">
        <div>
          <p className="mono text-xs text-[#484f58] tracking-widest mb-1">SARTAROSHLAR</p>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Ustalarni tanlang</h1>
          <p className="text-sm text-[#8b949e] mt-1">{barbers.length} ta sartarosh ro'yxatda</p>
        </div>

        <div className="flex gap-1.5 p-1 bg-[#161b22] border border-[#30363d] rounded-lg">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 font-medium ${
                filter === opt.key
                  ? 'bg-[#753991] text-white'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#0d1117]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((barber, idx) => {
              const minPrice = barber.services.length
                ? Math.min(...barber.services.map((service) => service.price))
                : 0;

              return (
                <Card
                  key={barber.id}
                  hoverable
                  className="flex flex-col transition-all duration-500"
                  style={{ animationDelay: `${idx * 80}ms` } as React.CSSProperties}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <AvatarPlaceholder name={barber.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#e6edf3] truncate">{barber.name}</h3>
                        {barber.isVerified && (
                          <span className="text-[#209dd7] text-sm" title="Tasdiqlangan">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={barber.rating} />
                        <span className="text-xs text-[#484f58]">({barber.reviewCount})</span>
                      </div>
                      <Badge variant={barber.isAvailable ? 'green' : 'gray'} dot className="mt-1.5">
                        {barber.isAvailable ? "Bo'sh" : 'Tasdiqlanmagan'}
                      </Badge>
                    </div>
                  </div>

                  {barber.bio && (
                    <p className="text-xs text-[#8b949e] mb-3 leading-relaxed line-clamp-2">{barber.bio}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#8b949e] mb-4 pb-4 border-b border-[#30363d]">
                    <span>{barber.services.length} ta xizmat</span>
                    <span className="mono text-[#ecad0a]">
                      {minPrice ? `${minPrice.toLocaleString()} so'm dan` : 'Xizmat yoq'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {barber.services.slice(0, 2).map((service) => (
                      <span
                        key={service.id}
                        className="text-xs px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#8b949e]"
                      >
                        {service.name}
                      </span>
                    ))}
                    {barber.services.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#484f58]">
                        +{barber.services.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link href={`/dashboard/booking/${barber.id}`}>
                      <Button
                        variant={barber.isAvailable && barber.services.length ? 'primary' : 'outline'}
                        className="w-full"
                        disabled={!barber.isAvailable || !barber.services.length}
                      >
                        {barber.isAvailable && barber.services.length ? 'Bron qilish' : 'Hozir mavjud emas'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-[#8b949e]">
          <p className="text-lg">Ushbu filtr bo'yicha sartarosh topilmadi</p>
          <button onClick={() => setFilter('all')} className="mt-3 text-sm text-[#209dd7] hover:underline">
            Barcha sartaroshlarni ko'rish
          </button>
        </div>
      )}
    </div>
  );
}
