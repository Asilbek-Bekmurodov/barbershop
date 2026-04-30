import axios from 'axios';
import { Barber, Booking, Service, User } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('trimflow_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('trimflow_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord =>
  value && typeof value === 'object' ? (value as ApiRecord) : {};

const getId = (value: unknown): string => {
  if (typeof value === 'string') return value;
  const record = asRecord(value);
  const id = record.id ?? record._id;
  return typeof id === 'string' ? id : '';
};

const getString = (record: ApiRecord, key: string, fallback = ''): string => {
  const value = record[key];
  return typeof value === 'string' ? value : fallback;
};

const getNumber = (record: ApiRecord, key: string, fallback = 0): number => {
  const value = record[key];
  return typeof value === 'number' ? value : fallback;
};

export const mapUser = (raw: unknown): User => {
  const record = asRecord(raw);

  return {
    id: getId(record),
    name: getString(record, 'name'),
    email: getString(record, 'email'),
    role: getString(record, 'role', 'client') as User['role'],
    avatar: getString(record, 'avatar'),
    styleCoins: getNumber(record, 'styleCoins'),
    createdAt: getString(record, 'createdAt'),
  };
};

export const mapService = (raw: unknown): Service => {
  const record = asRecord(raw);

  return {
    id: getId(record),
    barberId: getId(record.barberId),
    name: getString(record, 'name'),
    description: getString(record, 'description'),
    price: getNumber(record, 'price'),
    duration: getNumber(record, 'duration'),
  };
};

export const mapBarber = (raw: unknown, services: Service[] = []): Barber => {
  const record = asRecord(raw);
  const user = asRecord(record.userId);
  const workingHours = asRecord(record.workingHours);
  const rating = getNumber(record, 'rating');
  const totalReviews = getNumber(record, 'totalReviews');

  return {
    id: getId(record),
    userId: getId(user),
    name: getString(user, 'name', 'Barber'),
    avatar: getString(user, 'avatar'),
    bio: getString(record, 'bio'),
    services,
    workingHours: {
      start: getString(workingHours, 'start', '08:00'),
      end: getString(workingHours, 'end', '18:00'),
    },
    rating,
    reviewCount: totalReviews,
    isVerified: Boolean(record.isVerified),
    isAvailable: Boolean(record.isVerified),
  };
};

export const mapBooking = (raw: unknown): Booking => {
  const record = asRecord(raw);
  const client = asRecord(record.clientId);
  const barber = asRecord(record.barberId);
  const barberUser = asRecord(barber.userId);
  const service = asRecord(record.serviceId);
  const styleCoins = record.styleCoinEarned ?? record.styleCoinsEarned;

  return {
    id: getId(record),
    clientId: getId(client),
    clientName: getString(client, 'name'),
    barberId: getId(barber),
    barberName: getString(barberUser, 'name', 'Barber'),
    serviceId: getId(service),
    serviceName: getString(service, 'name'),
    startTime: getString(record, 'startTime'),
    endTime: getString(record, 'endTime'),
    status: getString(record, 'status', 'pending') as Booking['status'],
    styleCoinsEarned: typeof styleCoins === 'number' ? styleCoins : 0,
    price: getNumber(service, 'price'),
    createdAt: getString(record, 'createdAt'),
  };
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = asRecord(error.response?.data);
    return getString(data, 'message', fallback);
  }

  return fallback;
};
