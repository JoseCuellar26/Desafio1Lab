"use client";

import { useAppSelector } from "@/redux/hooks";

type Vista = "inicio" | "peliculas" | "reservas" | "asientos" | "dashboard";

interface DashboardProps {
  onNavigate: (vista: Vista) => void;
  esSoloDashboard?: boolean;
}

export default function Dashboard({ onNavigate, esSoloDashboard = false }: DashboardProps) {
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const reservas = useAppSelector((state) => state.reservas.items);
  const salas = useAppSelector((state) => state.salas.items);

  const totalFunciones = salas.reduce(
    (acumulado, sala) => acumulado + sala.funciones.length,
    0
  );

  const totalAsientos = salas.reduce(
    (acumulado, sala) =>
      acumulado +
      sala.funciones.reduce(
        (subtotal, funcion) => subtotal + funcion.asientos.length,
        0
      ),
    0
  );

  const ocupados = salas.reduce(
    (acumulado, sala) =>
      acumulado +
      sala.funciones.reduce(
        (subtotal, funcion) =>
          subtotal +
          funcion.asientos.filter((asiento) => asiento.estado === "ocupado")
            .length,
        0
      ),
    0
  );

  const boletosVendidos = reservas.reduce(
    (acumulado, reserva) => acumulado + reserva.cantidadBoletos,
    0
  );

  const ingresos = reservas.reduce(
    (acumulado, reserva) => acumulado + reserva.total,
    0
  );

  const conteo = reservas.reduce<Record<string, number>>((acc, reserva) => {
    acc[reserva.peliculaNombre] =
      (acc[reserva.peliculaNombre] ?? 0) + reserva.cantidadBoletos;
    return acc;
  }, {});

  const peliculaMasReservada =
    Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Sin reservas";

  const proximasFunciones = salas
    .flatMap((sala) =>
      sala.funciones.map((funcion) => ({
        ...funcion,
        salaNombre: sala.nombre,
        peliculaNombre:
          peliculas.find((pelicula) => pelicula.codigo === funcion.peliculaCodigo)
            ?.nombre ?? "Película no encontrada",
      }))
    )
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 4);

  const tarjetas = [
    { titulo: "Total de películas", valor: peliculas.length, icono: "🎬" },
    { titulo: "Boletos vendidos", valor: boletosVendidos, icono: "🎟️" },
    { titulo: "Ingresos", valor: `$${ingresos.toFixed(2)}`, icono: "💵" },
    { titulo: "Funciones", valor: totalFunciones, icono: "🕒" },
    {
      titulo: "Asientos disponibles",
      valor: totalAsientos - ocupados,
      icono: "💺",
    },
    { titulo: "Asientos ocupados", valor: ocupados, icono: "🔒" },
  ];

  return (
    <section className="dashboard-pagina">
      <section className="bienvenida">
        <div className="bienvenida-icono">🎬</div>
        <div>
          <h2>Bienvenido al Sistema de Gestión de Cine</h2>
          <p>
            Administra películas, funciones, reservas y asientos desde un solo
            lugar. Toda la información se actualiza en tiempo real mediante
            Redux Toolkit.
          </p>
        </div>
      </section>

{/* Las tarjetas de estadísticas solo se mostrarán en la vista de Dashboard */}
      {esSoloDashboard && (
        <section className="dashboard-grid">
          {tarjetas.map((tarjeta) => (
            <article className="stat" key={tarjeta.titulo}>
              <div className="stat-icono">{tarjeta.icono}</div>
              <div>
                <span>{tarjeta.titulo}</span>
                <strong>{tarjeta.valor}</strong>
              </div>
            </article>
          ))}
        </section>
      )}

      {!esSoloDashboard && (
        <section className="seccion-dashboard">
          <div className="titulo-seccion">
            <h2>Módulos del sistema</h2>
            <p>Selecciona el módulo que deseas utilizar.</p>
          </div>

          <div className="modulos-grid">
            <article className="modulo-card modulo-azul">
              <div className="modulo-icono">🎬</div>
              <h3>Películas</h3>
              <p>Administra el catálogo completo de películas.</p>
              <ul>
                <li>Agregar, editar y eliminar</li>
                <li>Búsqueda dinámica</li>
                <li>Filtros y cambio de estado</li>
              </ul>
              <button onClick={() => onNavigate("peliculas")}>Ir a Películas</button>
            </article>

            <article className="modulo-card modulo-verde">
              <div className="modulo-icono">🎟️</div>
              <h3>Reservas</h3>
              <p>Gestiona la venta de boletos y reservas.</p>
              <ul>
                <li>Seleccionar película y función</li>
                <li>Calcular total automáticamente</li>
                <li>Confirmar la reserva</li>
              </ul>
              <button onClick={() => onNavigate("reservas")}>Ir a Reservas</button>
            </article>

            <article className="modulo-card modulo-morado">
              <div className="modulo-icono">💺</div>
              <h3>Asientos</h3>
              <p>Consulta y selecciona asientos por sala.</p>
              <ul>
                <li>Disponible</li>
                <li>Seleccionado</li>
                <li>Ocupado</li>
              </ul>
              <button onClick={() => onNavigate("asientos")}>Ir a Asientos</button>
            </article>
          </div>
        </section>
      )}

      <section className="dashboard-dos-columnas">
        <article className="panel">
          <div className="panel-titulo">
            <h2>Próximas funciones</h2>
          </div>

          {proximasFunciones.length === 0 ? (
            <p className="vacio">No hay funciones registradas.</p>
          ) : (
            <div className="funciones-lista">
              {proximasFunciones.map((funcion) => (
                <div className="funcion-item" key={funcion.id}>
                  <div>
                    <strong>{funcion.peliculaNombre}</strong>
                    <span>{funcion.salaNombre}</span>
                  </div>
                  <b>{funcion.hora}</b>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel pelicula-popular">
          <div className="panel-titulo">
            <h2>Película más reservada</h2>
          </div>
          <div className="popular-contenido">
            <span>🏆</span>
            <strong>{peliculaMasReservada}</strong>
            <p>
              {peliculaMasReservada === "Sin reservas"
                ? "Aún no existen reservas registradas."
                : "Es la película con mayor cantidad de boletos vendidos."}
            </p>
          </div>
        </article>
      </section>

      <section className="panel historial">
        <div className="panel-titulo">
          <h2>Historial de ventas</h2>
        </div>

        {reservas.length === 0 ? (
          <p className="vacio">Todavía no hay ventas registradas.</p>
        ) : (
          <div className="tabla-responsive">
            <table>
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Sala</th>
                  <th>Hora</th>
                  <th>Asientos</th>
                  <th>Boletos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.peliculaNombre}</td>
                    <td>{reserva.salaNombre}</td>
                    <td>{reserva.hora}</td>
                    <td>{reserva.asientos.join(", ")}</td>
                    <td>{reserva.cantidadBoletos}</td>
                    <td>${reserva.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}