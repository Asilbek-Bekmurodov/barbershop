export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barber' | 'client';
  avatar: string;
  styleCoins: number;
  isBlocked?: boolean;
}

export interface Barber {
  _id: string;
  userId: { name: string; email: string; avatar: string };
  bio: string;
  workingHours: { start: string; end: string };
  rating: number;
  isVerified: boolean;
  portfolio: string[];
}

export interface Service {
  _id: string;
  barberId: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export interface Booking {
  _id: string;
  clientId: { name: string; email: string; avatar: string };
  barberId: { _id: string; userId: { name: string; avatar: string } };
  serviceId: { name: string; price: number; duration: number };
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  styleCoinEarned: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  bookings?: BookingAction[];
  recommendations?: Recommendation[];
}

export interface BookingAction {
  barber_id: string;
  action: string;
  time: string;
  service_name: string;
}

export interface Recommendation {
  style: string;
  reason: string;
}

export interface FinanceStats {
  todayRevenue: number;
  weeklyRevenue: number;
  totalRevenue: number;
  totalClients: number;
  todayBookings: number;
  completedBookings: number;
  expenses: Expense[];
  totalExpenses: number;
  netProfit: number;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalBarbers: number;
  totalBookings: number;
  todayBookings: number;
  bookingStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  recentBookings: Booking[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'barber' | 'client';
  avatar: string;
  styleCoins: number;
  isBlocked: boolean;
  barberId?: string;
  barberInfo?: {
    _id: string;
    isVerified: boolean;
  };
}
