import { getCocinero, getProducto, type Cocinero, type Producto } from "@/lib/mock-data";
import type { ItemCarrito } from "@/lib/app-state";

export type Linea = { producto: Producto; cantidad: number };
export type Grupo = { cocinero: Cocinero; lineas: Linea[]; subtotal: number };

export function agruparCarrito(carrito: ItemCarrito[]): Grupo[] {
  const grupos: Grupo[] = [];
  for (const item of carrito) {
    const producto = getProducto(item.productoId);
    if (!producto) continue;
    const cocinero = getCocinero(producto.cocineroId);
    if (!cocinero) continue;
    let grupo = grupos.find((g) => g.cocinero.id === cocinero.id);
    if (!grupo) {
      grupo = { cocinero, lineas: [], subtotal: 0 };
      grupos.push(grupo);
    }
    grupo.lineas.push({ producto, cantidad: item.cantidad });
    grupo.subtotal += producto.precio * item.cantidad;
  }
  return grupos;
}

/** Productos que ya no se pueden comprar: agotados o de un vendedor sin entregas hoy. */
export function itemsNoDisponibles(carrito: ItemCarrito[]): string[] {
  return carrito
    .filter((item) => {
      const producto = getProducto(item.productoId);
      if (!producto) return true;
      if (producto.agotado) return true;
      const cocinero = getCocinero(producto.cocineroId);
      return !cocinero || !cocinero.entregaHoy;
    })
    .map((item) => item.productoId);
}

export function faltantesDeMinimo(grupos: Grupo[]): Grupo[] {
  return grupos.filter(
    (grupo) => grupo.cocinero.minimoCompra > 0 && grupo.subtotal < grupo.cocinero.minimoCompra,
  );
}

export const CARGO_PLATAFORMA = 0.05;
