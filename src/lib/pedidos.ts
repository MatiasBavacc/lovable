import type { ModoEntrega, Pedido } from "@/lib/app-state";

export function pasosDePedido(modo: ModoEntrega): string[] {
  return [
    "Confirmado",
    "Preparando",
    modo === "Delivery" ? "En camino" : "Listo para retirar",
    "Entregado",
  ];
}

export function estadoDePedido(pedido: Pedido): string {
  if (pedido.cancelado) return "Cancelado";
  return pasosDePedido(pedido.modo)[pedido.paso] ?? "Confirmado";
}

/** Clases del badge según el estado: azul, amarillo, naranja y verde. */
export function claseEstado(pedido: Pedido): string {
  if (pedido.cancelado) return "bg-destructive/10 text-destructive";
  if (pedido.paso === 0) return "bg-info text-info-foreground";
  if (pedido.paso === 1) return "bg-warning text-warning-foreground";
  if (pedido.paso === 2) return "bg-primary/15 text-primary";
  return "bg-success text-success-foreground";
}

export function estaEnCurso(pedido: Pedido): boolean {
  return !pedido.cancelado && pedido.paso < 3;
}
