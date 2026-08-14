import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ModoEntrega = "Delivery" | "Retiro en el local";

export type ContextoEntrega = {
  modo: ModoEntrega;
  fecha: string; // "Hoy" o una fecha elegida (formato corto)
  direccion: string;
};

export type ModoFiltro = ModoEntrega | "Ambas";

/** Filtro de entrega elegido desde el link "Enviar a" del navbar. */
export type FiltroEntrega = {
  modo: ModoFiltro;
  momento: string;
  direccionId: string;
};

export type ItemCarrito = { productoId: string; cantidad: number };

export type DatosPersonales = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
};

export type Direccion = {
  id: string;
  calle: string;
  piso: string;
  referencia: string;
};

type Sesion = { email: string } | null;

export type PedidoConfirmado = {
  numero: number;
  cocineroId: string;
  cocinero: string;
  estimado: string;
};

export type LineaPedido = {
  productoId: string;
  titulo: string;
  imagen: string;
  cantidad: number;
  precio: number;
};

export type Calificacion = { estrellas: number; comentario: string };

export type Reclamo = {
  numero: number;
  motivo: string;
  detalle: string;
  estado: "En curso" | "Resuelto";
};

/** paso 0=Confirmado, 1=Preparando, 2=Listo/En camino, 3=Entregado */
export type Pedido = {
  id: string;
  numero: number;
  cocineroId: string;
  cocinero: string;
  modo: ModoEntrega;
  lugar: string;
  horario: string;
  nota: string;
  fecha: string;
  lineas: LineaPedido[];
  subtotal: number;
  cargo: number;
  total: number;
  paso: number;
  cancelado: boolean;
  calificacion?: Calificacion;
  reclamo?: Reclamo;
};

export type TipoNotificacion = "pedido" | "mensaje" | "promo";

export type Notificacion = {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  texto: string;
  fecha: string;
  leida: boolean;
  pedidoId?: string;
  cocineroId?: string;
};

export type Mensaje = { id: string; de: "usuario" | "cocinero"; texto: string; hora: string };

export type BorradorGrupo = { nota: string; lugar: string };

type AppState = {
  // Carrito
  carrito: ItemCarrito[];
  itemsCarrito: number;
  agregarAlCarrito: (productoId: string, cantidad: number) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  quitarDelCarrito: (productoId: string) => void;
  vaciarCarrito: () => void;

  // Favoritos
  favoritos: string[];
  esFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;

  // Favoritos de vendedores
  cocinerosFavoritos: string[];
  esCocineroFavorito: (id: string) => boolean;
  alternarCocineroFavorito: (id: string) => void;

  // Contexto de entrega
  entrega: ContextoEntrega;
  setEntrega: (entrega: ContextoEntrega) => void;

  // Filtro de entrega (link "Enviar a")
  filtro: FiltroEntrega | null;
  setFiltro: (filtro: FiltroEntrega | null) => void;

  // Perfil
  datos: DatosPersonales;
  setDatos: (datos: DatosPersonales) => void;
  direcciones: Direccion[];
  guardarDireccion: (direccion: Direccion) => void;
  eliminarDireccion: (id: string) => void;

  // Sesión simulada (sin backend todavía)
  sesion: Sesion;
  cerrarSesion: () => void;
  iniciarSesion: (email?: string) => void;

  // Último pedido confirmado (para la pantalla de confirmación)
  ultimoPedido: PedidoConfirmado[];
  setUltimoPedido: (pedidos: PedidoConfirmado[]) => void;

  // Datos que el checkout deja listos para el pago (nota y lugar por vendedor)
  borrador: Record<string, BorradorGrupo>;
  setBorrador: (borrador: Record<string, BorradorGrupo>) => void;

  // Pedidos
  pedidos: Pedido[];
  crearPedidos: (pedidos: Pedido[]) => void;
  getPedido: (id: string) => Pedido | undefined;
  avanzarPedido: (id: string) => void;
  calificarPedido: (id: string, calificacion: Calificacion) => void;
  crearReclamo: (id: string, motivo: string, detalle: string) => number;
  alternarEstadoReclamo: (id: string) => void;

  // Notificaciones
  notificaciones: Notificacion[];
  agregarNotificacion: (notificacion: Omit<Notificacion, "id" | "fecha" | "leida">) => void;
  marcarLeida: (id: string) => void;
  noLeidas: number;

  // Chat con vendedores
  chats: Record<string, Mensaje[]>;
  enviarMensaje: (cocineroId: string, texto: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

function ahora() {
  return new Date().toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const pedidosIniciales: Pedido[] = [
  {
    id: "p-1201",
    numero: 1201,
    cocineroId: "dona-elsa",
    cocinero: "Doña Elsa",
    modo: "Delivery",
    lugar: "Av. Corrientes 4820, 3B",
    horario: "Hoy de 12 a 15hs",
    nota: "Sin sal, por favor",
    fecha: "Hoy",
    lineas: [
      { productoId: "milanesas-napolitanas", titulo: "Milanesas napolitanas con puré", imagen: "", cantidad: 2, precio: 7200 },
    ],
    subtotal: 14400,
    cargo: 720,
    total: 15120,
    paso: 1,
    cancelado: false,
  },
  {
    id: "p-1188",
    numero: 1188,
    cocineroId: "dulce-rocio",
    cocinero: "Dulce Rocío",
    modo: "Retiro en el local",
    lugar: "Rojas 780, Caballito",
    horario: "Retirado 10:40hs",
    nota: "",
    fecha: "12 jul",
    lineas: [
      { productoId: "budin-limon", titulo: "Budín de limón glaseado", imagen: "", cantidad: 1, precio: 3900 },
      { productoId: "alfajores-maicena", titulo: "Alfajores de maicena (x6)", imagen: "", cantidad: 1, precio: 4300 },
    ],
    subtotal: 8200,
    cargo: 410,
    total: 8610,
    paso: 3,
    cancelado: false,
  },
];

const notificacionesIniciales: Notificacion[] = [
  {
    id: "n-1",
    tipo: "pedido",
    titulo: "Tu pedido de Doña Elsa está en preparación",
    texto: "Pedido #1201 — te avisamos cuando salga.",
    fecha: "Hace 10 min",
    leida: false,
    pedidoId: "p-1201",
  },
  {
    id: "n-2",
    tipo: "mensaje",
    titulo: "Mensaje de Doña Elsa",
    texto: "¡Hola! Tu vianda sale en un rato 😊",
    fecha: "Hace 25 min",
    leida: false,
    cocineroId: "dona-elsa",
  },
  {
    id: "n-3",
    tipo: "promo",
    titulo: "20% off en postres caseros",
    texto: "Dulce Rocío suma nuevos alfajores esta semana.",
    fecha: "Ayer",
    leida: true,
  },
];

const chatsIniciales: Record<string, Mensaje[]> = {
  "dona-elsa": [
    { id: "m-1", de: "cocinero", texto: "¡Hola! Tu vianda sale en un rato 😊", hora: "11:35" },
  ],
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([
    { productoId: "milanesas-napolitanas", cantidad: 2 },
    { productoId: "guiso-lentejas", cantidad: 1 },
    { productoId: "budin-limon", cantidad: 1 },
  ]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [cocinerosFavoritos, setCocinerosFavoritos] = useState<string[]>([]);
  const [entrega, setEntrega] = useState<ContextoEntrega>({
    modo: "Delivery",
    fecha: "Hoy",
    direccion: "",
  });
  const [filtro, setFiltro] = useState<FiltroEntrega | null>(null);
  const [datos, setDatos] = useState<DatosPersonales>({
    nombre: "Sofía",
    apellido: "López",
    telefono: "+54 9 11 5555-1234",
    email: "sofia.lopez@mail.com",
  });
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [sesion, setSesion] = useState<Sesion>(null);
  const [ultimoPedido, setUltimoPedido] = useState<PedidoConfirmado[]>([]);
  const [borrador, setBorrador] = useState<Record<string, BorradorGrupo>>({});
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales);
  const [chats, setChats] = useState<Record<string, Mensaje[]>>(chatsIniciales);

  const agregarAlCarrito = useCallback((productoId: string, cantidad: number) => {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.productoId === productoId);
      if (existente) {
        return actual.map((item) =>
          item.productoId === productoId ? { ...item, cantidad: item.cantidad + cantidad } : item,
        );
      }
      return [...actual, { productoId, cantidad }];
    });
  }, []);

  const cambiarCantidad = useCallback((productoId: string, cantidad: number) => {
    setCarrito((actual) =>
      cantidad <= 0
        ? actual.filter((item) => item.productoId !== productoId)
        : actual.map((item) => (item.productoId === productoId ? { ...item, cantidad } : item)),
    );
  }, []);

  const quitarDelCarrito = useCallback((productoId: string) => {
    setCarrito((actual) => actual.filter((item) => item.productoId !== productoId));
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos((actuales) =>
      actuales.includes(id) ? actuales.filter((f) => f !== id) : [...actuales, id],
    );
  }, []);

  const alternarCocineroFavorito = useCallback((id: string) => {
    setCocinerosFavoritos((actuales) =>
      actuales.includes(id) ? actuales.filter((f) => f !== id) : [...actuales, id],
    );
  }, []);

  const guardarDireccion = useCallback((direccion: Direccion) => {
    setDirecciones((actuales) => {
      const existe = actuales.some((d) => d.id === direccion.id);
      return existe ? actuales.map((d) => (d.id === direccion.id ? direccion : d)) : [...actuales, direccion];
    });
  }, []);

  const eliminarDireccion = useCallback((id: string) => {
    setDirecciones((actuales) => actuales.filter((d) => d.id !== id));
  }, []);

  const agregarNotificacion = useCallback(
    (notificacion: Omit<Notificacion, "id" | "fecha" | "leida">) => {
      setNotificaciones((actuales) => [
        { ...notificacion, id: `n-${Date.now()}-${actuales.length}`, fecha: ahora(), leida: false },
        ...actuales,
      ]);
    },
    [],
  );

  const crearPedidos = useCallback((nuevos: Pedido[]) => {
    setPedidos((actuales) => [...nuevos, ...actuales]);
    setNotificaciones((actuales) => [
      ...nuevos.map((pedido, indice) => ({
        id: `n-${Date.now()}-${indice}`,
        tipo: "pedido" as const,
        titulo: `Tu pedido de ${pedido.cocinero} fue confirmado`,
        texto: `Pedido #${pedido.numero} — ${pedido.horario}`,
        fecha: ahora(),
        leida: false,
        pedidoId: pedido.id,
      })),
      ...actuales,
    ]);
  }, []);

  const avanzarPedido = useCallback(
    (id: string) => {
      const pedido = pedidos.find((p) => p.id === id);
      if (!pedido || pedido.paso >= 3) return;
      const nuevoPaso = pedido.paso + 1;
      const etiquetas = [
        "fue confirmado",
        "está en preparación",
        pedido.modo === "Delivery" ? "está en camino" : "está listo para retirar",
        "fue entregado",
      ];
      setPedidos((actuales) => actuales.map((p) => (p.id === id ? { ...p, paso: nuevoPaso } : p)));
      setNotificaciones((previas) => [
        {
          id: `n-${Date.now()}`,
          tipo: "pedido" as const,
          titulo: `Tu pedido de ${pedido.cocinero} ${etiquetas[nuevoPaso]}`,
          texto: `Pedido #${pedido.numero}`,
          fecha: ahora(),
          leida: false,
          pedidoId: pedido.id,
        },
        ...previas,
      ]);
    },
    [pedidos],
  );

  const calificarPedido = useCallback((id: string, calificacion: Calificacion) => {
    setPedidos((actuales) => actuales.map((p) => (p.id === id ? { ...p, calificacion } : p)));
  }, []);

  const crearReclamo = useCallback((id: string, motivo: string, detalle: string) => {
    const numero = 8400 + Math.floor(Math.random() * 500);
    setPedidos((actuales) =>
      actuales.map((p) => (p.id === id ? { ...p, reclamo: { numero, motivo, detalle, estado: "En curso" } } : p)),
    );
    return numero;
  }, []);

  const alternarEstadoReclamo = useCallback((id: string) => {
    setPedidos((actuales) =>
      actuales.map((p) =>
        p.id === id && p.reclamo
          ? { ...p, reclamo: { ...p.reclamo, estado: p.reclamo.estado === "En curso" ? "Resuelto" : "En curso" } }
          : p,
      ),
    );
  }, []);

  const marcarLeida = useCallback((id: string) => {
    setNotificaciones((actuales) => actuales.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  }, []);

  const enviarMensaje = useCallback((cocineroId: string, texto: string) => {
    const hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    setChats((actuales) => ({
      ...actuales,
      [cocineroId]: [
        ...(actuales[cocineroId] ?? []),
        { id: `m-${Date.now()}`, de: "usuario", texto, hora },
      ],
    }));
    setTimeout(() => {
      setChats((actuales) => ({
        ...actuales,
        [cocineroId]: [
          ...(actuales[cocineroId] ?? []),
          {
            id: `m-${Date.now()}-r`,
            de: "cocinero",
            texto: "¡Gracias por escribir! Te respondo en un ratito.",
            hora,
          },
        ],
      }));
    }, 900);
  }, []);

  const itemsCarrito = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito],
  );

  const noLeidas = useMemo(
    () => notificaciones.filter((n) => !n.leida).length,
    [notificaciones],
  );

  const valor = useMemo<AppState>(
    () => ({
      carrito,
      itemsCarrito,
      agregarAlCarrito,
      cambiarCantidad,
      quitarDelCarrito,
      vaciarCarrito,
      favoritos,
      esFavorito: (id: string) => favoritos.includes(id),
      alternarFavorito,
      cocinerosFavoritos,
      esCocineroFavorito: (id: string) => cocinerosFavoritos.includes(id),
      alternarCocineroFavorito,
      entrega,
      setEntrega,
      filtro,
      setFiltro,
      datos,
      setDatos,
      direcciones,
      guardarDireccion,
      eliminarDireccion,
      sesion,
      cerrarSesion: () => setSesion(null),
      iniciarSesion: (email?: string) => setSesion({ email: email ?? datos.email }),
      ultimoPedido,
      setUltimoPedido,
      borrador,
      setBorrador,
      pedidos,
      crearPedidos,
      getPedido: (id: string) => pedidos.find((p) => p.id === id),
      avanzarPedido,
      calificarPedido,
      crearReclamo,
      alternarEstadoReclamo,
      notificaciones,
      agregarNotificacion,
      marcarLeida,
      noLeidas,
      chats,
      enviarMensaje,
    }),
    [
      carrito,
      itemsCarrito,
      agregarAlCarrito,
      cambiarCantidad,
      quitarDelCarrito,
      vaciarCarrito,
      favoritos,
      alternarFavorito,
      cocinerosFavoritos,
      alternarCocineroFavorito,
      entrega,
      filtro,
      datos,
      direcciones,
      guardarDireccion,
      eliminarDireccion,
      sesion,
      ultimoPedido,
      borrador,
      pedidos,
      crearPedidos,
      avanzarPedido,
      calificarPedido,
      crearReclamo,
      alternarEstadoReclamo,
      notificaciones,
      agregarNotificacion,
      marcarLeida,
      noLeidas,
      chats,
      enviarMensaje,
    ],
  );

  return <AppStateContext.Provider value={valor}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const contexto = useContext(AppStateContext);
  if (!contexto) throw new Error("useAppState debe usarse dentro de AppStateProvider");
  return contexto;
}
