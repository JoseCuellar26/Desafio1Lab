import type { Pelicula } from "@/types/pelicula";
import PeliculaFila from "./PeliculaFila";

interface TablaPeliculasProps {
  peliculas: Pelicula[];
  salas: { id: string; nombre: string }[];
  onEditar: (pelicula: Pelicula) => void;
  onEliminar: (codigo: string) => void;
  onEstado: (codigo: string) => void;
}

export default function TablaPeliculas(props: TablaPeliculasProps) {
  return (
    <div className="panel tabla-panel">
      <div className="panel-titulo">
        <h2>Películas registradas</h2>
        <span>{props.peliculas.length} resultado(s)</span>
      </div>

      <div className="tabla-responsive">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Género</th>
              <th>Duración</th>
              <th>Clasificación</th>
              <th>Sala</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {props.peliculas.map((pelicula) => (
              <PeliculaFila
                key={pelicula.codigo}
                pelicula={pelicula}
                salaNombre={
                  props.salas.find((sala) => sala.id === pelicula.salaId)?.nombre ??
                  pelicula.salaId
                }
                onEditar={props.onEditar}
                onEliminar={props.onEliminar}
                onEstado={props.onEstado}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
