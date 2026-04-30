export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barber' | 'client';
  avatar?: string;
  styleCoins: number;
  createdAt?: string;
}

export interface WorkingHours {
  start: string; // "08:00"
  end: string; // "18:00"
}

export interface Barber {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  bio?: string;
  services: Service[];
  workingHours: WorkingHours;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  barberId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // minutes
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  startTime: string; // ISO date string
  endTime: string;
  status: BookingStatus;
  styleCoinsEarned: number;
  price: number;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string; // "08:00"
  isAvailable: boolean;
  booking?: {
    clientName: string;
    serviceName: string;
  };
}

export interface FinanceStats {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  styleCoinsIssued: number;
  topService: string;
  growthRate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
