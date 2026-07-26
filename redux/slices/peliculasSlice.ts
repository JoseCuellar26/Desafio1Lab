import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pelicula } from "@/types/pelicula";

interface PeliculasState {
  items: Pelicula[];
}

const initialState: PeliculasState = {
  items: [
    {
      codigo: "P001",
      nombre: "Interestelar",
      genero: "Ciencia ficción",
      duracion: 169,
      clasificacion: "PG-13",
      salaId: "S1",
      precio: 5.5,
      estado: "Disponible",
    },
    {
      codigo: "P002",
      nombre: "Coco",
      genero: "Animación",
      duracion: 105,
      clasificacion: "A",
      salaId: "S2",
      precio: 4.5,
      estado: "Disponible",
    },
    {
      codigo: "P003",
      nombre: "Gladiador",
      genero: "Acción",
      duracion: 155,
      clasificacion: "R",
      salaId: "S1",
      precio: 6,
      estado: "No disponible",
    },
  ],
};

const peliculasSlice = createSlice({
  name: "peliculas",
  initialState,
  reducers: {
    agregarPelicula(state, action: PayloadAction<Pelicula>) {
      state.items.push(action.payload);
    },
    editarPelicula(state, action: PayloadAction<Pelicula>) {
      const indice = state.items.findIndex(
        (pelicula) => pelicula.codigo === action.payload.codigo
      );
      if (indice !== -1) state.items[indice] = action.payload;
    },
    eliminarPelicula(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (pelicula) => pelicula.codigo !== action.payload
      );
    },
    cambiarEstadoPelicula(state, action: PayloadAction<string>) {
      const pelicula = state.items.find(
        (item) => item.codigo === action.payload
      );
      if (pelicula) {
        pelicula.estado =
          pelicula.estado === "Disponible"
            ? "No disponible"
            : "Disponible";
      }
    },
  },
});

export const {
  agregarPelicula,
  editarPelicula,
  eliminarPelicula,
  cambiarEstadoPelicula,
} = peliculasSlice.actions;

export default peliculasSlice.reducer;
