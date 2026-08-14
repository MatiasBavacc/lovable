import { createFileRoute, notFound } from "@tanstack/react-router";
import { BackHeader } from "@/components/back-header";
import { StarRating } from "@/components/star-rating";
import { getProducto, type Producto } from "@/lib/mock-data";

export const Route = createFileRoute("/producto/$id/opiniones")({
  loader: ({ params }): { producto: Producto } => {
    const producto = getProducto(params.id);
    if (!producto) throw notFound();
    return { producto };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Opiniones no encontradas — Sabor Local" }, { name: "robots", content: "noindex" }],
      };
    }
    const { producto } = loaderData;
    return {
      meta: [
        { title: `Opiniones de ${producto.titulo} — Sabor Local` },
        {
          name: "description",
          content: `Todas las reseñas de quienes pidieron ${producto.titulo}.`,
        },
        { property: "og:title", content: `Opiniones de ${producto.titulo} — Sabor Local` },
        {
          property: "og:description",
          content: `Todas las reseñas de quienes pidieron ${producto.titulo}.`,
        },
      ],
    };
  },
  component: Opiniones,
});

function Opiniones() {
  const { producto } = Route.useLoaderData() as { producto: Producto };
  // Listado de sólo lectura: repetimos las reseñas mock para simular el historial completo.
  const todas = [...producto.resenas, ...producto.resenas].map((resena, indice) => ({
    ...resena,
    id: `${resena.id}-${indice}`,
  }));

  return (
    <div className="pb-8">
      <BackHeader titulo="Opiniones" />

      <div className="space-y-3 px-4">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">{producto.titulo}</p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating valor={producto.rating} tamano={13} />
            <span className="text-xs text-muted-foreground">
              {producto.rating.toFixed(1)} · {producto.cantidadResenas} reseñas
            </span>
          </div>
        </div>

        {todas.map((resena) => (
          <div key={resena.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{resena.usuario}</p>
              <span className="text-[11px] text-muted-foreground">{resena.fecha}</span>
            </div>
            <StarRating valor={resena.estrellas} tamano={11} className="mt-1" />
            <p className="mt-1 text-sm text-muted-foreground">{resena.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
