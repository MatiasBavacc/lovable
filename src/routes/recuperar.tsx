import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/recuperar")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña — Sabor Local" },
      { name: "description", content: "Recuperá el acceso a tu cuenta de Sabor Local con tu email." },
      { property: "og:title", content: "Recuperar contraseña — Sabor Local" },
      { property: "og:description", content: "Recuperá el acceso a tu cuenta de Sabor Local con tu email." },
    ],
  }),
  component: Recuperar,
});

function Recuperar() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="pb-10">
      <BackHeader titulo="Recuperar contraseña" />

      <div className="px-4 pt-2">
        {enviado ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center shadow-sm">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <MailCheck className="h-7 w-7 text-primary" />
            </span>
            <p className="text-sm text-muted-foreground">
              Si el email existe, vas a recibir instrucciones para recuperar tu contraseña.
            </p>
            <Button asChild className="w-full rounded-xl">
              <Link to="/login">Volver a Iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(evento) => {
              evento.preventDefault();
              if (email.trim().length < 4) return;
              setEnviado(true);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-card"
                placeholder="tu@email.com"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 w-full rounded-xl text-sm font-semibold">
              Enviar instrucciones
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
