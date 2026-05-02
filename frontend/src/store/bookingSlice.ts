import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../types';

interface BookingState {
  myBookings: Booking[];
  isLoading: boolean;
}

const initialState: BookingState = {
  myBookings: [],
  isLoading: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.myBookings = action.payload;
    },
    addBooking(state, action: PayloadAction<Booking>) {
      state.myBookings.unshift(action.payload);
    },
    updateBooking(state, action: PayloadAction<Booking>) {
      const index = state.myBookings.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.myBookings[index] = action.payload;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setBookings, addBooking, updateBooking, setLoading } = bookingSlice.actions;
export default bookingSlice.reducer;
