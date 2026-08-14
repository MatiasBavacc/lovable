import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { StarRating } from "@/components/star-rating";
import { formatearPrecio } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { getCocinero, getProducto, type Cocinero, type Producto } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/producto/$id")({
  loader: ({ params }): { producto: Producto; cocinero: Cocinero | undefined } => {
    const producto = getProducto(params.id);
    if (!producto) throw notFound();
    return { producto, cocinero: getCocinero(producto.cocineroId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Plato no encontrado — Sabor Local" }, { name: "robots", content: "noindex" }],
      };
    }
    const { producto } = loaderData;
    return {
      meta: [
        { title: `${producto.titulo} — Sabor Local` },
        { name: "description", content: producto.descripcion },
        { property: "og:title", content: `${producto.titulo} — Sabor Local` },
        { property: "og:description", content: producto.descripcion },
      ],
    };
  },
  component: DetalleProducto,
});

function DetalleProducto() {
  const { producto, cocinero } = Route.useLoaderData() as {
    producto: Producto;
    cocinero: Cocinero | undefined;
  };
  const { esFavorito, alternarFavorito, agregarAlCarrito, sesion } = useAppState();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);

  const favorito = esFavorito(producto.id);
  const sinEntregas = cocinero ? !cocinero.entregaHoy : false;
  const bloqueado = producto.agotado || sinEntregas;
  const promedio =
    producto.resenas.reduce((total, resena) => total + resena.estrellas, 0) /
    producto.resenas.length;

  return (
    <div className="pb-8">
      <BackHeader titulo="Detalle" />

      <div className="relative px-4">
        <img
          src={producto.imagenes[imagenActiva]}
          alt={producto.titulo}
          width={800}
          height={600}
          className="aspect-4/3 w-full rounded-2xl object-cover"
        />
        <button
          type="button"
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={() => {
            if (!sesion) {
              navigate({ to: "/login", search: { motivo: "favorito" } });
              return;
            }
            alternarFavorito(producto.id);
          }}
          className="absolute right-7 top-3 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur active:scale-90"
        >
          <Heart
            className={cn("h-5 w-5", favorito ? "fill-primary text-primary" : "text-muted-foreground")}
          />
        </button>
        {producto.imagenes.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {producto.imagenes.map((imagen, indice) => (
              <button
                key={imagen}
                type="button"
                aria-label={`Ver imagen ${indice + 1}`}
                onClick={() => setImagenActiva(indice)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  indice === imagenActiva ? "w-5 bg-primary" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5 px-4 pt-5">
        {sinEntregas && (
          <p className="rounded-xl bg-warning px-3 py-2.5 text-xs font-medium text-warning-foreground">
            Este cocinero no tiene entregas disponibles hoy
          </p>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold leading-tight">{producto.titulo}</h1>
          <div className="flex items-center gap-2">
            <StarRating valor={producto.rating} />
            <span className="text-xs text-muted-foreground">
              {producto.rating.toFixed(1)} · {producto.cantidadResenas} reseñas
            </span>
          </div>
          <p className="text-xl font-bold text-primary">{formatearPrecio(producto.precio)}</p>
          <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
            {producto.entrega === "Ambos" ? "Delivery y Retiro" : producto.entrega}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
            {producto.disponibilidad}
          </span>
        </div>

        <section className="rounded-2xl bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold">Ingredientes</h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {producto.ingredientes.map((ingrediente) => (
              <li key={ingrediente} className="list-inside list-disc">
                {ingrediente}
              </li>
            ))}
          </ul>
        </section>

        {cocinero && (
          <section className="rounded-2xl bg-card p-4 shadow-sm">
            <Link
              to="/cocinero/$id"
              params={{ id: cocinero.id }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">{cocinero.nombre}</p>
                <p className="text-xs text-muted-foreground">{cocinero.barrio}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Button asChild variant="outline" className="mt-3 w-full rounded-xl">
              <Link to="/cocinero/$id" params={{ id: cocinero.id }}>
                Ver menú del cocinero
              </Link>
            </Button>
          </section>
        )}

        {/* Los tags son clickeables pero por ahora sólo cambian de estado visual. */}
        <div className="flex flex-wrap gap-2">
          {producto.tags.map((tag) => {
            const activo = tagsSeleccionados.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setTagsSeleccionados((actuales) =>
                    activo ? actuales.filter((t) => t !== tag) : [...actuales, tag],
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activo
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
            <button
              type="button"
              aria-label="Restar"
              onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
              className="grid h-6 w-6 place-items-center rounded-full bg-secondary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center text-sm font-semibold">{cantidad}</span>
            <button
              type="button"
              aria-label="Sumar"
              onClick={() => setCantidad((valor) => valor + 1)}
              className="grid h-6 w-6 place-items-center rounded-full bg-secondary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <Button
            className="h-11 flex-1 rounded-xl text-sm font-semibold"
            disabled={bloqueado}
            onClick={() => {
              if (!sesion) {
                navigate({ to: "/login", search: { motivo: "carrito" } });
                return;
              }
              agregarAlCarrito(producto.id, cantidad);
            }}
          >
            {producto.agotado
              ? "Agotado"
              : sinEntregas
                ? "No disponible hoy"
                : "Agregar al plato"}
          </Button>
        </div>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Valoraciones</h2>
            <div className="flex items-center gap-1.5">
              <StarRating valor={promedio} tamano={12} />
              <span className="text-xs text-muted-foreground">{promedio.toFixed(1)}</span>
            </div>
          </div>

          {producto.resenas.map((resena) => (
            <div key={resena.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{resena.usuario}</p>
                <span className="text-[11px] text-muted-foreground">{resena.fecha}</span>
              </div>
              <StarRating valor={resena.estrellas} tamano={11} className="mt-1" />
              <p className="mt-1 text-sm text-muted-foreground">{resena.comentario}</p>
            </div>
          ))}

          <Link
            to="/producto/$id/opiniones"
            params={{ id: producto.id }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Ver todas las opiniones
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
