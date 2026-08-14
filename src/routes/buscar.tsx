import { Link, createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { z } from "zod";
import { BackHeader } from "@/components/back-header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { buscarProductos, coincideConFiltro } from "@/lib/mock-data";

export const Route = createFileRoute("/buscar")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Resultados de búsqueda — Sabor Local" },
      { name: "description", content: "Encontrá viandas caseras por plato, categoría o cocinero." },
      { property: "og:title", content: "Resultados de búsqueda — Sabor Local" },
      { property: "og:description", content: "Buscá viandas caseras por plato, categoría o cocinero." },
    ],
  }),
  component: Resultados,
});

function Resultados() {
  const { q } = Route.useSearch();
  const { filtro, setFiltro } = useAppState();
  const todos = buscarProductos(q ?? "");
  const resultados = todos.filter((producto) => coincideConFiltro(producto, filtro));
  const ocultadosPorFiltro = todos.length > 0 && resultados.length === 0;

  return (
    <div className="pb-6">
      <BackHeader titulo={q ? `"${q}"` : "Búsqueda"} />

      {resultados.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">
            {ocultadosPorFiltro
              ? "No encontramos publicaciones que coincidan con ese filtro"
              : "No encontramos nada con ese nombre"}
          </p>
          {ocultadosPorFiltro ? (
            <Button className="rounded-xl" onClick={() => setFiltro(null)}>
              Quitar filtro
            </Button>
          ) : (
            <Link
              to="/"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Volver a la vidriera
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="px-4 pb-3 text-xs text-muted-foreground">
            {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-2 gap-3 px-4">
            {resultados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
