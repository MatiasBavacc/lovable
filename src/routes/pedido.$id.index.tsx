import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Check, Clock, MapPin, StickyNote, Wrench } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { formatearPrecio } from "@/components/product-card";
import { useAppState } from "@/lib/app-state";
import { claseEstado, estadoDePedido, pasosDePedido } from "@/lib/pedidos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedido/$id/")({
  head: () => ({
    meta: [
      { title: "Seguimiento del pedido — Sabor Local" },
      { name: "description", content: "Seguí el estado de tu pedido paso a paso, con detalle de productos y entrega." },
      { property: "og:title", content: "Seguimiento del pedido — Sabor Local" },
      { property: "og:description", content: "Seguí el estado de tu pedido paso a paso, con detalle de productos y entrega." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DetallePedido,
});

function DetallePedido() {
  const { id } = useParams({ from: "/pedido/$id/" });
  const { getPedido, avanzarPedido, alternarEstadoReclamo } = useAppState();
  const pedido = getPedido(id);

  if (!pedido) {
    return (
      <div className="pb-8">
        <BackHeader titulo="Pedido" />
        <div className="px-4 pt-10 text-center">
          <p className="text-sm text-muted-foreground">No encontramos este pedido.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/pedidos">Ver mis pedidos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pasos = pasosDePedido(pedido.modo);

  return (
    <div className="pb-8">
      <BackHeader titulo={`Pedido #${pedido.numero}`} />

      <div className="space-y-4 px-4">
        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                to="/cocinero/$id"
                params={{ id: pedido.cocineroId }}
                className="text-sm font-semibold text-primary"
              >
                {pedido.cocinero}
              </Link>
              <p className="text-xs text-muted-foreground">Pedido #{pedido.numero}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", claseEstado(pedido))}>
              {estadoDePedido(pedido)}
            </span>
          </div>

          <ol className="space-y-3 border-t border-border pt-3">
            {pasos.map((paso, indice) => {
              const completado = indice < pedido.paso;
              const actual = indice === pedido.paso;
              return (
                <li key={paso} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                      completado && "bg-success text-success-foreground",
                      actual && "bg-primary text-primary-foreground",
                      !completado && !actual && "bg-secondary text-muted-foreground",
                    )}
                  >
                    {completado ? <Check className="h-4 w-4" /> : indice + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      actual ? "font-semibold" : completado ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {paso}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="space-y-1.5 rounded-2xl bg-card p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {pedido.modo === "Delivery" ? "Entrega a domicilio" : "Retiro en el local"}
          </p>
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            {pedido.lugar || "Sin dirección cargada"}
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {pedido.horario}
          </p>
          {pedido.nota && (
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0" />
              {pedido.nota}
            </p>
          )}
        </section>

        <section className="space-y-2 rounded-2xl bg-card p-4 shadow-sm">
          {pedido.lineas.map((linea) => (
            <div key={linea.productoId} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 flex-1 truncate">
                <span className="text-muted-foreground">{linea.cantidad}× </span>
                {linea.titulo}
              </span>
              <span className="font-medium">{formatearPrecio(linea.precio * linea.cantidad)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatearPrecio(pedido.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cargo de plataforma</span>
            <span className="font-medium">{formatearPrecio(pedido.cargo)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">{formatearPrecio(pedido.total)}</span>
          </div>
        </section>

        {pedido.reclamo && (
          <section className="space-y-2 rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Reclamo #{pedido.reclamo.numero}</p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  pedido.reclamo.estado === "En curso"
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground",
                )}
              >
                {pedido.reclamo.estado === "En curso" ? "Reclamo en curso" : "Resuelto"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{pedido.reclamo.motivo}</p>
            <button
              type="button"
              onClick={() => alternarEstadoReclamo(pedido.id)}
              className="text-xs font-medium text-muted-foreground underline"
            >
              🔧 Simular cambio de estado del reclamo
            </button>
          </section>
        )}

        {pedido.calificacion ? (
          <section className="space-y-2 rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold">Tu calificación</p>
            <StarRating valor={pedido.calificacion.estrellas} tamano={16} />
            {pedido.calificacion.comentario && (
              <p className="text-sm text-muted-foreground">{pedido.calificacion.comentario}</p>
            )}
          </section>
        ) : (
          pedido.paso === 3 &&
          !pedido.cancelado && (
            <Button asChild className="h-12 w-full rounded-xl text-sm font-semibold">
              <Link to="/pedido/$id/calificar" params={{ id: pedido.id }}>
                Calificar pedido
              </Link>
            </Button>
          )
        )}

        {!pedido.cancelado && !pedido.reclamo && (
          <Button asChild variant="outline" className="h-12 w-full rounded-xl text-sm font-semibold">
            <Link to="/pedido/$id/reclamo" params={{ id: pedido.id }}>
              Iniciar un reclamo
            </Link>
          </Button>
        )}

        {pedido.paso < 3 && !pedido.cancelado && (
          <button
            type="button"
            onClick={() => avanzarPedido(pedido.id)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground"
          >
            <Wrench className="h-3.5 w-3.5" />
            Simular avance de estado
          </button>
        )}
      </div>
    </div>
  );
}
