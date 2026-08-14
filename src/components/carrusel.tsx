import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carrusel({ titulo, children }: { titulo: string; children: ReactNode }) {
  const referencia = useRef<HTMLDivElement>(null);

  function desplazar(direccion: 1 | -1) {
    const nodo = referencia.current;
    if (!nodo) return;
    // Un paso ≈ el ancho de 2 cards.
    nodo.scrollBy({ left: direccion * 368, behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">{titulo}</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label={`Ver anteriores de ${titulo}`}
            onClick={() => desplazar(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card shadow-sm transition-transform active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Ver siguientes de ${titulo}`}
            onClick={() => desplazar(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card shadow-sm transition-transform active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={referencia}
        className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1 scroll-smooth"
      >
        {children}
      </div>
    </section>
  );
}
