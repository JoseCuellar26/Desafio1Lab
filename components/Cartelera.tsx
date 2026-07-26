"use client";

import { useAppSelector } from "@/redux/hooks";
import type { Pelicula } from "@/types/pelicula";

interface CarteleraProps {
  onComprarBoleto: (codigoPelicula: string) => void;
}

export default function Cartelera({ onComprarBoleto }: CarteleraProps) {
  const peliculas = useAppSelector((state) => state.peliculas.items);

  // Filtrar solo películas que estén disponibles
  const peliculasDisponibles = peliculas.filter(
    (p) => p.estado === "Disponible"
  );

  return (
    <section className="panel cartelera-seccion">
      <div className="panel-titulo">
        <h2>🎬 Cartelera de Cine</h2>
        <p>Selecciona tu película favorita y compra tus entradas al instante.</p>
      </div>

      {peliculasDisponibles.length === 0 ? (
        <p className="vacio">No hay películas disponibles en cartelera en este momento.</p>
      ) : (
        <div className="grid-cartelera">
          {peliculasDisponibles.map((pelicula) => (
            <article className="tarjeta-pelicula" key={pelicula.codigo}>
              <div className="poster-placeholder">
                <span className="poster-icono">🎬</span>
                <span className="badge-clasificacion">{pelicula.clasificacion}</span>
              </div>

              <div className="info-pelicula">
                <h3>{pelicula.nombre}</h3>
                <p className="genero-duracion">
                  {pelicula.genero} • {pelicula.duracion} min
                </p>

                <div className="precio-accion">
                  <div className="precio">
                    <span>Precio</span>
                    <strong>${pelicula.precio.toFixed(2)}</strong>
                  </div>

                  <button
                    className="primario"
                    onClick={() => onComprarBoleto(pelicula.codigo)}
                  >
                    🎟️ Comprar boleto
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}