import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import { useAppState } from "@/lib/app-state";
import { cocineros, getProducto, productosDeCocinero } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Sabor Local" },
      { name: "description", content: "Tus platos y cocineros favoritos, listos para volver a pedir." },
      { property: "og:title", content: "Favoritos — Sabor Local" },
      { property: "og:description", content: "Tus platos y cocineros favoritos, listos para volver a pedir." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { favoritos, cocinerosFavoritos } = useAppState();
  const [tab, setTab] = useState<"platos" | "cocineros">("platos");

  const platos = favoritos.map(getProducto).filter((producto) => producto !== undefined);
  const chefs = cocineros.filter((cocinero) => cocinerosFavoritos.includes(cocinero.id));

  return (
    <div className="pb-8">
      <BackHeader titulo="Favoritos" />

      <div className="px-4">
        <div className="flex rounded-xl bg-secondary p-1">
          {(
            [
              ["platos", "Platos"],
              ["cocineros", "Cocineros"],
            ] as const
          ).map(([clave, etiqueta]) => (
            <button
              key={clave}
              type="button"
              onClick={() => setTab(clave)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
                tab === clave ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {tab === "platos" ? (
          platos.length === 0 ? (
            <Vacio texto="Todavía no marcaste ningún plato como favorito" />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {platos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )
        ) : chefs.length === 0 ? (
          <Vacio texto="Todavía no marcaste ningún cocinero como favorito" />
        ) : (
          <div className="space-y-3">
            {chefs.map((cocinero) => {
              const platosDelChef = productosDeCocinero(cocinero.id);
              const rating =
                platosDelChef.reduce((suma, producto) => suma + producto.rating, 0) /
                (platosDelChef.length || 1);
              return (
                <Link
                  key={cocinero.id}
                  to="/cocinero/$id"
                  params={{ id: cocinero.id }}
                  className="block rounded-2xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-sm font-semibold">{cocinero.nombre}</p>
                  <p className="text-xs text-muted-foreground">{cocinero.barrio}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StarRating valor={rating} tamano={12} />
                    <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-12 text-center">
      <span className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
        <Heart className="h-10 w-10 text-muted-foreground" />
      </span>
      <p className="text-sm text-muted-foreground">{texto}</p>
      <Button asChild className="rounded-xl">
        <Link to="/">Explorar la vidriera</Link>
      </Button>
    </div>
  );
}
