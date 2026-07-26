interface BuscadorProps {
  valor: string;
  onChange: (valor: string) => void;
}

export default function Buscador({ valor, onChange }: BuscadorProps) {
  return (
    <div className="control">
      <label htmlFor="busqueda">Buscar</label>
      <input
        id="busqueda"
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        placeholder="Nombre, género, clasificación o sala"
      />
    </div>
  );
}
