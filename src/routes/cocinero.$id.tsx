import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { getCocinero, productosDeCocinero, type Cocinero, type Producto } from "@/lib/mock-data";

export const Route = createFileRoute("/cocinero/$id")({
  loader: ({ params }): { cocinero: Cocinero; menu: Producto[] } => {
    const cocinero = getCocinero(params.id);
    if (!cocinero) throw notFound();
    return { cocinero, menu: productosDeCocinero(params.id) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Cocinero no encontrado — Sabor Local" }, { name: "robots", content: "noindex" }],
      };
    }
    const { cocinero } = loaderData;
    return {
      meta: [
        { title: `${cocinero.nombre} — Sabor Local` },
        { name: "description", content: cocinero.descripcion },
        { property: "og:title", content: `${cocinero.nombre} — Sabor Local` },
        { property: "og:description", content: cocinero.descripcion },
      ],
    };
  },
  component: PerfilCocinero,
});

function PerfilCocinero() {
  const { cocinero, menu } = Route.useLoaderData() as { cocinero: Cocinero; menu: Producto[] };
  const { esCocineroFavorito, alternarCocineroFavorito, sesion } = useAppState();
  const navigate = useNavigate();
  const favorito = esCocineroFavorito(cocinero.id);

  return (
    <div className="pb-8">
      <BackHeader titulo={cocinero.nombre} />

      <div className="space-y-4 px-4">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{cocinero.nombre}</h2>
            <button
              type="button"
              aria-label={favorito ? "Quitar vendedor de favoritos" : "Agregar vendedor a favoritos"}
              onClick={() => {
                if (!sesion) {
                  navigate({ to: "/login", search: { motivo: "favorito" } });
                  return;
                }
                alternarCocineroFavorito(cocinero.id);
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary transition-transform active:scale-90"
            >
              <Heart
                className={cn("h-4 w-4", favorito ? "fill-primary text-primary" : "text-muted-foreground")}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{cocinero.barrio}</p>
          <p className="mt-1 text-sm">{cocinero.descripcion}</p>
          <p className="mt-2 text-xs font-medium text-primary">{cocinero.horario}</p>
        </div>

        {!cocinero.entregaHoy && (
          <p className="rounded-xl bg-warning px-3 py-2.5 text-xs font-medium text-warning-foreground">
            Este cocinero no tiene entregas disponibles hoy
          </p>
        )}

        <div>
          <h2 className="text-xl font-semibold">Su menú</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {menu.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
