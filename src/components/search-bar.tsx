import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Search } from "lucide-react";
import { busquedasRecientes, categoriasSugeridas } from "@/lib/mock-data";

export function SearchBar() {
  const [consulta, setConsulta] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const navigate = useNavigate();

  function buscar(termino: string) {
    const limpio = termino.trim();
    if (!limpio) return;
    setEnfocado(false);
    navigate({ to: "/buscar", search: { q: limpio } });
  }

  return (
    <div className="relative">
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          buscar(consulta);
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          onFocus={() => setEnfocado(true)}
          onBlur={() => window.setTimeout(() => setEnfocado(false), 150)}
          placeholder="¿Qué querés comer?"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      {enfocado && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 space-y-4 rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Búsquedas recientes
            </p>
            {busquedasRecientes.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => buscar(item)}
                className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left text-sm hover:bg-secondary"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Sugerencias
            </p>
            <div className="flex flex-wrap gap-2">
              {categoriasSugeridas.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onMouseDown={() => buscar(categoria)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
