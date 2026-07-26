export type EstadoAsiento = "disponible" | "seleccionado" | "ocupado";

export interface Asiento {
  id: string;
  estado: EstadoAsiento;
}

export interface Funcion {
  id: string;
  peliculaCodigo: string;
  hora: string;
  fecha: string;
  asientos: Asiento[];
}

export interface Sala {
  id: string;
  nombre: string;
  funciones: Funcion[];
}
