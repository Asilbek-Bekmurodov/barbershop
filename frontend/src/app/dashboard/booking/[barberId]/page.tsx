'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import api, { getApiErrorMessage, mapBarber, mapService } from '@/lib/api';
import { useBookingStore } from '@/store/useBookingStore';
import { Barber, Service, TimeSlot } from '@/types';

function AvatarPlaceholder({ name }: { name: string }) {
  const colors = ['#753991', '#209dd7', '#ecad0a', '#3fb950'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mono"
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const buildStartTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

function generateTimeSlots(barber: Barber, service: Service | null): TimeSlot[] {
  const interval = service?.duration || 30;
  const start = toMinutes(barber.workingHours.start);
  const end = toMinutes(barber.workingHours.end);
  const slots: TimeSlot[] = [];

  for (let cursor = start; cursor + interval <= end; cursor += interval) {
    const time = fromMinutes(cursor);
    const slotDate = buildStartTime(time);
    slots.push({
      time,
      isAvailable: slotDate > new Date(),
    });
  }

  return slots;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const barberId = params.barberId as string;
  const { createBooking, isLoading: bookingLoading } = useBookingStore();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadBookingData = async () => {
      setLoading(true);
      setError('');

      try {
        const [barberResponse, servicesResponse] = await Promise.all([
          api.get(`/barbers/${barberId}`),
          api.get(`/services/${barberId}`),
        ]);
        const services = Array.isArray(servicesResponse.data.data)
          ? servicesResponse.data.data.map(mapService)
          : [];
        const mappedBarber = mapBarber(barberResponse.data.data, services);

        if (active) {
          setBarber(mappedBarber);
          setSelectedService(services[0] || null);
        }
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, 'Bron maʼlumotlarini yuklashda xatolik yuz berdi'));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookingData();
    return () => {
      active = false;
    };
  }, [barberId]);

  const timeSlots = useMemo(() => {
    if (!barber) return [];
    return generateTimeSlots(barber, selectedService);
  }, [barber, selectedService]);

  const handleConfirm = async () => {
    if (!barber || !selectedService || !selectedSlot) return;
    setError('');

    try {
      await createBooking({
        barberId: barber.id,
        serviceId: selectedService.id,
        startTime: buildStartTime(selectedSlot).toISOString(),
      });
      setConfirmed(true);
      setTimeout(() => router.push('/dashboard/profile'), 1200);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Bron yaratishda xatolik yuz berdi'));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#8b949e]">
        <p className="text-lg">{error || 'Sartarosh topilmadi'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/barbers')}>
          Qaytish
        </Button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center fade-in">
          <div className="w-16 h-16 rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-[#3fb950]">✓</span>
          </div>
          <h2 className="text-xl font-bold text-[#e6edf3] mb-2">Bron yaratildi</h2>
          <p className="text-sm text-[#8b949e]">
            {barber.name} - {selectedSlot}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full fade-in">
      <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-6 mono">
        <button onClick={() => router.push('/dashboard/barbers')} className="hover:text-[#e6edf3] transition-colors">
          Sartaroshlar
        </button>
        <span>/</span>
        <span className="text-[#e6edf3]">{barber.name}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#f85149]/30 bg-[#f85149]/10 px-4 py-3 text-sm text-[#f85149]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col items-center text-center gap-2">
              <AvatarPlaceholder name={barber.name} />
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="font-semibold text-[#e6edf3]">{barber.name}</h2>
                  {barber.isVerified && <span className="text-[#209dd7]">✓</span>}
                </div>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-[#ecad0a] text-sm">★</span>
                  <span className="mono text-sm text-[#e6edf3]">{barber.rating.toFixed(1)}</span>
                  <span className="text-xs text-[#484f58]">({barber.reviewCount})</span>
                </div>
              </div>
              {barber.bio && <p className="text-xs text-[#8b949e] leading-relaxed">{barber.bio}</p>}
              <Badge variant={barber.isVerified ? 'green' : 'gray'} dot>
                {barber.isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
              </Badge>
            </div>
          </Card>

          <Card padding="none">
            <div className="px-4 py-3 border-b border-[#30363d]">
              <p className="text-xs mono text-[#484f58] tracking-widest">XIZMATLAR</p>
            </div>
            <div className="divide-y divide-[#30363d]">
              {barber.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setSelectedSlot(null);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors duration-150 ${
                    selectedService?.id === service.id
                      ? 'bg-[#753991]/10 border-l-2 border-l-[#753991]'
                      : 'hover:bg-[#0d1117]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#e6edf3] font-medium">{service.name}</span>
                    {selectedService?.id === service.id && <span className="text-[#753991]">✓</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="mono text-xs text-[#ecad0a]">{service.price.toLocaleString()} so'm</span>
                    <span className="text-xs text-[#484f58]">{service.duration} daq</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card padding="none">
            <div className="px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
              <div>
                <p className="text-xs mono text-[#484f58] tracking-widest">ISH JADVALI</p>
                <p className="text-sm text-[#8b949e] mt-0.5">
                  Bugun - {barber.workingHours.start} dan {barber.workingHours.end} gacha
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#3fb950] mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] pulse-dot inline-block" />
                LIVE
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;

                return (
                  <button
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(isSelected ? null : slot.time)}
                    className={`relative flex flex-col items-start gap-0.5 p-3 rounded-md border text-left transition-all duration-200 ${
                      !slot.isAvailable
                        ? 'border-[#30363d] bg-[#30363d]/20 cursor-not-allowed opacity-70'
                        : isSelected
                          ? 'border-[#753991] bg-[#753991]/15 shadow-sm shadow-[#753991]/20'
                          : 'border-[#209dd7]/40 bg-[#209dd7]/5 hover:border-[#209dd7] hover:bg-[#209dd7]/10 cursor-pointer'
                    }`}
                  >
                    <span className={`mono text-sm font-medium ${isSelected ? 'text-[#a371c5]' : 'text-[#209dd7]'}`}>
                      {slot.time}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-[#8b949e]' : 'text-[#484f58]'}`}>
                      {slot.isAvailable ? (isSelected ? 'Tanlandi' : "Bo'sh") : "O'tgan"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-xs mono text-[#484f58] tracking-widest mb-4">BRON XULASASI</p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[#8b949e]">Sartarosh</span>
                <span className="text-sm text-[#e6edf3] font-medium">{barber.name}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[#8b949e]">Xizmat</span>
                {selectedService ? (
                  <span className="text-sm text-[#e6edf3] font-medium">{selectedService.name}</span>
                ) : (
                  <span className="text-xs text-[#484f58] italic">Tanlanmagan</span>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[#8b949e]">Vaqt</span>
                {selectedSlot ? (
                  <span className="text-sm text-[#ecad0a] font-medium mono">{selectedSlot}</span>
                ) : (
                  <span className="text-xs text-[#484f58] italic">Tanlanmagan</span>
                )}
              </div>

              {selectedService && (
                <>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#8b949e]">Davomiyligi</span>
                    <span className="text-sm text-[#e6edf3] mono">{selectedService.duration} daqiqa</span>
                  </div>

                  <div className="h-px bg-[#30363d] my-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8b949e]">Narx</span>
                    <span className="mono text-base font-bold text-[#ecad0a]">
                      {selectedService.price.toLocaleString()} so'm
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              <Button
                variant="primary"
                className="w-full"
                disabled={!selectedService || !selectedSlot}
                isLoading={bookingLoading}
                onClick={handleConfirm}
              >
                {!selectedService || !selectedSlot ? 'Xizmat va vaqt tanlang' : 'Bronni tasdiqlash'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
