'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../src/store';
import { setBookings, addBooking } from '../../../../src/store/bookingSlice';
import api from '../../../../src/lib/api';
import { Barber, Service, Booking } from '../../../../src/types';
import TimeSlotGrid from '../../../../src/components/booking/TimeSlotGrid';
import LoadingSpinner from '../../../../src/components/ui/LoadingSpinner';
import styles from './booking.module.css';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { myBookings } = useSelector((state: RootState) => state.booking);

  const barberId = params.id as string;

  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberRes, servicesRes, bookingsRes] = await Promise.all([
          api.get(`/barbers/${barberId}`),
          api.get(`/services/${barberId}`),
          api.get('/bookings/my'),
        ]);

        setBarber(barberRes.data.data);
        setServices(servicesRes.data.data);
        dispatch(setBookings(bookingsRes.data.data));
      } catch {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    if (barberId) {
      fetchData();
    }
  }, [barberId, dispatch]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const [hours, minutes] = selectedSlot.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await api.post('/bookings', {
        barberId,
        serviceId: selectedService,
        startTime: startTime.toISOString(),
      });

      dispatch(addBooking(response.data.data));
      setSuccess(true);
      setSelectedSlot(null);

      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Bron qilishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
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

  const selectedServiceData = services.find((s) => s._id === selectedService);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!barber) {
    return (
      <div className={styles.container}>
        <p style={{ color: 'var(--trim-red)', fontSize: 14 }}>Barber topilmadi</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/dashboard/barbers" className={styles.backLink}>
        &lt; Barberlar ro&apos;yxatiga qaytish
      </Link>

      <div className={styles.barberCard}>
        <div className={styles.avatar}>
          {barber.userId?.avatar ? (
            <img src={barber.userId.avatar} alt={barber.userId.name} className={styles.avatarImg} />
          ) : (
            getInitials(barber.userId?.name || 'B')
          )}
        </div>
        <div className={styles.barberInfo}>
          <div className={styles.barberName}>{barber.userId?.name || 'Barber'}</div>
          <div className={styles.barberRating}>* {barber.rating?.toFixed(1) || '5.0'} reyting</div>
          {barber.workingHours && (
            <div className={styles.barberHours}>
              Ish vaqti: {barber.workingHours.start} - {barber.workingHours.end}
            </div>
          )}
        </div>
      </div>

      {success && (
        <div className={styles.successBox}>
          <div className={styles.successTitle}>Bron muvaffaqiyatli yaratildi!</div>
          <div className={styles.successDesc}>Profilingizga yo&apos;naltirilmoqda...</div>
        </div>
      )}

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Xizmat tanlang</div>
        {services.length === 0 ? (
          <div className={styles.emptyServices}>Bu barberda xizmatlar mavjud emas</div>
        ) : (
          <div className={styles.servicesList}>
            {services.map((service) => (
              <label
                key={service._id}
                className={[
                  styles.serviceOption,
                  selectedService === service._id ? styles.serviceOptionSelected : '',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="service"
                  value={service._id}
                  checked={selectedService === service._id}
                  onChange={() => setSelectedService(service._id)}
                  className={styles.serviceRadio}
                />
                <div className={styles.serviceDetails}>
                  <div className={styles.serviceName}>{service.name}</div>
                  {service.description && (
                    <div className={styles.serviceDesc}>{service.description}</div>
                  )}
                </div>
                <div className={styles.serviceMeta}>
                  <span className={styles.servicePrice}>{service.price.toLocaleString()} so&apos;m</span>
                  <span className={styles.serviceDuration}>{service.duration} min</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Sana tanlang</div>
        <input
          type="date"
          className={styles.dateInput}
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
        />
      </div>

      {selectedDate && (
        <div className={styles.section}>
          <TimeSlotGrid
            barberId={barberId}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            serviceDuration={selectedServiceData?.duration}
          />
        </div>
      )}

      {selectedService && selectedDate && selectedSlot && (
        <div className={styles.summary}>
          <div className={styles.summaryTitle}>Bron xulosasi</div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Barber</span>
            <span className={styles.summaryValue}>{barber.userId?.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Xizmat</span>
            <span className={styles.summaryValue}>{selectedServiceData?.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Narx</span>
            <span className={styles.summaryValue}>
              {selectedServiceData?.price.toLocaleString()} so&apos;m
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Sana va vaqt</span>
            <span className={styles.summaryValue}>
              {selectedDate} {selectedSlot}
            </span>
          </div>
        </div>
      )}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={submitting || !selectedService || !selectedDate || !selectedSlot || success}
      >
        {submitting ? 'Bron qilinmoqda...' : 'Bron qilish'}
      </button>
    </div>
  );
}
