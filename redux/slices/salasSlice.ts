import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sala, Funcion } from "@/types/asiento";
import { agregarReserva } from "./reservasSlice";

const crearAsientos = () => {
  const filas = ["A", "B", "C", "D"];
  return filas.flatMap((fila) =>
    Array.from({ length: 5 }, (_, indice) => ({
      id: `${fila}${indice + 1}`,
      estado: "disponible" as const,
    }))
  );
};

interface SalasState {
  items: Sala[];
}

const initialState: SalasState = {
  items: [
    {
      id: "S1",
      nombre: "Sala 1",
      funciones: [
        {
          id: "F1",
          peliculaCodigo: "P001",
          hora: "15:00",
          fecha: "2026-07-24",
          asientos: crearAsientos(),
        },
        {
          id: "F2",
          peliculaCodigo: "P001",
          hora: "18:30",
          fecha: "2026-07-24",
          asientos: crearAsientos(),
        },
        {
          id: "F3",
          peliculaCodigo: "P003",
          hora: "20:30",
          fecha: "2026-07-25",
          asientos: crearAsientos(),
        },
      ],
    },
    {
      id: "S2",
      nombre: "Sala 2",
      funciones: [
        {
          id: "F4",
          peliculaCodigo: "P002",
          hora: "14:00",
          fecha: "2026-07-24",
          asientos: crearAsientos(),
        },
        {
          id: "F5",
          peliculaCodigo: "P002",
          hora: "17:00",
          fecha: "2026-07-26",
          asientos: crearAsientos(),
        },
      ],
    },
  ],
};

const salasSlice = createSlice({
  name: "salas",
  initialState,
  reducers: {
    agregarFuncion(
      state,
      action: PayloadAction<{ salaId: string; funcion: Omit<Funcion, "asientos"> }>
    ) {
      const sala = state.items.find(
        (item) => item.id === action.payload.salaId
      );
      if (sala) {
        sala.funciones.push({
          ...action.payload.funcion,
          asientos: crearAsientos(),
        });
      }
    },
    seleccionarAsiento(
      state,
      action: PayloadAction<{
        salaId: string;
        funcionId: string;
        asientoId: string;
      }>
    ) {
      const sala = state.items.find(
        (item) => item.id === action.payload.salaId
      );
      const funcion = sala?.funciones.find(
        (item) => item.id === action.payload.funcionId
      );
      const asiento = funcion?.asientos.find(
        (item) => item.id === action.payload.asientoId
      );

      if (!asiento || asiento.estado === "ocupado") return;

      asiento.estado =
        asiento.estado === "seleccionado"
          ? "disponible"
          : "seleccionado";
    },
    limpiarSeleccionados(
      state,
      action: PayloadAction<{ salaId: string; funcionId: string }>
    ) {
      const sala = state.items.find((item) => item.id === action.payload.salaId);
      const funcion = sala?.funciones.find(
        (item) => item.id === action.payload.funcionId
      );
      funcion?.asientos.forEach((asiento) => {
        if (asiento.estado === "seleccionado") {
          asiento.estado = "disponible";
        }
      });
    },
    confirmarReservaAsientos(
      state,
      action: PayloadAction<{
        salaId: string;
        funcionId: string;
        asientosIds: string[];
      }>
    ) {
      const { salaId, funcionId, asientosIds } = action.payload;
      const sala = state.items.find((s) => s.id === salaId);
      const funcion = sala?.funciones.find((f) => f.id === funcionId);
      if (funcion) {
        funcion.asientos.forEach((asiento) => {
          if (asientosIds.includes(asiento.id)) {
            asiento.estado = "ocupado";
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Al despachar agregarReserva, los asientos de esa función pasan automáticamente a "ocupado"
    builder.addCase(agregarReserva, (state, action) => {
      const sala = state.items.find(
        (item) => item.id === action.payload.salaId
      );
      if (!sala) return;

      const funcion = sala.funciones.find(
        (item) => item.id === action.payload.funcionId
      );
      if (!funcion) return;

      funcion.asientos.forEach((asiento) => {
        if (action.payload.asientos.includes(asiento.id)) {
          asiento.estado = "ocupado";
        }
      });
    });
  },
});

export const {
  agregarFuncion,
  seleccionarAsiento,
  limpiarSeleccionados,
  confirmarReservaAsientos,
} = salasSlice.actions;

export default salasSlice.reducer;