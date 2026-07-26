# CINEPLUS 

Sistema web para la gestión de carteleras, funciones, reserva de asientos y control de películas,
desarrollado como parte del primer desafio.

| Carnet   | Nombre                |
| -------- | --------------------- |
| HC220343 | Inmer Sebastian Hernandez Contreras |
| CF200830 | José Ángel Cuéllar Flores |

## Tecnologías Utilizadas

* **Framework:** Next.js (TypeScript)
* **Gestión de Estado:** Redux Toolkit
* **Estilos:** CSS Modules / Tailwind (según configuración global)
* **Control de Versiones:** Git y GitHub

---

## Estructura del Proyecto

El proyecto se encuentra modularizado bajo la siguiente arquitectura dentro de la carpeta `src/`:

```text
src/
├── app/                  
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/        
│   ├── Buscador.tsx
│   ├── Cartelera.tsx
│   ├── Dashboard.tsx
│   ├── Filtros.tsx
│   ├── FormularioFuncion.tsx
│   ├── FormularioPelicula.tsx
│   ├── FormularioReserva.tsx
│   ├── MapaAsientos.tsx
│   ├── PeliculaFila.tsx
│   └── TablaPeliculas.tsx
├── redux/             
│   ├── slices/
│   ├── hooks.ts
│   └── store.ts
└── types/               
    ├── asiento.ts
    ├── pelicula.ts
    └── reserva.ts
