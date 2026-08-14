import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BackHeader } from "@/components/back-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DireccionForm, DireccionResumen } from "@/components/direccion-form";
import { useAppState, type Direccion } from "@/lib/app-state";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Sabor Local" },
      { name: "description", content: "Creá tu cuenta en Sabor Local y pedí viandas caseras a los cocineros de tu barrio." },
      { property: "og:title", content: "Crear cuenta — Sabor Local" },
      { property: "og:description", content: "Creá tu cuenta en Sabor Local y pedí viandas caseras a los cocineros de tu barrio." },
    ],
  }),
  component: Registro,
});

const campos = [
  { id: "nombre", etiqueta: "Nombre", tipo: "text" },
  { id: "apellido", etiqueta: "Apellido", tipo: "text" },
  { id: "email", etiqueta: "Email", tipo: "email" },
  { id: "telefono", etiqueta: "Teléfono", tipo: "tel" },
] as const;

type Campo = (typeof campos)[number]["id"];

function Registro() {
  const { iniciarSesion, datos, setDatos, guardarDireccion } = useAppState();
  const navigate = useNavigate();
  const [valores, setValores] = useState<Record<Campo, string>>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [clave, setClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [formularioAbierto, setFormularioAbierto] = useState(true);

  const completo = campos.every((campo) => valores[campo.id].trim().length > 1);
  const clavesOk = clave.length >= 6 && clave === confirmacion;
  const listo = completo && clavesOk && acepta && direcciones.length > 0;

  return (
    <div className="pb-10">
      <BackHeader titulo="Crear cuenta" />

      {direcciones.length === 0 && (
        <p className="mx-4 mb-3 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-secondary-foreground">
          Necesitamos tu dirección para mostrarte qué llega a tu zona
        </p>
      )}

      <form
        className="space-y-4 px-4 pt-2"
        onSubmit={(evento) => {
          evento.preventDefault();
          if (!listo) return;
          setDatos({
            ...datos,
            nombre: valores.nombre.trim(),
            apellido: valores.apellido.trim(),
            telefono: valores.telefono.trim(),
            email: valores.email.trim(),
          });
          direcciones.forEach((direccion) => guardarDireccion(direccion));
          iniciarSesion(valores.email.trim());
          navigate({ to: "/checkout" });
        }}
      >
        {campos.map((campo) => (
          <div key={campo.id} className="space-y-1.5">
            <Label htmlFor={campo.id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {campo.etiqueta}
            </Label>
            <Input
              id={campo.id}
              type={campo.tipo}
              className="bg-card"
              value={valores[campo.id]}
              onChange={(evento) => setValores({ ...valores, [campo.id]: evento.target.value })}
            />
          </div>
        ))}

        <div className="space-y-1.5">
          <Label htmlFor="clave" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="clave"
              type={verClave ? "text" : "password"}
              className="bg-card pr-11"
              value={clave}
              onChange={(evento) => setClave(evento.target.value)}
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmacion" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Confirmar contraseña
          </Label>
          <Input
            id="confirmacion"
            type={verClave ? "text" : "password"}
            className="bg-card"
            value={confirmacion}
            onChange={(evento) => setConfirmacion(evento.target.value)}
          />
          {confirmacion.length > 0 && clave !== confirmacion && (
            <p className="text-xs text-destructive">Las contraseñas no coinciden.</p>
          )}
        </div>

        <section className="space-y-3 rounded-xl bg-card p-3 shadow-sm">
          <h2 className="text-sm font-semibold">Dirección de entrega</h2>
          {direcciones.length > 0 && (
            <div className="space-y-2">
              {direcciones.map((direccion) => (
                <div key={direccion.id} className="rounded-xl border border-border p-3">
                  <DireccionResumen direccion={direccion} />
                </div>
              ))}
            </div>
          )}
          {formularioAbierto ? (
            <DireccionForm
              prefijo="reg"
              onGuardar={(direccion) => {
                setDirecciones((previas) => [...previas, direccion]);
                setFormularioAbierto(false);
              }}
              onCancelar={direcciones.length > 0 ? () => setFormularioAbierto(false) : undefined}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setFormularioAbierto(true)}
            >
              Agregar otra dirección
            </Button>
          )}
          {direcciones.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Necesitás cargar al menos una dirección para crear la cuenta.
            </p>
          )}
        </section>

        <label className="flex items-start gap-2.5 rounded-xl bg-card p-3 text-xs leading-relaxed shadow-sm">
          <Checkbox
            checked={acepta}
            onCheckedChange={(valor) => setAcepta(valor === true)}
            className="mt-0.5"
          />
          <span>
            Acepto los{" "}
            <Link to="/terminos" className="font-semibold text-primary">
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link to="/privacidad" className="font-semibold text-primary">
              Política de Privacidad
            </Link>
          </span>
        </label>

        <Button type="submit" disabled={!listo} className="h-12 w-full rounded-xl text-sm font-semibold">
          Crear cuenta
        </Button>
      </form>
    </div>
  );
}
