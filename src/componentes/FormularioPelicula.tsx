"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarPelicula, editarPelicula } from "@/redux/slices/peliculasSlice";
import type { Pelicula } from "@/types/pelicula";

interface FormularioPeliculaProps {
  peliculaEditando: Pelicula | null;
  onFinalizar: () => void;
}

const vacia: Pelicula = {
  codigo: "",
  nombre: "",
  genero: "",
  duracion: 90,
  clasificacion: "",
  salaId: "S1",
  precio: 0,
  estado: "Disponible",
};

export default function FormularioPelicula({
  peliculaEditando,
  onFinalizar,
}: FormularioPeliculaProps) {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const salas = useAppSelector((state) => state.salas.items);
  const [formulario, setFormulario] = useState<Pelicula>(vacia);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormulario(peliculaEditando ?? vacia);
    setError("");
  }, [peliculaEditando]);

  const cambiar = <K extends keyof Pelicula>(
    campo: K,
    valor: Pelicula[K]
  ) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const guardar = (evento: FormEvent) => {
    evento.preventDefault();
    setError("");

    if (!formulario.codigo.trim()) {
      setError("El código es obligatorio.");
      return;
    }
    if (!formulario.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (formulario.precio < 0) {
      setError("El precio no puede ser negativo.");
      return;
    }
    if (formulario.duracion <= 0) {
      setError("La duración debe ser mayor que cero.");
      return;
    }

    const codigoDuplicado = peliculas.some(
      (pelicula) =>
        pelicula.codigo.toLowerCase() === formulario.codigo.toLowerCase() &&
        pelicula.codigo !== peliculaEditando?.codigo
    );

    if (codigoDuplicado) {
      setError("Ya existe una película con ese código.");
      return;
    }

    if (peliculaEditando) {
      dispatch(editarPelicula(formulario));
    } else {
      dispatch(agregarPelicula(formulario));
    }

    setFormulario(vacia);
    onFinalizar();
  };

  return (
    <form className="panel formulario" onSubmit={guardar}>
      <div className="panel-titulo">
        <h2>{peliculaEditando ? "Editar película" : "Agregar película"}</h2>
      </div>

      <div className="grid-form">
        <div className="control">
          <label>Código</label>
          <input
            value={formulario.codigo}
            disabled={Boolean(peliculaEditando)}
            onChange={(e) => cambiar("codigo", e.target.value)}
          />
        </div>

        <div className="control">
          <label>Nombre</label>
          <input
            value={formulario.nombre}
            onChange={(e) => cambiar("nombre", e.target.value)}
          />
        </div>

        <div className="control">
          <label>Género</label>
          <input
            value={formulario.genero}
            onChange={(e) => cambiar("genero", e.target.value)}
          />
        </div>

        <div className="control">
          <label>Duración (minutos)</label>
          <input
            type="number"
            value={formulario.duracion}
            onChange={(e) => cambiar("duracion", Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Clasificación</label>
          <input
            value={formulario.clasificacion}
            onChange={(e) => cambiar("clasificacion", e.target.value)}
          />
        </div>

        <div className="control">
          <label>Sala asignada</label>
          <select
            value={formulario.salaId}
            onChange={(e) => cambiar("salaId", e.target.value)}
          >
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="control">
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            value={formulario.precio}
            onChange={(e) => cambiar("precio", Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Estado</label>
          <select
            value={formulario.estado}
            onChange={(e) =>
              cambiar(
                "estado",
                e.target.value as Pelicula["estado"]
              )
            }
          >
            <option>Disponible</option>
            <option>No disponible</option>
          </select>
        </div>
      </div>

      {error && <p className="mensaje error">{error}</p>}

      <div className="acciones">
        <button type="submit" className="primario">
          {peliculaEditando ? "Guardar cambios" : "Agregar película"}
        </button>
        {peliculaEditando && (
          <button type="button" className="secundario" onClick={onFinalizar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
