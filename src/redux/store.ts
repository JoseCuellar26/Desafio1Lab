import { configureStore } from "@reduxjs/toolkit";
import peliculasReducer from "./slices/peliculasSlice";
import reservasReducer from "./slices/reservasSlice";
import salasReducer from "./slices/salasSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      peliculas: peliculasReducer,
      reservas: reservasReducer,
      salas: salasReducer,
    },
  });

// Exportamos una instancia por defecto para uso en la aplicación
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
