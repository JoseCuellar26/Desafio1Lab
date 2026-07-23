
export interface Pelicula {
  codigo: string;
  nombre: string;
  genero: string;
  duracion: number; // En minutos
  clasificacion: string; // Ej: 'G', 'PG-13', 'R'
  salaAsignada: string;
  precioEntrada: number;
  estado: 'Disponible' | 'No disponible';
}