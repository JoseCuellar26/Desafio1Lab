"use client";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarReserva } from "@/redux/slices/reservasSlice";
import {
  limpiarSeleccionados,
  seleccionarAsiento,
} from "@/redux/slices/salasSlice";
import MapaAsientos from "./MapaAsientos";
import type { Reserva } from "@/types/reserva";

interface FormularioReservaProps {
  peliculaInicialCodigo?: string;
}

export default function FormularioReserva({
  peliculaInicialCodigo,
}: FormularioReservaProps) {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const salas = useAppSelector((state) => state.salas.items);

  // Filtrar solo las películas que tienen estado 'Disponible'
  const disponibles = peliculas.filter(
    (pelicula) => pelicula.estado === "Disponible"
  );

  // Estado local para la película seleccionada
  const [peliculaCodigo, setPeliculaCodigo] = useState(
    peliculaInicialCodigo || disponibles[0]?.codigo || ""
  );

  // Sincronizar el estado si el usuario viene desde el botón "Comprar boleto" de la Cartelera
  useEffect(() => {
    if (peliculaInicialCodigo) {
      setPeliculaCodigo(peliculaInicialCodigo);
    }
  }, [peliculaInicialCodigo]);

  const pelicula = peliculas.find((item) => item.codigo === peliculaCodigo);

  const [funcionId, setFuncionId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Buscar todas las funciones asociadas a la película en cualquiera de las salas
  const funcionesDisponibles = useMemo(() => {
    if (!peliculaCodigo) return [];

    return salas.flatMap((sala) =>
      sala.funciones
        .filter((f) => f.peliculaCodigo === peliculaCodigo)
        .map((f) => ({
          ...f,
          salaId: sala.id,
          salaNombre: sala.nombre,
        }))
    );
  }, [salas, peliculaCodigo]);

  // Identificar automáticamente la función y sala seleccionadas según la opción de horario
  const funcionSeleccionada = useMemo(() => {
    return funcionesDisponibles.find((f) => f.id === funcionId);
  }, [funcionesDisponibles, funcionId]);

  const salaSeleccionada = useMemo(() => {
    if (!funcionSeleccionada) return null;
    return salas.find((s) => s.id === funcionSeleccionada.salaId) ?? null;
  }, [salas, funcionSeleccionada]);

  // Extraer los IDs de los asientos que están actualmente en estado 'seleccionado'
  const seleccionados =
    funcionSeleccionada?.asientos
      .filter((asiento) => asiento.estado === "seleccionado")
      .map((asiento) => asiento.id) ?? [];

  // Manejar cambio de película y limpiar asientos seleccionados previamente
  const seleccionarPelicula = (codigo: string) => {
    if (salaSeleccionada && funcionId) {
      dispatch(
        limpiarSeleccionados({ salaId: salaSeleccionada.id, funcionId })
      );
    }

    setPeliculaCodigo(codigo);
    setFuncionId("");
    setMensaje("");
    setError("");
  };

  // Manejar cambio de función/horario y limpiar asientos del horario anterior
  const seleccionarFuncion = (nuevaFuncionId: string) => {
    if (salaSeleccionada && funcionId && funcionId !== nuevaFuncionId) {
      dispatch(
        limpiarSeleccionados({ salaId: salaSeleccionada.id, funcionId })
      );
    }

    setFuncionId(nuevaFuncionId);
    setMensaje("");
    setError("");
  };

  // Cálculo dinámico del importe total a pagar
  const total = (pelicula?.precio ?? 0) * seleccionados.length;

  // Confirmar la reserva y enviarla al Store global de Redux
  const confirmar = () => {
    setError("");
    setMensaje("");

    if (!pelicula) {
      setError("Debes seleccionar una película.");
      return;
    }
    if (!funcionSeleccionada || !salaSeleccionada) {
      setError("Debes seleccionar un horario de función.");
      return;
    }
    if (seleccionados.length === 0) {
      setError("Debes seleccionar al menos un asiento en el mapa.");
      return;
    }

    const hayOcupado = funcionSeleccionada.asientos.some(
      (asiento) =>
        seleccionados.includes(asiento.id) && asiento.estado === "ocupado"
    );

    if (hayOcupado) {
      setError("Uno de los asientos seleccionados ya se encuentra ocupado.");
      return;
    }

    const reserva: Reserva = {
      id: crypto.randomUUID(),
      peliculaCodigo: pelicula.codigo,
      peliculaNombre: pelicula.nombre,
      salaId: salaSeleccionada.id,
      salaNombre: salaSeleccionada.nombre,
      funcionId: funcionSeleccionada.id,
      hora: funcionSeleccionada.hora,
      asientos: seleccionados,
      cantidadBoletos: seleccionados.length,
      precioUnitario: pelicula.precio,
      total,
      fecha: new Date().toISOString(),
    };

    // Al guardar la reserva, salasSlice la detecta automáticamente y cambia el estado de los asientos a 'ocupado'
    dispatch(agregarReserva(reserva));

    setMensaje(
      `¡Reserva confirmada con éxito! Total pagado: $${total.toFixed(2)}`
    );
  };

  return (
    <section className="panel">
      <div className="panel-titulo">
        <h2>Reserva de boletos</h2>
      </div>

      <div className="grid-reserva">
        <div>
          {/* Selector de Película */}
          <div className="control">
            <label>Película</label>
            <select
              value={peliculaCodigo}
              onChange={(e) => seleccionarPelicula(e.target.value)}
            >
              {disponibles.map((item) => (
                <option key={item.codigo} value={item.codigo}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Horario (Transparente para Salas) */}
          <div className="control">
            <label>Horario de Función</label>
            <select
              value={funcionId}
              onChange={(e) => seleccionarFuncion(e.target.value)}
            >
              <option value="">Selecciona un horario</option>
              {funcionesDisponibles.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.hora}
                </option>
              ))}
            </select>
          </div>

          {/* Resumen dinámico de la venta */}
          <div className="resumen-compra">
            <p>
              Boletos: <strong>{seleccionados.length}</strong>
            </p>
            <p>
              Precio unitario:{" "}
              <strong>${(pelicula?.precio ?? 0).toFixed(2)}</strong>
            </p>
            <p>
              Total: <strong>${total.toFixed(2)}</strong>
            </p>
            <p>
              Asientos:{" "}
              <strong>{seleccionados.join(", ") || "Ninguno"}</strong>
            </p>
          </div>

          {error && <p className="mensaje error">{error}</p>}
          {mensaje && <p className="mensaje exito">{mensaje}</p>}

          <button className="primario ancho" onClick={confirmar}>
            Confirmar reserva
          </button>
        </div>

        {/* Componente del mapa interactivo de asientos */}
        <MapaAsientos
          asientos={funcionSeleccionada?.asientos ?? []}
          seleccionados={seleccionados}
          onSeleccionar={(asientoId) => {
            if (salaSeleccionada && funcionSeleccionada) {
              dispatch(
                seleccionarAsiento({
                  salaId: salaSeleccionada.id,
                  funcionId: funcionSeleccionada.id,
                  asientoId,
                })
              );
            }
          }}
        />
      </div>
    </section>
  );
}