import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asiento } from "@/types/asiento";

interface Sala {
  id: string;
  nombre: string;
}

interface SalasState {
  items: Sala[];
  asientos: Asiento[];
}

// Generación inicial de matriz de asientos (A1..D5) requerida por la guía
const generarAsientosIniciales = (): Asiento[] => {
  const filas = ['A', 'B', 'C', 'D'];
  const asientos: Asiento[] = [];

  filas.forEach((fila) => {
    for (let i = 1; i <= 5; i++) {
      asientos.push({
        id: `${fila}${i}`,
        fila,
        numero: i,
        estado: 'disponible',
      });
    }
  });

  return asientos;
};

const initialState: SalasState = {
  items: [
    { id: "S1", nombre: "Sala 1" },
    { id: "S2", nombre: "Sala 2" },
  ],
  asientos: generarAsientosIniciales(),
};

export const salasSlice = createSlice({
  name: 'salas',
  initialState,
  reducers: {
    // El Integrante B agregará aquí el control de estados de asientos
  },
});

export default salasSlice.reducer;