import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/app-state";
import { getCocinero } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$cocineroId")({
  head: () => ({
    meta: [
      { title: "Chat con el cocinero — Sabor Local" },
      { name: "description", content: "Conversá con el cocinero sobre tu pedido de viandas caseras." },
      { property: "og:title", content: "Chat con el cocinero — Sabor Local" },
      { property: "og:description", content: "Conversá con el cocinero sobre tu pedido de viandas caseras." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { cocineroId } = useParams({ from: "/chat/$cocineroId" });
  const { chats, enviarMensaje } = useAppState();
  const [texto, setTexto] = useState("");

  const cocinero = getCocinero(cocineroId);
  const mensajes = chats[cocineroId] ?? [];

  return (
    <div className="flex min-h-[70vh] flex-col pb-8">
      <BackHeader titulo={cocinero?.nombre ?? "Chat"} />

      <div className="flex-1 space-y-2 px-4 pt-2">
        {mensajes.length === 0 && (
          <p className="pt-10 text-center text-sm text-muted-foreground">
            Escribile al cocinero, te responde en un rato.
          </p>
        )}
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={cn(
              "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
              mensaje.de === "usuario"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-card",
            )}
          >
            <p>{mensaje.texto}</p>
            <p
              className={cn(
                "mt-1 text-[10px]",
                mensaje.de === "usuario" ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {mensaje.hora}
            </p>
          </div>
        ))}
      </div>

      <form
        className="sticky bottom-16 mt-4 flex items-center gap-2 px-4"
        onSubmit={(evento) => {
          evento.preventDefault();
          if (!texto.trim()) return;
          enviarMensaje(cocineroId, texto.trim());
          setTexto("");
        }}
      >
        <Input
          className="bg-card"
          placeholder="Escribí un mensaje..."
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground active:scale-90"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
