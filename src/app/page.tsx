"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  cambiarEstadoPelicula,
  eliminarPelicula,
} from "@/redux/slices/peliculasSlice";
import type { Pelicula } from "@/types/pelicula";
import Dashboard from "@/componentes/Dashboard";
import FormularioPelicula from "@/componentes/FormularioPelicula";
import TablaPeliculas from "@/componentes/TablaPeliculas";
import FormularioReserva from "@/componentes/FormularioReserva";
import FormularioFuncion from "@/componentes/FormularioFuncion";
import Buscador from "@/componentes/Buscador";
import Filtros from "@/componentes/Filtros";

type Vista = "dashboard" | "peliculas" | "reservas" | "asientos";

export default function Home() {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector((state) => state.peliculas.items);
  const salas = useAppSelector((state) => state.salas.items);

  const [vista, setVista] = useState<Vista>("dashboard");
  const [editando, setEditando] = useState<Pelicula | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("");
  const [clasificacion, setClasificacion] = useState("");
  const [sala, setSala] = useState("");
  const [estado, setEstado] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const peliculasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return peliculas.filter((pelicula) => {
      const salaNombre =
        salas.find((item) => item.id === pelicula.salaId)?.nombre ?? "";

      const coincideBusqueda =
        !termino ||
        pelicula.nombre.toLowerCase().includes(termino) ||
        pelicula.genero.toLowerCase().includes(termino) ||
        pelicula.clasificacion.toLowerCase().includes(termino) ||
        salaNombre.toLowerCase().includes(termino);

      return (
        coincideBusqueda &&
        (!genero || pelicula.genero === genero) &&
        (!clasificacion || pelicula.clasificacion === clasificacion) &&
        (!sala || pelicula.salaId === sala) &&
        (!estado || pelicula.estado === estado) &&
        (!soloDisponibles || pelicula.estado === "Disponible")
      );
    });
  }, [
    peliculas,
    salas,
    busqueda,
    genero,
    clasificacion,
    sala,
    estado,
    soloDisponibles,
  ]);

  const generos = [...new Set(peliculas.map((pelicula) => pelicula.genero))];
  const clasificaciones = [
    ...new Set(peliculas.map((pelicula) => pelicula.clasificacion)),
  ];

  const editar = (pelicula: Pelicula) => {
    setEditando(pelicula);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = (codigo: string) => {
    if (confirm("¿Deseas eliminar esta película?")) {
      dispatch(eliminarPelicula(codigo));
    }
  };

  const tituloVista = {
    dashboard: "Inicio",
    peliculas: "Gestión de Películas",
    reservas: "Reserva de Boletos",
    asientos: "Administración de Asientos",
  }[vista];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="marca">
          <div className="marca-icono">🎬</div>
          <div>
            <strong>CineNova</strong>
            <span>Panel administrativo</span>
          </div>
        </div>

        <nav className="menu-lateral">
          <button
            className={vista === "dashboard" ? "activo" : ""}
            onClick={() => setVista("dashboard")}
          >
            <span>🏠</span> Inicio
          </button>
          <button
            className={vista === "peliculas" ? "activo" : ""}
            onClick={() => setVista("peliculas")}
          >
            <span>🎬</span> Películas
          </button>
          <button
            className={vista === "reservas" ? "activo" : ""}
            onClick={() => setVista("reservas")}
          >
            <span>🎟️</span> Reservas
          </button>
          <button
            className={vista === "asientos" ? "activo" : ""}
            onClick={() => setVista("asientos")}
          >
            <span>💺</span> Asientos
          </button>
          <button
            className={vista === "dashboard" ? "activo-secundario" : ""}
            onClick={() => setVista("dashboard")}
          >
            <span>📊</span> Dashboard
          </button>
        </nav>

        <div className="sidebar-pie">
          <strong>Sistema conectado</strong>
          <span>Estado global con Redux Toolkit</span>
        </div>
      </aside>

      <section className="contenido-principal">
        <header className="topbar">
          <div>
            <p>SISTEMA DE GESTIÓN DE CINE</p>
            <h1>{tituloVista}</h1>
          </div>
          <div className="usuario">
            <div className="avatar">A</div>
            <div>
              <strong>Administrador</strong>
              <span>Sesión activa</span>
            </div>
          </div>
        </header>

        <div className="contenedor">
          {vista === "dashboard" && <Dashboard onNavigate={setVista} />}

          {vista === "peliculas" && (
            <>
              <FormularioFuncion />

              <FormularioPelicula
                peliculaEditando={editando}
                onFinalizar={() => setEditando(null)}
              />

              <section className="panel busqueda-panel">
                <Buscador valor={busqueda} onChange={setBusqueda} />
                <Filtros
                  genero={genero}
                  clasificacion={clasificacion}
                  sala={sala}
                  estado={estado}
                  disponibles={soloDisponibles}
                  generos={generos}
                  clasificaciones={clasificaciones}
                  salas={salas}
                  onGenero={setGenero}
                  onClasificacion={setClasificacion}
                  onSala={setSala}
                  onEstado={setEstado}
                  onDisponibles={setSoloDisponibles}
                />
              </section>

              <TablaPeliculas
                peliculas={peliculasFiltradas}
                salas={salas}
                onEditar={editar}
                onEliminar={eliminar}
                onEstado={(codigo) =>
                  dispatch(cambiarEstadoPelicula(codigo))
                }
              />
            </>
          )}

          {vista === "reservas" && <FormularioReserva />}

          {vista === "asientos" && (
            <>
              <section className="panel introduccion-modulo">
                <h2>Administración de Asientos</h2>
                <p>
                  Selecciona una película, función y asiento. Los cambios de
                  estado se reflejan inmediatamente en Redux.
                </p>
              </section>
              <FormularioReserva />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
