'use client';

import React from 'react';
import { TimeSlot } from '@/types';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  onSelect?: (slot: TimeSlot) => void;
  readOnly?: boolean;
  selectedSlot?: string | null;
}

export default function TimeSlotGrid({
  slots,
  onSelect,
  readOnly = false,
  selectedSlot = null,
}: TimeSlotGridProps) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isCurrentSlot = (time: string) => {
    const [h] = time.split(':').map(Number);
    return h === currentHour;
  };

  const isPastSlot = (time: string) => {
    const [h] = time.split(':').map(Number);
    return h < currentHour || (h === currentHour && currentMinute > 50);
  };

  const getSlotClasses = (slot: TimeSlot) => {
    const base =
      'relative flex flex-col items-center justify-center h-16 rounded-lg border text-xs mono transition-all duration-200 ';

    if (selectedSlot === slot.time) {
      return base + 'bg-[#ecad0a]/20 border-[#ecad0a] text-[#ecad0a] ring-1 ring-[#ecad0a]';
    }
    if (isCurrentSlot(slot.time)) {
      return (
        base +
        'border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950] ' +
        (!readOnly && slot.isAvailable ? 'cursor-pointer hover:bg-[#3fb950]/20' : '')
      );
    }
    if (!slot.isAvailable) {
      return base + 'bg-[#30363d]/60 border-[#30363d] text-[#484f58] cursor-not-allowed';
    }
    if (isPastSlot(slot.time)) {
      return base + 'bg-transparent border-[#21262d] text-[#484f58] cursor-not-allowed opacity-50';
    }
    return (
      base +
      'bg-transparent border-[#209dd7]/40 text-[#209dd7] ' +
      (!readOnly ? 'cursor-pointer hover:bg-[#209dd7]/10 hover:border-[#209dd7]' : '')
    );
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          disabled={readOnly || !slot.isAvailable || isPastSlot(slot.time)}
          onClick={() => !readOnly && slot.isAvailable && onSelect?.(slot)}
          className={getSlotClasses(slot)}
          title={slot.booking ? `${slot.booking.clientName} — ${slot.booking.serviceName}` : undefined}
        >
          {isCurrentSlot(slot.time) && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
          )}
          <span className="font-bold">{slot.time}</span>
          {slot.booking ? (
            <span className="text-[10px] text-[#8b949e] mt-0.5 truncate max-w-full px-1">
              {slot.booking.clientName}
            </span>
          ) : slot.isAvailable && !isPastSlot(slot.time) ? (
            <span className="text-[10px] mt-0.5 opacity-70">Bo'sh</span>
          ) : (
            <span className="text-[10px] mt-0.5 opacity-40">—</span>
          )}
        </button>
      ))}
    </div>
  );
}
