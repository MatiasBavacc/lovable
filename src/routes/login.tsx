import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DireccionForm } from "@/components/direccion-form";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ motivo: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Sabor Local" },
      { name: "description", content: "Ingresá a tu cuenta de Sabor Local para confirmar tu pedido de viandas caseras." },
      { property: "og:title", content: "Iniciar sesión — Sabor Local" },
      { property: "og:description", content: "Ingresá a tu cuenta de Sabor Local para confirmar tu pedido de viandas caseras." },
    ],
  }),
  component: Login,
});

const explicaciones: Record<string, string> = {
  direccion: "Necesitamos tu dirección para mostrarte qué llega a tu zona.",
  favorito: "Iniciá sesión para guardar tus favoritos.",
  carrito: "Iniciá sesión para agregar platos a tu plato.",
};

function Login() {
  const { motivo } = Route.useSearch();
  const { iniciarSesion, direcciones, guardarDireccion } = useAppState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [pidiendoDireccion, setPidiendoDireccion] = useState(false);

  const listo = email.trim().length > 3 && clave.length >= 4;
  const destino = motivo ? "/" : "/checkout";

  function finalizar() {
    iniciarSesion(email.trim());
    navigate({ to: destino });
  }

  return (
    <div className="pb-10">
      <BackHeader titulo="Iniciar sesión" />

      {(direcciones.length === 0 || (motivo && explicaciones[motivo])) && (
        <p className="mx-4 mb-3 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-secondary-foreground">
          {direcciones.length === 0
            ? "Necesitamos tu dirección para mostrarte qué llega a tu zona"
            : explicaciones[motivo as string]}
        </p>
      )}

      {pidiendoDireccion ? (
        <div className="space-y-3 px-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Para continuar necesitamos al menos una dirección asociada a tu cuenta.
          </p>
          <DireccionForm
            prefijo="login"
            onGuardar={(direccion) => {
              guardarDireccion(direccion);
              finalizar();
            }}
          />
        </div>
      ) : (
        <form
          className="space-y-4 px-4 pt-2"
          onSubmit={(evento) => {
            evento.preventDefault();
            if (!listo) return;
            if (direcciones.length === 0) {
              setPidiendoDireccion(true);
              return;
            }
            finalizar();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="bg-card"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clave" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="clave"
                type={verClave ? "text" : "password"}
                autoComplete="current-password"
                className="bg-card pr-11"
                value={clave}
                onChange={(evento) => setClave(evento.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setVerClave((v) => !v)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground active:scale-90"
              >
                {verClave ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={!listo} className="h-12 w-full rounded-xl text-sm font-semibold">
            Iniciar sesión
          </Button>

          <div className="space-y-2 pt-1 text-center text-sm">
            <Link to="/recuperar" className="block font-medium text-primary">
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link to="/registro" className="font-semibold text-primary">
                Registrate
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
