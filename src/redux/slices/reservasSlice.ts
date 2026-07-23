import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reserva } from '@/app/types/reserva';

interface ReservasState {
  historial: Reserva[];
}

const initialState: ReservasState = {
  historial: [],
};

export const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    // El Integrante B agregará aquí el registro de ventas
  },
});

export default reservasSlice.reducer;