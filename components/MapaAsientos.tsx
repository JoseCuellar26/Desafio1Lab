import type { Asiento } from "@/types/asiento";

interface MapaAsientosProps {
  asientos: Asiento[];
  seleccionados: string[];
  onSeleccionar: (id: string) => void;
}

export default function MapaAsientos({
  asientos,
  seleccionados,
  onSeleccionar,
}: MapaAsientosProps) {
  return (
    <div>
      <div className="pantalla">PANTALLA</div>
      <div className="mapa-asientos">
        {asientos.map((asiento) => {
          const seleccionado = seleccionados.includes(asiento.id);
          return (
            <button
              key={asiento.id}
              type="button"
              disabled={asiento.estado === "ocupado"}
              className={`asiento ${
                asiento.estado === "ocupado"
                  ? "ocupado"
                  : seleccionado
                    ? "seleccionado"
                    : "disponible"
              }`}
              onClick={() => onSeleccionar(asiento.id)}
            >
              {asiento.id}
            </button>
          );
        })}
      </div>
      <div className="leyenda">
        <span><i className="ley-disponible" />Disponible</span>
        <span><i className="ley-seleccionado" />Seleccionado</span>
        <span><i className="ley-ocupado" />Ocupado</span>
      </div>
    </div>
  );
}
