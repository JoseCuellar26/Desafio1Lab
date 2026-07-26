"use client";

import React from "react";

interface DashboardProps {
  onNavigate: (vista: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <section className="panel seccion-dashboard">
      <h2>Dashboard</h2>
      <p>Resumen rápido del sistema.</p>
      <button onClick={() => onNavigate("peliculas")}>Ir a Películas</button>
    </section>
  );
}
