import { Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { useAppState } from "@/lib/app-state";
import { getCocinero, type Producto } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function formatearPrecio(precio: number) {
  return `$${precio.toLocaleString("es-AR")}`;
}

export function ProductCard({
  producto,
  className,
}: {
  producto: Producto;
  className?: string;
}) {
  const { esFavorito, alternarFavorito, sesion } = useAppState();
  const navigate = useNavigate();
  const cocinero = getCocinero(producto.cocineroId);
  const favorito = esFavorito(producto.id);
  const sinEntregas = cocinero ? !cocinero.entregaHoy : false;

  return (
    <Link
      to="/producto/$id"
      params={{ id: producto.id }}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative">
        <img
          src={producto.imagenes[0]}
          alt={producto.titulo}
          width={800}
          height={600}
          loading="lazy"
          className="aspect-4/3 w-full object-cover"
        />
        <button
          type="button"
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={(evento) => {
            evento.preventDefault();
            if (!sesion) {
              navigate({ to: "/login", search: { motivo: "favorito" } });
              return;
            }
            alternarFavorito(producto.id);
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 backdrop-blur transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              favorito ? "fill-primary text-primary" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold">{producto.titulo}</h3>
        <div className="flex items-center gap-1.5">
          <StarRating valor={producto.rating} tamano={12} />
          <span className="text-xs text-muted-foreground">{producto.rating.toFixed(1)}</span>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{producto.descripcion}</p>
        <p className="pt-0.5 text-sm font-bold text-primary">{formatearPrecio(producto.precio)}</p>
        {(producto.agotado || sinEntregas) && (
          <span className="mt-1 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {producto.agotado ? "Agotado" : "No disponible hoy"}
          </span>
        )}
      </div>
    </Link>
  );
}
