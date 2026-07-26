import type { Pelicula } from "@/types/pelicula";

interface PeliculaFilaProps {
  pelicula: Pelicula;
  salaNombre: string;
  onEditar: (pelicula: Pelicula) => void;
  onEliminar: (codigo: string) => void;
  onEstado: (codigo: string) => void;
}

export default function PeliculaFila({
  pelicula,
  salaNombre,
  onEditar,
  onEliminar,
  onEstado,
}: PeliculaFilaProps) {
  return (
    <tr>
      <td>{pelicula.codigo}</td>
      <td>{pelicula.nombre}</td>
      <td>{pelicula.genero}</td>
      <td>{pelicula.duracion} min</td>
      <td>{pelicula.clasificacion}</td>
      <td>{salaNombre}</td>
      <td>${pelicula.precio.toFixed(2)}</td>
      <td>
        <button
          className={`estado ${pelicula.estado === "Disponible" ? "ok" : "off"}`}
          onClick={() => onEstado(pelicula.codigo)}
        >
          {pelicula.estado}
        </button>
      </td>
      <td className="acciones-fila">
        <button className="editar" onClick={() => onEditar(pelicula)}>
          Editar
        </button>
        <button className="eliminar" onClick={() => onEliminar(pelicula.codigo)}>
          Eliminar
        </button>
      </td>
    </tr>
  );
}
