import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Heart, Home, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { titulo: "Inicio", url: "/", icono: Home },
  { titulo: "Notificaciones", url: "/notificaciones", icono: Bell },
  { titulo: "Favoritos", url: "/favoritos", icono: Heart },
  { titulo: "Pedidos", url: "/pedidos", icono: ReceiptText },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (estado) => estado.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-lg">
        {items.map((item) => {
          const activo = pathname === item.url;
          return (
            <li key={item.url} className="flex-1">
              <Link
                to={item.url}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  activo ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icono className={cn("h-5 w-5", activo && "fill-primary/15")} />
                {item.titulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
