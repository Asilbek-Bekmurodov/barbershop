'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './TimeSlotGrid.module.css';

interface TimeSlotGridProps {
  barberId: string;
  selectedDate: string;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  serviceDuration?: number;
}

const SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  barberId,
  selectedDate,
  selectedSlot,
  onSelectSlot,
  serviceDuration = 60,
}) => {
  const { myBookings } = useSelector((state: RootState) => state.booking);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedDate || !barberId) return;

    const booked = new Set<string>();

    myBookings.forEach((booking) => {
      if (
        booking.barberId?._id === barberId &&
        (booking.status === 'pending' ||
          booking.status === 'confirmed' ||
          booking.status === 'in_progress')
      ) {
        const startDate = new Date(booking.startTime);
        const bookingDate = startDate.toISOString().split('T')[0];
        if (bookingDate === selectedDate) {
          const hour = startDate.getHours().toString().padStart(2, '0');
          const minute = startDate.getMinutes().toString().padStart(2, '0');
          booked.add(`${hour}:${minute}`);
        }
      }
    });

    setBookedSlots(booked);
  }, [myBookings, barberId, selectedDate]);

  const isSlotBooked = (slot: string) => bookedSlots.has(slot);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Vaqt tanlang</div>
      <div className={styles.grid}>
        {SLOTS.map((slot) => {
          const booked = isSlotBooked(slot);
          const selected = selectedSlot === slot;
          return (
            <button
              key={slot}
              className={[
                styles.slot,
                booked ? styles.slotBooked : styles.slotAvailable,
                selected && !booked ? styles.slotSelected : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={booked}
              onClick={() => !booked && onSelectSlot(slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={[styles.legendDot, styles.legendDotAvailable].join(' ')} />
          <span>Bo&apos;sh</span>
        </div>
        <div className={styles.legendItem}>
          <div className={[styles.legendDot, styles.legendDotSelected].join(' ')} />
          <span>Tanlangan</span>
        </div>
        <div className={styles.legendItem}>
          <div className={[styles.legendDot, styles.legendDotBooked].join(' ')} />
          <span>Band</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
