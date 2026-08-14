import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ReceiptText } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { formatearPrecio } from "@/components/product-card";
import { useAppState, type Pedido } from "@/lib/app-state";
import { claseEstado, estadoDePedido, estaEnCurso } from "@/lib/pedidos";
import { getProducto } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Mis pedidos — Sabor Local" },
      { name: "description", content: "Seguí el estado de tus pedidos en curso y revisá tu historial de compras." },
      { property: "og:title", content: "Mis pedidos — Sabor Local" },
      { property: "og:description", content: "Seguí el estado de tus pedidos en curso y revisá tu historial de compras." },
    ],
  }),
  component: Pedidos,
});

function Pedidos() {
  const { pedidos } = useAppState();
  const [tab, setTab] = useState<"curso" | "historial">("curso");

  const enCurso = pedidos.filter(estaEnCurso);
  const historial = pedidos.filter((pedido) => !estaEnCurso(pedido));
  const lista = tab === "curso" ? enCurso : historial;

  return (
    <div className="pb-8">
      <BackHeader titulo="Mis pedidos" />

      <div className="px-4">
        <div className="flex rounded-xl bg-secondary p-1">
          {(
            [
              ["curso", "En curso"],
              ["historial", "Historial"],
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

      <div className="space-y-3 px-4 pt-4">
        {lista.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-6 pt-12 text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
              <ReceiptText className="h-10 w-10 text-muted-foreground" />
            </span>
            <p className="text-sm text-muted-foreground">
              {tab === "curso"
                ? "Todavía no tenés pedidos en curso"
                : "Todavía no tenés pedidos anteriores"}
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/">Explorar la vidriera</Link>
            </Button>
          </div>
        ) : (
          lista.map((pedido) => <CardPedido key={pedido.id} pedido={pedido} historial={tab === "historial"} />)
        )}
      </div>
    </div>
  );
}

function CardPedido({ pedido, historial }: { pedido: Pedido; historial: boolean }) {
  return (
    <Link
      to="/pedido/$id"
      params={{ id: pedido.id }}
      className="block rounded-2xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{pedido.cocinero}</p>
          <p className="text-xs text-muted-foreground">Pedido #{pedido.numero}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", claseEstado(pedido))}>
          {estadoDePedido(pedido)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {pedido.lineas.slice(0, 2).map((linea) => {
          const imagen = linea.imagen || getProducto(linea.productoId)?.imagenes[0];
          return imagen ? (
            <img
              key={linea.productoId}
              src={imagen}
              alt={linea.titulo}
              width={96}
              height={96}
              loading="lazy"
              className="h-12 w-12 rounded-xl object-cover"
            />
          ) : null;
        })}
        <div className="min-w-0 flex-1 text-xs text-muted-foreground">
          <p className="truncate">{pedido.horario}</p>
          {historial && (
            <p className="truncate">
              {pedido.fecha} · {formatearPrecio(pedido.total)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
