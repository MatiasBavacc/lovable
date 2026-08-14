import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatearPrecio } from "@/components/product-card";
import { useAppState } from "@/lib/app-state";
import { CARGO_PLATAFORMA, agruparCarrito, itemsNoDisponibles } from "@/lib/carrito";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mi-plato")({
  head: () => ({
    meta: [
      { title: "Mi Plato — Sabor Local" },
      { name: "description", content: "Revisá los platos que elegiste, agrupados por vendedor, antes de continuar tu compra." },
      { property: "og:title", content: "Mi Plato — Sabor Local" },
      { property: "og:description", content: "Revisá los platos que elegiste, agrupados por vendedor, antes de continuar tu compra." },
    ],
  }),
  component: MiPlato,
});

function MiPlato() {
  const { carrito, cambiarCantidad, quitarDelCarrito, sesion } = useAppState();
  const navigate = useNavigate();
  const [aviso, setAviso] = useState(false);
  const [desmarcados, setDesmarcados] = useState<string[]>([]);

  const activo = (id: string) => !desmarcados.includes(id);
  function alternar(id: string) {
    setDesmarcados((previos) =>
      previos.includes(id) ? previos.filter((p) => p !== id) : [...previos, id],
    );
  }

  const grupos = agruparCarrito(carrito).map((grupo) => {
    const subtotalActivo = grupo.lineas.reduce(
      (suma, linea) => (activo(linea.producto.id) ? suma + linea.producto.precio * linea.cantidad : suma),
      0,
    );
    return { ...grupo, subtotalActivo };
  });

  const total = grupos.reduce((suma, grupo) => suma + grupo.subtotalActivo, 0);
  const cargo = Math.round(total * CARGO_PLATAFORMA);
  const faltantes = grupos.filter(
    (grupo) =>
      grupo.subtotalActivo > 0 &&
      grupo.cocinero.minimoCompra > 0 &&
      grupo.subtotalActivo < grupo.cocinero.minimoCompra,
  );

  function continuarCompra() {
    const noDisponibles = itemsNoDisponibles(carrito);
    if (noDisponibles.length > 0) {
      noDisponibles.forEach((id) => quitarDelCarrito(id));
      setAviso(true);
      return;
    }
    if (sesion) {
      navigate({ to: "/checkout" });
      return;
    }
    navigate({ to: "/login", search: { motivo: "carrito" } });
  }

  if (grupos.length === 0) {
    return (
      <div className="pb-8">
        <BackHeader titulo="Mi Plato" />
        <div className="flex flex-col items-center gap-4 px-8 pt-16 text-center">
          <span className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">Tu plato está vacío</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sumá viandas de los cocineros de tu barrio y aparecen acá.
            </p>
          </div>
          <Button asChild className="rounded-xl">
            <Link to="/">Explorar la vidriera</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <BackHeader titulo="Mi Plato" />

      <div className="space-y-4 px-4">
        {aviso && (
          <div className="flex items-start gap-2 rounded-2xl bg-warning px-3 py-3 text-xs font-medium text-warning-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Uno o más productos ya no están disponibles y fueron quitados de tu plato</p>
          </div>
        )}
        {grupos.map((grupo) => {
          const falta = grupo.cocinero.minimoCompra - grupo.subtotalActivo;
          const avisoMinimo = grupo.subtotalActivo > 0 && grupo.cocinero.minimoCompra > 0 && falta > 0;
          return (
            <section key={grupo.cocinero.id} className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
              <Link
                to="/cocinero/$id"
                params={{ id: grupo.cocinero.id }}
                className="block text-sm font-semibold text-primary"
              >
                {grupo.cocinero.nombre}
              </Link>

              {grupo.lineas.map(({ producto, cantidad }) => {
                const incluido = activo(producto.id);
                return (
                  <div
                    key={producto.id}
                    className="flex gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
                  >
                    <Checkbox
                      checked={incluido}
                      onCheckedChange={() => alternar(producto.id)}
                      aria-label={`Incluir ${producto.titulo} en la compra`}
                      className="mt-1 shrink-0"
                    />
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.titulo}
                      width={120}
                      height={120}
                      loading="lazy"
                      className={cn(
                        "h-16 w-16 shrink-0 rounded-xl object-cover",
                        !incluido && "opacity-40",
                      )}
                    />
                    <div className={cn("min-w-0 flex-1", !incluido && "opacity-50")}>
                      <p className="line-clamp-1 text-sm font-medium">{producto.titulo}</p>
                      <p className="text-sm font-bold text-primary">
                        {formatearPrecio(producto.precio * cantidad)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-border px-1.5 py-1">
                          <button
                            type="button"
                            aria-label="Restar unidad"
                            disabled={!incluido}
                            onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-secondary active:scale-90 disabled:pointer-events-none"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-4 text-center text-xs font-semibold">{cantidad}</span>
                          <button
                            type="button"
                            aria-label="Sumar unidad"
                            disabled={!incluido}
                            onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                            className="grid h-6 w-6 place-items-center rounded-full bg-secondary active:scale-90 disabled:pointer-events-none"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Eliminar ${producto.titulo}`}
                          onClick={() => quitarDelCarrito(producto.id)}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatearPrecio(grupo.subtotalActivo)}</span>
              </div>

              {avisoMinimo && (
                <div className="space-y-2 rounded-xl bg-warning text-center px-3 py-2.5 text-xs font-medium text-warning-foreground">
                  <p>
                    Te faltan {formatearPrecio(falta)} para el mínimo de compra de {grupo.cocinero.nombre}
                  </p>
                  <div className="flex flex-row flex-wrap gap-2 pt-1 justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        grupo.lineas.forEach((linea) => quitarDelCarrito(linea.producto.id))
                      }
                      className="rounded-lg bg-primary text-white px-3 py-2 text-left font-semibold "
                    >
                      Quitar del pedido
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/cocinero/$id", params: { id: grupo.cocinero.id } })}
                      className="rounded-lg bg-primary text-white px-3 py-2 text-left font-semibold "
                    >
                      Agregar más
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })}

        <section className="space-y-2 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cargo de plataforma (5%)</span>
            <span className="font-medium">{formatearPrecio(cargo)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">{formatearPrecio(total + cargo)}</span>
          </div>
        </section>

        <Button
          className="h-12 w-full rounded-xl text-sm font-semibold"
          disabled={faltantes.length > 0 || total === 0}
          onClick={continuarCompra}
        >
          Ir al pago
        </Button>
      </div>
    </div>
  );
}
