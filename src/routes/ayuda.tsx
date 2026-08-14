import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PantallaSimple } from "@/components/pantalla-simple";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: "Ayuda — Sabor Local" },
      { name: "description", content: "Preguntas frecuentes sobre pedidos, entregas, pagos y tu cuenta en Sabor Local." },
      { property: "og:title", content: "Ayuda — Sabor Local" },
      { property: "og:description", content: "Preguntas frecuentes sobre pedidos, entregas, pagos y tu cuenta en Sabor Local." },
    ],
  }),
  component: Ayuda,
});

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const categorias = [
  {
    clave: "pedidos",
    titulo: "Pedidos",
    preguntas: [
      "¿Cómo hago un pedido?",
      "¿Puedo modificar un pedido ya hecho?",
      "¿Qué pasa si el cocinero no entrega hoy?",
    ],
  },
  {
    clave: "entregas",
    titulo: "Entregas",
    preguntas: [
      "¿Cómo funcionan las entregas?",
      "¿Puedo retirar en el local?",
      "¿Cuánto demora el delivery?",
    ],
  },
  {
    clave: "pagos",
    titulo: "Pagos",
    preguntas: ["¿Qué medios de pago aceptan?", "¿Cómo se calcula el cargo de plataforma?"],
  },
  {
    clave: "cuenta",
    titulo: "Mi cuenta",
    preguntas: ["¿Cómo edito mis datos?", "¿Cómo guardo una dirección nueva?"],
  },
] as const;

function Ayuda() {
  const [activa, setActiva] = useState<string>(categorias[0].clave);
  const categoria = categorias.find((c) => c.clave === activa) ?? categorias[0];

  return (
    <PantallaSimple titulo="Ayuda" descripcion="Las preguntas más frecuentes de la comunidad.">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categorias.map((item) => (
          <button
            key={item.clave}
            type="button"
            onClick={() => setActiva(item.clave)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              item.clave === activa
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {item.titulo}
          </button>
        ))}
      </div>

      <section className="rounded-2xl bg-card px-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {categoria.preguntas.map((pregunta) => (
            <AccordionItem key={pregunta} value={pregunta}>
              <AccordionTrigger className="text-left text-sm font-semibold">
                {pregunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {lorem}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PantallaSimple>
  );
}
