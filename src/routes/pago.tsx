import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState, type PedidoConfirmado } from "@/lib/app-state";
import { CARGO_PLATAFORMA, agruparCarrito } from "@/lib/carrito";

export const Route = createFileRoute("/pago")({
  head: () => ({
    meta: [
      { title: "Procesando pago — Sabor Local" },
      { name: "description", content: "Estamos conectando tu pedido de Sabor Local con MercadoPago." },
      { property: "og:title", content: "Procesando pago — Sabor Local" },
      { property: "og:description", content: "Estamos conectando tu pedido de Sabor Local con MercadoPago." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Pago,
});

type Estado = "cargando" | "error";

function Pago() {
  const { carrito, setUltimoPedido, entrega, borrador, crearPedidos } = useAppState();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>("cargando");
  const [intento, setIntento] = useState(0);
  const [forzarError, setForzarError] = useState(false);

  const confirmar = useCallback(() => {
    const base = 1230 + Math.floor(Math.random() * 500);
    const grupos = agruparCarrito(carrito);
    const pedidos: PedidoConfirmado[] = grupos.map((grupo, indice) => ({
      numero: base + indice,
      cocineroId: grupo.cocinero.id,
      cocinero: grupo.cocinero.nombre,
      estimado: grupo.cocinero.horario,
    }));
    const cargoTotal = (subtotal: number) => Math.round(subtotal * CARGO_PLATAFORMA);
    crearPedidos(
      grupos.map((grupo, indice) => {
        const cargo = cargoTotal(grupo.subtotal);
        return {
          id: `p-${base + indice}`,
          numero: base + indice,
          cocineroId: grupo.cocinero.id,
          cocinero: grupo.cocinero.nombre,
          modo: entrega.modo,
          lugar: borrador[grupo.cocinero.id]?.lugar ?? grupo.cocinero.direccionLocal,
          horario: grupo.cocinero.horario,
          nota: borrador[grupo.cocinero.id]?.nota ?? "",
          fecha: entrega.fecha,
          lineas: grupo.lineas.map(({ producto, cantidad }) => ({
            productoId: producto.id,
            titulo: producto.titulo,
            imagen: producto.imagenes[0] ?? "",
            cantidad,
            precio: producto.precio,
          })),
          subtotal: grupo.subtotal,
          cargo,
          total: grupo.subtotal + cargo,
          paso: 0,
          cancelado: false,
        };
      }),
    );
    setUltimoPedido(pedidos);
    navigate({ to: "/confirmacion", replace: true });
  }, [carrito, navigate, setUltimoPedido, entrega, borrador, crearPedidos]);

  useEffect(() => {
    if (estado !== "cargando") return;
    const id = setTimeout(() => {
      if (forzarError) {
        setEstado("error");
        return;
      }
      confirmar();
    }, 2500);
    return () => clearTimeout(id);
  }, [estado, intento, forzarError, confirmar]);

  if (estado === "error") {
    return (
      <div className="flex flex-col items-center gap-4 px-8 pt-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-9 w-9 text-destructive" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold">No pudimos procesar tu pago</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Podés reintentar o volver a revisar tu plato.
          </p>
        </div>
        <div className="w-full space-y-2 pt-2">
          <Button
            className="h-12 w-full rounded-xl text-sm font-semibold"
            onClick={() => {
              setForzarError(false);
              setIntento((n) => n + 1);
              setEstado("cargando");
            }}
          >
            Reintentar
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-sm font-semibold"
            onClick={() => navigate({ to: "/mi-plato" })}
          >
            Volver al carrito
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-8 pt-28 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="font-display text-lg font-semibold">Conectando con MercadoPago...</p>
      <p className="text-sm text-muted-foreground">No cierres esta pantalla.</p>

      <button
        type="button"
        onClick={() => setForzarError(true)}
        className="mt-6 text-xs font-medium text-muted-foreground underline"
      >
        Simular pago rechazado
      </button>
    </div>
  );
}
