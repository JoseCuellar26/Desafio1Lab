export interface Reserva {
  id: string;
  codigoPelicula: string;
  nombrePelicula: string;
  sala: string;
  horarioFuncion: string;
  asientosReservados: string[]; // Ej: ['A1', 'A2']
  cantidadBoletos: number;
  totalPagar: number;
  nombreCliente: string;
  fechaReserva: string;
}