"use client";

import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarFuncion } from "@/redux/slices/salasSlice";

export default function FormularioFuncion() {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const salas = useAppSelector((state) => state.salas.items);

  const [peliculaCodigo, setPeliculaCodigo] = useState(
    peliculas[0]?.codigo ?? ""
  );
  const pelicula = peliculas.find(
    (item) => item.codigo === peliculaCodigo
  );
  const [salaId, setSalaId] = useState(salas[0]?.id ?? "");
  const [hora, setHora] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const seleccionarPelicula = (codigo: string) => {
    setPeliculaCodigo(codigo);
    setSalaId((actual) => actual || (salas[0]?.id ?? ""));
  };

  const guardar = (evento: FormEvent) => {
    evento.preventDefault();
    setError("");
    setMensaje("");

    if (!peliculaCodigo || !salaId || !hora || !fecha) {
      setError("Selecciona película, sala, fecha y horario.");
      return;
    }

    const sala = salas.find((item) => item.id === salaId);
    if (!sala) {
      setError("La sala seleccionada no existe.");
      return;
    }

    const duplicada = sala.funciones.some(
      (funcion) =>
        funcion.fecha === fecha && funcion.hora === hora
    );

    if (duplicada) {
      setError("Ya existe una función para esa sala, fecha y hora.");
      return;
    }

    dispatch(
      agregarFuncion({
        salaId,
        funcion: {
          id: crypto.randomUUID(),
          peliculaCodigo,
          hora,
          fecha,
        },
      })
    );

    setHora("");
    setFecha("");
    setMensaje("Función registrada correctamente.");
  };

  return (
    <form className="panel" onSubmit={guardar}>
      <div className="panel-titulo">
        <h2>Registrar función</h2>
      </div>

      <div className="grid-funcion">
        <div className="control">
          <label>Película</label>
          <select
            value={peliculaCodigo}
            onChange={(e) => seleccionarPelicula(e.target.value)}
          >
            {peliculas.map((item) => (
              <option key={item.codigo} value={item.codigo}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="control">
          <label>Sala</label>
          <select value={salaId} onChange={(e) => setSalaId(e.target.value)}>
            {salas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="control">
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="control">
          <label>Horario</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>

        <button className="primario boton-funcion" type="submit">
          Agregar función
        </button>
      </div>

      {error && <p className="mensaje error">{error}</p>}
      {mensaje && <p className="mensaje exito">{mensaje}</p>}
    </form>
  );
}
