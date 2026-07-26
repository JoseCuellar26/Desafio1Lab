export interface Reserva {
  id: string;
  peliculaCodigo: string;
  peliculaNombre: string;
  salaId: string;
  salaNombre: string;
  funcionId: string;
  hora: string;
  asientos: string[];
  cantidadBoletos: number;
  precioUnitario: number;
  total: number;
  fecha: string;
}
