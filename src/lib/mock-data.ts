import milanesas from "@/assets/milanesas.jpg";
import tarta from "@/assets/tarta.jpg";
import guiso from "@/assets/guiso.jpg";
import pastel from "@/assets/pastel.jpg";
import budin from "@/assets/budin.jpg";
import bowl from "@/assets/bowl.jpg";

export type Cocinero = {
  id: string;
  nombre: string;
  barrio: string;
  /** Dirección del local para retiro. */
  direccionLocal: string;
  entregaHoy: boolean;
  horario: string;
  descripcion: string;
  /** Mínimo de compra por vendedor (0 = sin mínimo). */
  minimoCompra: number;
};

export type Resena = {
  id: string;
  usuario: string;
  estrellas: number;
  comentario: string;
  fecha: string;
};

export type Producto = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  rating: number;
  cantidadResenas: number;
  imagenes: string[];
  cocineroId: string;
  ingredientes: string[];
  tags: string[];
  entrega: "Delivery" | "Retiro" | "Ambos";
  disponibilidad: string;
  agotado: boolean;
  secciones: Array<"dia" | "destacados" | "vendidos" | "nuevos">;
  resenas: Resena[];
};

export const cocineros: Cocinero[] = [
  {
    id: "dona-elsa",
    nombre: "Doña Elsa",
    barrio: "Villa Crespo",
    direccionLocal: "Av. Corrientes 5842, Villa Crespo",
    entregaHoy: true,
    horario: "Hoy de 12 a 15hs",
    descripcion: "Cocina casera de toda la vida, con recetas de familia.",
    minimoCompra: 9000,
  },
  {
    id: "cocina-de-mati",
    nombre: "La Cocina de Mati",
    barrio: "Almagro",
    direccionLocal: "Guardia Vieja 3410, Almagro",
    entregaHoy: true,
    horario: "Hoy de 11:30 a 14:30hs",
    descripcion: "Viandas equilibradas, muchas opciones veggie y sin TACC.",
    minimoCompra: 0,
  },
  {
    id: "el-fuego-de-juan",
    nombre: "El Fuego de Juan",
    barrio: "Boedo",
    direccionLocal: "Av. Boedo 1120, Boedo",
    entregaHoy: false,
    horario: "Vuelve mañana de 12 a 16hs",
    descripcion: "Carnes al horno y guisos de olla, porciones generosas.",
    minimoCompra: 12000,
  },
  {
    id: "dulce-rocio",
    nombre: "Dulce Rocío",
    barrio: "Caballito",
    direccionLocal: "Rojas 780, Caballito",
    entregaHoy: true,
    horario: "Hoy de 10 a 18hs",
    descripcion: "Panadería y postres caseros, todo hecho a la mañana.",
    minimoCompra: 4000,
  },
];

const resenasBase: Resena[] = [
  {
    id: "r1",
    usuario: "Carla M.",
    estrellas: 5,
    comentario: "Riquísimo y súper abundante. Llegó calentito.",
    fecha: "Hace 2 días",
  },
  {
    id: "r2",
    usuario: "Nico P.",
    estrellas: 4,
    comentario: "Muy buen sabor casero, repito seguro.",
    fecha: "Hace 1 semana",
  },
  {
    id: "r3",
    usuario: "Vale R.",
    estrellas: 5,
    comentario: "Se nota que está hecho con cariño. Excelente relación precio-calidad.",
    fecha: "Hace 2 semanas",
  },
  {
    id: "r4",
    usuario: "Juli S.",
    estrellas: 4,
    comentario: "La porción rinde para dos. Volvería a pedir.",
    fecha: "Hace 3 semanas",
  },
  {
    id: "r5",
    usuario: "Martín G.",
    estrellas: 5,
    comentario: "Impecable la puntualidad y el packaging.",
    fecha: "Hace 1 mes",
  },
];

type Semilla = Omit<Producto, "resenas">;

const semillas: Semilla[] = [
  {
    id: "milanesas-napolitanas",
    titulo: "Milanesas napolitanas con puré",
    descripcion:
      "Dos milanesas de ternera con salsa, muzzarella y jamón, acompañadas de puré de papas casero.",
    precio: 7200,
    rating: 4.8,
    cantidadResenas: 132,
    imagenes: [milanesas, pastel],
    cocineroId: "dona-elsa",
    ingredientes: ["Ternera", "Pan rallado", "Muzzarella", "Jamón cocido", "Papa", "Manteca"],
    tags: ["Carnes", "Casero"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 12 a 15hs",
    agotado: false,
    secciones: ["dia", "destacados", "vendidos"],
  },
  {
    id: "tarta-verduras",
    titulo: "Tarta de verduras de estación",
    descripcion: "Masa casera rellena con zapallito, morrón, cebolla y huevo. Porción generosa.",
    precio: 5400,
    rating: 4.6,
    cantidadResenas: 87,
    imagenes: [tarta, bowl],
    cocineroId: "cocina-de-mati",
    ingredientes: ["Harina", "Zapallito", "Morrón", "Cebolla", "Huevo"],
    tags: ["Vegetariano", "Casero"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 11:30 a 14:30hs",
    agotado: false,
    secciones: ["dia", "nuevos"],
  },
  {
    id: "guiso-lentejas",
    titulo: "Guiso de lentejas con chorizo",
    descripcion: "De olla, cocinado a fuego lento. Viene con pan casero para acompañar.",
    precio: 6100,
    rating: 4.9,
    cantidadResenas: 204,
    imagenes: [guiso],
    cocineroId: "el-fuego-de-juan",
    ingredientes: ["Lentejas", "Chorizo colorado", "Zanahoria", "Papa", "Panceta"],
    tags: ["Carnes", "Casero"],
    entrega: "Retiro",
    disponibilidad: "Sin entregas hoy",
    agotado: false,
    secciones: ["destacados", "vendidos"],
  },
  {
    id: "pastel-papa",
    titulo: "Pastel de papa clásico",
    descripcion: "Carne picada con huevo y aceituna, cubierto con puré gratinado al horno.",
    precio: 6800,
    rating: 4.7,
    cantidadResenas: 156,
    imagenes: [pastel, milanesas],
    cocineroId: "dona-elsa",
    ingredientes: ["Carne picada", "Papa", "Huevo", "Aceitunas", "Cebolla"],
    tags: ["Carnes", "Casero"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 12 a 15hs",
    agotado: false,
    secciones: ["dia", "vendidos"],
  },
  {
    id: "budin-limon",
    titulo: "Budín de limón glaseado",
    descripcion: "Húmedo, con ralladura de limón y baño de azúcar. Ideal para la merienda.",
    precio: 3900,
    rating: 4.9,
    cantidadResenas: 98,
    imagenes: [budin],
    cocineroId: "dulce-rocio",
    ingredientes: ["Harina", "Limón", "Huevo", "Manteca", "Azúcar"],
    tags: ["Postres", "Dulces"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 10 a 18hs",
    agotado: false,
    secciones: ["destacados", "nuevos"],
  },
  {
    id: "bowl-quinoa",
    titulo: "Bowl de quinoa y vegetales asados",
    descripcion: "Quinoa, calabaza, zucchini y garbanzos con aderezo de yogur y hierbas.",
    precio: 5900,
    rating: 4.5,
    cantidadResenas: 61,
    imagenes: [bowl, tarta],
    cocineroId: "cocina-de-mati",
    ingredientes: ["Quinoa", "Calabaza", "Zucchini", "Garbanzos", "Yogur"],
    tags: ["Vegetariano", "Sin TACC"],
    entrega: "Delivery",
    disponibilidad: "Disponible hoy de 11:30 a 14:30hs",
    agotado: false,
    secciones: ["nuevos", "destacados"],
  },
  {
    id: "milanesa-pollo",
    titulo: "Milanesa de pollo con ensalada",
    descripcion: "Pechuga rebozada al horno con ensalada mixta fresca y limón.",
    precio: 6400,
    rating: 4.4,
    cantidadResenas: 74,
    imagenes: [milanesas],
    cocineroId: "cocina-de-mati",
    ingredientes: ["Pollo", "Pan rallado", "Lechuga", "Tomate", "Zanahoria"],
    tags: ["Carnes"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 11:30 a 14:30hs",
    agotado: true,
    secciones: ["dia", "vendidos"],
  },
  {
    id: "tarta-choclo",
    titulo: "Tarta de choclo y queso",
    descripcion: "Cremosa, con choclo amarillo y queso cremoso. Masa fina casera.",
    precio: 5200,
    rating: 4.3,
    cantidadResenas: 45,
    imagenes: [tarta],
    cocineroId: "dona-elsa",
    ingredientes: ["Choclo", "Queso cremoso", "Harina", "Crema"],
    tags: ["Vegetariano", "Casero"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 12 a 15hs",
    agotado: false,
    secciones: ["nuevos"],
  },
  {
    id: "estofado-carne",
    titulo: "Estofado de carne con papas",
    descripcion: "Cocción lenta de roast beef con papas, arvejas y salsa de tomate natural.",
    precio: 7600,
    rating: 4.8,
    cantidadResenas: 119,
    imagenes: [guiso, pastel],
    cocineroId: "el-fuego-de-juan",
    ingredientes: ["Roast beef", "Papa", "Arvejas", "Tomate", "Laurel"],
    tags: ["Carnes", "Casero"],
    entrega: "Retiro",
    disponibilidad: "Sin entregas hoy",
    agotado: false,
    secciones: ["destacados"],
  },
  {
    id: "alfajores-maicena",
    titulo: "Alfajores de maicena (x6)",
    descripcion: "Rellenos con dulce de leche repostero y coco rallado alrededor.",
    precio: 4300,
    rating: 5,
    cantidadResenas: 143,
    imagenes: [budin],
    cocineroId: "dulce-rocio",
    ingredientes: ["Maicena", "Dulce de leche", "Coco rallado", "Manteca"],
    tags: ["Postres", "Dulces"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 10 a 18hs",
    agotado: false,
    secciones: ["vendidos", "nuevos"],
  },
  {
    id: "canelones-verdura",
    titulo: "Canelones de verdura y ricota",
    descripcion: "Panqueques caseros rellenos, con salsa mixta y queso rallado aparte.",
    precio: 6900,
    rating: 4.6,
    cantidadResenas: 92,
    imagenes: [pastel, tarta],
    cocineroId: "dona-elsa",
    ingredientes: ["Espinaca", "Ricota", "Harina", "Salsa de tomate", "Crema"],
    tags: ["Vegetariano", "Casero"],
    entrega: "Ambos",
    disponibilidad: "Disponible hoy de 12 a 15hs",
    agotado: false,
    secciones: ["dia", "destacados"],
  },
  {
    id: "ensalada-completa",
    titulo: "Ensalada completa sin TACC",
    descripcion: "Hojas verdes, huevo, pollo grillado, tomates cherry y semillas tostadas.",
    precio: 5600,
    rating: 4.2,
    cantidadResenas: 38,
    imagenes: [bowl],
    cocineroId: "cocina-de-mati",
    ingredientes: ["Mix de hojas", "Pollo", "Huevo", "Cherry", "Semillas"],
    tags: ["Sin TACC", "Vegetariano"],
    entrega: "Delivery",
    disponibilidad: "Disponible hoy de 11:30 a 14:30hs",
    agotado: false,
    secciones: ["nuevos", "dia"],
  },
];

export const productos: Producto[] = semillas.map((semilla, indice) => ({
  ...semilla,
  resenas: [
    resenasBase[indice % resenasBase.length]!,
    resenasBase[(indice + 1) % resenasBase.length]!,
    resenasBase[(indice + 2) % resenasBase.length]!,
  ],
}));

export const secciones = [
  { clave: "dia", titulo: "Menú del Día" },
  { clave: "destacados", titulo: "Destacados" },
  { clave: "vendidos", titulo: "Más Vendidos" },
  { clave: "nuevos", titulo: "Nuevos" },
] as const;

/** Cada carrusel muestra 10 cards; con 12 productos base repetimos para completar. */
export function productosDeSeccion(clave: (typeof secciones)[number]["clave"]): Producto[] {
  const base = productos.filter((producto) => producto.secciones.includes(clave));
  const resto = productos.filter((producto) => !producto.secciones.includes(clave));
  return [...base, ...resto].slice(0, 10);
}

export function getProducto(id: string): Producto | undefined {
  return productos.find((producto) => producto.id === id);
}

export function getCocinero(id: string): Cocinero | undefined {
  return cocineros.find((cocinero) => cocinero.id === id);
}

export function productosDeCocinero(id: string): Producto[] {
  return productos.filter((producto) => producto.cocineroId === id);
}

export function buscarProductos(consulta: string): Producto[] {
  const termino = consulta.trim().toLowerCase();
  if (!termino) return [];
  return productos.filter((producto) => {
    const cocinero = getCocinero(producto.cocineroId);
    return (
      producto.titulo.toLowerCase().includes(termino) ||
      producto.descripcion.toLowerCase().includes(termino) ||
      producto.tags.some((tag) => tag.toLowerCase().includes(termino)) ||
      (cocinero?.nombre.toLowerCase().includes(termino) ?? false)
    );
  });
}

export const categoriasSugeridas = ["Carnes", "Vegetariano", "Postres", "Sin TACC"];

export const busquedasRecientes = ["Milanesas", "Tarta de verduras", "Postres caseros"];

/** Filtra publicaciones según el modo y momento elegidos en el link "Enviar a". */
export function coincideConFiltro(
  producto: Producto,
  filtro: { modo: "Delivery" | "Retiro en el local" | "Ambas"; momento: string } | null,
): boolean {
  if (!filtro) return true;
  if (filtro.modo === "Delivery" && producto.entrega === "Retiro") return false;
  if (filtro.modo === "Retiro en el local" && producto.entrega === "Delivery") return false;
  const esHoy = filtro.momento.startsWith("Hoy") || filtro.momento.includes(":");
  if (esHoy) {
    const cocinero = getCocinero(producto.cocineroId);
    if (cocinero && !cocinero.entregaHoy) return false;
  }
  return true;
}
