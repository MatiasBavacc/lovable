import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Clock, MapPin } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DireccionResumen } from "@/components/direccion-form";
import { formatearPrecio } from "@/components/product-card";
import { useAppState } from "@/lib/app-state";
import { CARGO_PLATAFORMA, agruparCarrito, faltantesDeMinimo, itemsNoDisponibles } from "@/lib/carrito";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Confirmar pedido — Sabor Local" },
      { name: "description", content: "Revisá entrega, notas y total antes de pagar tu pedido de viandas caseras." },
      { property: "og:title", content: "Confirmar pedido — Sabor Local" },
      { property: "og:description", content: "Revisá entrega, notas y total antes de pagar tu pedido de viandas caseras." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { carrito, quitarDelCarrito, entrega, direcciones, sesion, setBorrador } = useAppState();
  const navigate = useNavigate();
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [elegidas, setElegidas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!sesion) navigate({ to: "/login", replace: true });
  }, [sesion, navigate]);

  const grupos = agruparCarrito(carrito);
  const total = grupos.reduce((suma, grupo) => suma + grupo.subtotal, 0);
  const cargo = Math.round(total * CARGO_PLATAFORMA);
  const faltantes = faltantesDeMinimo(grupos);
  const esDelivery = entrega.modo === "Delivery";
  const sinDireccion = esDelivery && direcciones.length === 0;

  if (grupos.length === 0) {
    return (
      <div className="pb-8">
        <BackHeader titulo="Confirmar pedido" />
        <div className="px-4 pt-10 text-center">
          <p className="text-sm text-muted-foreground">Tu plato está vacío.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/">Explorar la vidriera</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <BackHeader titulo="Confirmar pedido" />

      <div className="space-y-4 px-4">
        {grupos.map((grupo) => {
          const seleccionada = elegidas[grupo.cocinero.id] ?? direcciones[0]?.id ?? "";
          const falta = grupo.cocinero.minimoCompra - grupo.subtotal;
          return (
            <section key={grupo.cocinero.id} className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
              <Link
                to="/cocinero/$id"
                params={{ id: grupo.cocinero.id }}
                className="block text-sm font-semibold text-primary"
              >
                {grupo.cocinero.nombre}
              </Link>

              <ul className="space-y-1.5">
                {grupo.lineas.map(({ producto, cantidad }) => (
                  <li key={producto.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-muted-foreground">{cantidad}× </span>
                      {producto.titulo}
                    </span>
                    <span className="font-medium">{formatearPrecio(producto.precio * cantidad)}</span>
                  </li>
                ))}
              </ul>

              {esDelivery ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Dirección de entrega
                  </p>
                  {direcciones.map((direccion) => {
                    const activa = direccion.id === seleccionada;
                    return (
                      <button
                        key={direccion.id}
                        type="button"
                        onClick={() => setElegidas({ ...elegidas, [grupo.cocinero.id]: direccion.id })}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-xl border p-3 text-left text-sm transition-colors",
                          activa ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <MapPin className={cn("mt-0.5 h-4 w-4", activa ? "text-primary" : "text-muted-foreground")} />
                        <span className="min-w-0 flex-1">
                          <DireccionResumen direccion={direccion} />
                        </span>
                        {activa && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                  {direcciones.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Todavía no tenés direcciones guardadas.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1 border-t border-border pt-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Retiro en el local
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {grupo.cocinero.direccionLocal}
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {grupo.cocinero.horario}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor={`nota-${grupo.cocinero.id}`}
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Nota para el cocinero (opcional)
                </Label>
                <Textarea
                  id={`nota-${grupo.cocinero.id}`}
                  rows={2}
                  placeholder="Ej: sin sal, tocar timbre 2B..."
                  value={notas[grupo.cocinero.id] ?? ""}
                  onChange={(evento) => setNotas({ ...notas, [grupo.cocinero.id]: evento.target.value })}
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatearPrecio(grupo.subtotal)}</span>
              </div>

              {falta > 0 && (
                <div className="space-y-2 rounded-xl bg-warning px-3 py-2.5 text-xs font-medium text-warning-foreground">
                  <p>
                    Te faltan {formatearPrecio(falta)} para el mínimo de compra de {grupo.cocinero.nombre}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-lg bg-card text-xs">
                      <Link to="/mi-plato">Agregar productos</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg bg-card text-xs"
                      onClick={() => grupo.lineas.forEach(({ producto }) => quitarDelCarrito(producto.id))}
                    >
                      Quitar vendedor
                    </Button>
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
          disabled={faltantes.length > 0 || sinDireccion || itemsNoDisponibles(carrito).length > 0}
          onClick={() => {
            const datosGrupos: Record<string, { nota: string; lugar: string }> = {};
            for (const grupo of grupos) {
              const elegida = direcciones.find(
                (d) => d.id === (elegidas[grupo.cocinero.id] ?? direcciones[0]?.id),
              );
              datosGrupos[grupo.cocinero.id] = {
                nota: notas[grupo.cocinero.id] ?? "",
                lugar: esDelivery
                  ? [elegida?.calle, elegida?.piso].filter(Boolean).join(", ")
                  : grupo.cocinero.direccionLocal,
              };
            }
            setBorrador(datosGrupos);
            navigate({ to: "/pago" });
          }}
        >
          Confirmar y pagar {formatearPrecio(total + cargo)}
        </Button>

        {sinDireccion && (
          <p className="text-center text-xs text-muted-foreground">
            Agregá una dirección de entrega para continuar.
          </p>
        )}
      </div>
    </div>
  );
}
