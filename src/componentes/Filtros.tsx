interface FiltrosProps {
  genero: string;
  clasificacion: string;
  sala: string;
  estado: string;
  disponibles: boolean;
  generos: string[];
  clasificaciones: string[];
  salas: { id: string; nombre: string }[];
  onGenero: (valor: string) => void;
  onClasificacion: (valor: string) => void;
  onSala: (valor: string) => void;
  onEstado: (valor: string) => void;
  onDisponibles: (valor: boolean) => void;
}

export default function Filtros(props: FiltrosProps) {
  return (
    <div className="filtros">
      <div className="control">
        <label>Género</label>
        <select value={props.genero} onChange={(e) => props.onGenero(e.target.value)}>
          <option value="">Todos</option>
          {props.generos.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="control">
        <label>Clasificación</label>
        <select value={props.clasificacion} onChange={(e) => props.onClasificacion(e.target.value)}>
          <option value="">Todas</option>
          {props.clasificaciones.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="control">
        <label>Sala</label>
        <select value={props.sala} onChange={(e) => props.onSala(e.target.value)}>
          <option value="">Todas</option>
          {props.salas.map((item) => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
      </div>

      <div className="control">
        <label>Estado</label>
        <select value={props.estado} onChange={(e) => props.onEstado(e.target.value)}>
          <option value="">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="No disponible">No disponible</option>
        </select>
      </div>

      <label className="check">
        <input
          type="checkbox"
          checked={props.disponibles}
          onChange={(e) => props.onDisponibles(e.target.checked)}
        />
        Solo disponibles
      </label>
    </div>
  );
}
