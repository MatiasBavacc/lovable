import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ImagePlus, LifeBuoy } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedido/$id/reclamo")({
  head: () => ({
    meta: [
      { title: "Iniciar un reclamo — Sabor Local" },
      { name: "description", content: "Contanos qué pasó con tu pedido y nuestro equipo te responde en menos de 48hs." },
      { property: "og:title", content: "Iniciar un reclamo — Sabor Local" },
      { property: "og:description", content: "Contanos qué pasó con tu pedido y nuestro equipo te responde en menos de 48hs." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reclamo,
});

const motivos = [
  {
    clave: "Pedido incompleto",
    faq: "Si falta un producto, el cocinero puede reponerlo en tu próxima compra o generamos el reintegro proporcional del ítem faltante.",
  },
  {
    clave: "Producto en mal estado",
    faq: "Sacá una foto del producto apenas lo recibas: con esa evidencia el reintegro suele resolverse el mismo día.",
  },
  {
    clave: "Demora excesiva",
    faq: "Los tiempos estimados pueden variar en horas pico. Si pasaron más de 45 minutos del horario informado, el pedido se puede cancelar sin costo.",
  },
  {
    clave: "Cobro incorrecto",
    faq: "Revisá el detalle del pedido: el total incluye un cargo de plataforma del 5%. Si aún así no coincide, seguí con el reclamo.",
  },
  {
    clave: "Otro",
    faq: "Contanos con tus palabras qué pasó y lo derivamos al equipo de soporte correspondiente.",
  },
];

function Reclamo() {
  const { id } = useParams({ from: "/pedido/$id/reclamo" });
  const { crearReclamo } = useAppState();
  const navigate = useNavigate();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [numero, setNumero] = useState(0);

  const seleccionado = motivos.find((m) => m.clave === motivo);

  if (paso === 3) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 pb-10 pt-16 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </span>
        <h1 className="font-display text-2xl font-semibold">Tu reclamo fue enviado</h1>
        <p className="text-sm text-muted-foreground">
          Nuestro equipo te va a responder en menos de 48hs. Podés ver el estado desde el detalle de tu pedido.
        </p>
        <p className="text-sm font-semibold">Reclamo #{numero}</p>
        <Button asChild className="h-12 w-full rounded-xl text-sm font-semibold">
          <Link to="/pedido/$id" params={{ id }}>
            Volver al pedido
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <BackHeader titulo="Reclamo" />

      <div className="space-y-4 px-4">
        {paso === 1 ? (
          <>
            <h2 className="text-base font-semibold">¿Cuál es el motivo de tu reclamo?</h2>
            <div className="space-y-2">
              {motivos.map((opcion) => (
                <button
                  key={opcion.clave}
                  type="button"
                  onClick={() => setMotivo(opcion.clave)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left text-sm transition-colors",
                    motivo === opcion.clave ? "border-primary" : "border-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      motivo === opcion.clave ? "border-primary" : "border-border",
                    )}
                  >
                    {motivo === opcion.clave && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </span>
                  {opcion.clave}
                </button>
              ))}
            </div>

            {seleccionado && (
              <section className="space-y-3 rounded-2xl bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <LifeBuoy className="h-4 w-4 text-primary" />
                  Esto puede ayudarte
                </p>
                <p className="text-sm text-muted-foreground">{seleccionado.faq}</p>
                <Button variant="outline" className="w-full rounded-xl bg-card" onClick={() => setPaso(2)}>
                  Esto no resolvió mi problema, continuar reclamo
                </Button>
              </section>
            )}
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold">Contanos qué pasó</h2>
            <Textarea
              rows={5}
              className="bg-card"
              placeholder="Describí lo que pasó con tu pedido..."
              value={detalle}
              onChange={(evento) => setDetalle(evento.target.value)}
            />
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground">
              <ImagePlus className="h-4 w-4" />
              Adjuntar foto
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <Button
              className="h-12 w-full rounded-xl text-sm font-semibold"
              disabled={detalle.trim().length < 5}
              onClick={() => {
                setNumero(crearReclamo(id, motivo, detalle.trim()));
                setPaso(3);
              }}
            >
              Enviar reclamo
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-xl text-sm"
              onClick={() => navigate({ to: "/pedido/$id", params: { id } })}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
