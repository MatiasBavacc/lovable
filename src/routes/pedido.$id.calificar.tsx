import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedido/$id/calificar")({
  head: () => ({
    meta: [
      { title: "Calificar pedido — Sabor Local" },
      { name: "description", content: "Contale a la comunidad cómo estuvo tu experiencia con el cocinero." },
      { property: "og:title", content: "Calificar pedido — Sabor Local" },
      { property: "og:description", content: "Contale a la comunidad cómo estuvo tu experiencia con el cocinero." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Calificar,
});

function Calificar() {
  const { id } = useParams({ from: "/pedido/$id/calificar" });
  const { getPedido, calificarPedido } = useAppState();
  const navigate = useNavigate();
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");

  const pedido = getPedido(id);

  return (
    <div className="pb-8">
      <BackHeader titulo="Calificar pedido" />

      <div className="space-y-4 px-4">
        <h2 className="text-base font-semibold">
          ¿Cómo estuvo tu experiencia con {pedido?.cocinero ?? "el cocinero"}?
        </h2>

        <div className="flex justify-center gap-2 rounded-2xl bg-card p-5 shadow-sm">
          {[1, 2, 3, 4, 5].map((valor) => (
            <button
              key={valor}
              type="button"
              aria-label={`${valor} estrellas`}
              onClick={() => setEstrellas(valor)}
              className="transition-transform active:scale-90"
            >
              <Star
                className={cn("h-8 w-8", valor <= estrellas ? "fill-star text-star" : "text-border")}
              />
            </button>
          ))}
        </div>

        <Textarea
          rows={4}
          className="bg-card"
          placeholder="Contanos más sobre tu experiencia (opcional)"
          value={comentario}
          onChange={(evento) => setComentario(evento.target.value)}
        />

        <Button
          className="h-12 w-full rounded-xl text-sm font-semibold"
          disabled={estrellas === 0}
          onClick={() => {
            calificarPedido(id, { estrellas, comentario: comentario.trim() });
            navigate({ to: "/pedido/$id", params: { id }, replace: true });
          }}
        >
          Enviar calificación
        </Button>
      </div>
    </div>
  );
}
