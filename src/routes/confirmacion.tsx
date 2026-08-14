import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/confirmacion")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado — Sabor Local" },
      { name: "description", content: "Tu pedido de viandas caseras fue confirmado. Seguí cada pedido desde la sección Pedidos." },
      { property: "og:title", content: "Pedido confirmado — Sabor Local" },
      { property: "og:description", content: "Tu pedido de viandas caseras fue confirmado. Seguí cada pedido desde la sección Pedidos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmacion,
});

function Confirmacion() {
  const { ultimoPedido, vaciarCarrito } = useAppState();

  useEffect(() => {
    vaciarCarrito();
  }, [vaciarCarrito]);

  return (
    <div className="flex flex-col items-center gap-5 px-6 pb-10 pt-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </span>
      <h1 className="font-display text-2xl font-semibold">¡Tu pedido fue confirmado!</h1>

      <div className="w-full space-y-2 text-left">
        {ultimoPedido.map((pedido) => (
          <div key={pedido.numero} className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold">
              Pedido #{pedido.numero} — {pedido.cocinero}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{pedido.estimado}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Podés hacer seguimiento de cada pedido desde la sección Pedidos.
      </p>

      <div className="w-full space-y-2">
        <Button asChild className="h-12 w-full rounded-xl text-sm font-semibold">
          <Link to="/pedidos">Ver mis pedidos</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 w-full rounded-xl text-sm font-semibold">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
