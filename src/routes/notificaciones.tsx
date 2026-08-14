import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Gift, MessageCircle, Package } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { useAppState, type Notificacion } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notificaciones")({
  head: () => ({
    meta: [
      { title: "Notificaciones — Sabor Local" },
      { name: "description", content: "Novedades de tus pedidos, mensajes de cocineros y promociones." },
      { property: "og:title", content: "Notificaciones — Sabor Local" },
      { property: "og:description", content: "Novedades de tus pedidos, mensajes de cocineros y promociones." },
    ],
  }),
  component: Notificaciones,
});

const iconos = { pedido: Package, mensaje: MessageCircle, promo: Gift } as const;

function Notificaciones() {
  const { notificaciones, marcarLeida } = useAppState();
  const navigate = useNavigate();

  function abrir(notificacion: Notificacion) {
    marcarLeida(notificacion.id);
    if (notificacion.tipo === "pedido" && notificacion.pedidoId) {
      navigate({ to: "/pedido/$id", params: { id: notificacion.pedidoId } });
    } else if (notificacion.tipo === "mensaje" && notificacion.cocineroId) {
      navigate({ to: "/chat/$cocineroId", params: { cocineroId: notificacion.cocineroId } });
    }
  }

  return (
    <div className="pb-8">
      <BackHeader titulo="Notificaciones" />

      <div className="space-y-2 px-4 pt-2">
        {notificaciones.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-6 pt-16 text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </span>
            <p className="text-sm text-muted-foreground">No tenés notificaciones por ahora</p>
          </div>
        ) : (
          notificaciones.map((notificacion) => {
            const Icono = iconos[notificacion.tipo];
            const navegable = notificacion.tipo !== "promo";
            return (
              <button
                key={notificacion.id}
                type="button"
                onClick={() => abrir(notificacion)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-transform",
                  navegable && "active:scale-[0.99]",
                )}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary">
                  <Icono className="h-4 w-4 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{notificacion.titulo}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{notificacion.texto}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{notificacion.fecha}</span>
                </span>
                {!notificacion.leida && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
