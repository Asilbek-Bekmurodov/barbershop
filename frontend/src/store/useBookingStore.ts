import { create } from 'zustand';
import api, { mapBooking } from '@/lib/api';
import { Booking, Barber, Service } from '@/types';

export interface CreateBookingDto {
  barberId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

interface BookingState {
  myBookings: Booking[];
  selectedBarber: Barber | null;
  selectedService: Service | null;
  selectedTimeSlot: string | null;
  isLoading: boolean;
  fetchMyBookings: () => Promise<void>;
  createBooking: (data: CreateBookingDto) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  setSelectedBarber: (barber: Barber | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedTimeSlot: (slot: string | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  myBookings: [],
  selectedBarber: null,
  selectedService: null,
  selectedTimeSlot: null,
  isLoading: false,

  fetchMyBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/bookings/my');
      set({ myBookings: response.data.data.map(mapBooking), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createBooking: async (data: CreateBookingDto) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/bookings', data);
      const newBooking: Booking = mapBooking(response.data.data);
      set((state) => ({
        myBookings: [...state.myBookings, newBooking],
        isLoading: false,
        selectedBarber: null,
        selectedService: null,
        selectedTimeSlot: null,
      }));
    } catch {
      set({ isLoading: false });
      throw new Error('Bron yaratishda xatolik');
    }
  },

  cancelBooking: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(`/bookings/${id}`, { status: 'cancelled' });
      const cancelledBooking = mapBooking(response.data.data);
      set((state) => ({
        myBookings: state.myBookings.map((b) =>
          b.id === id ? cancelledBooking : b
        ),
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false });
      throw new Error('Bronni bekor qilishda xatolik');
    }
  },

  setSelectedBarber: (barber) => set({ selectedBarber: barber }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
}));
