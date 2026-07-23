import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pelicula } from '@/app/types/pelicula';

interface PeliculasState {
  lista: Pelicula[];
  busquedaNombre: string;
  filtroGenero: string;
  filtroClasificacion: string;
  filtroSala: string;
  filtroEstado: string;
}

const initialState: PeliculasState = {
  lista: [
    // Datos de prueba iniciales opcionales
    {
      codigo: 'PEL-001',
      nombre: 'Avengers: Endgame',
      genero: 'Acción',
      duracion: 180,
      clasificacion: 'PG-13',
      salaAsignada: 'Sala 1',
      precioEntrada: 5.00,
      estado: 'Disponible',
    },
  ],
  busquedaNombre: '',
  filtroGenero: '',
  filtroClasificacion: '',
  filtroSala: '',
  filtroEstado: '',
};

export const peliculasSlice = createSlice({
  name: 'peliculas',
  initialState,
  reducers: {
    // El Integrante A agregará aquí las acciones CRUD y de filtros
    setBusquedaNombre: (state, action: PayloadAction<string>) => {
      state.busquedaNombre = action.payload;
    },
  },
});

export const { setBusquedaNombre } = peliculasSlice.actions;
export default peliculasSlice.reducer;