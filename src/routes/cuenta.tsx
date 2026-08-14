import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PantallaSimple } from "@/components/pantalla-simple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DireccionResumen } from "@/components/direccion-form";
import { useAppState, type DatosPersonales, type Direccion } from "@/lib/app-state";

export const Route = createFileRoute("/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi Perfil — Sabor Local" },
      { name: "description", content: "Gestioná tus datos y direcciones de entrega en Sabor Local." },
      { property: "og:title", content: "Mi Perfil — Sabor Local" },
      { property: "og:description", content: "Gestioná tus datos y direcciones de entrega en Sabor Local." },
    ],
  }),
  component: MiPerfil,
});

const vacia: Direccion = { id: "", calle: "", piso: "", referencia: "" };

function MiPerfil() {
  const { datos, setDatos, direcciones, guardarDireccion, eliminarDireccion } = useAppState();
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState<DatosPersonales>(datos);
  const [formulario, setFormulario] = useState<Direccion | null>(null);

  return (
    <PantallaSimple titulo="Mi Perfil" descripcion="Tus datos de cuenta en Sabor Local.">
      <section className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Datos personales</h2>
          {!editando && (
            <button
              type="button"
              aria-label="Editar datos personales"
              onClick={() => {
                setBorrador(datos);
                setEditando(true);
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-secondary active:scale-90"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {editando ? (
          <div className="mt-3 space-y-3">
            {(
              [
                ["nombre", "Nombre"],
                ["apellido", "Apellido"],
                ["telefono", "Teléfono"],
                ["email", "Email"],
              ] as Array<[keyof DatosPersonales, string]>
            ).map(([campo, etiqueta]) => (
              <div key={campo} className="space-y-1.5">
                <Label htmlFor={campo} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {etiqueta}
                </Label>
                <Input
                  id={campo}
                  value={borrador[campo]}
                  onChange={(evento) => setBorrador({ ...borrador, [campo]: evento.target.value })}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 rounded-xl"
                onClick={() => {
                  setDatos(borrador);
                  setEditando(false);
                  toast("Datos actualizados");
                }}
              >
                Guardar
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div>
              {datos.nombre} {datos.apellido}
            </div>
            <div>{datos.telefono}</div>
            <div>{datos.email}</div>
          </dl>
        )}
      </section>

      <section className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-base font-semibold">Direcciones guardadas</h2>

        <div className="mt-3 space-y-2">
          {direcciones.length === 0 && !formulario && (
            <p className="text-sm text-muted-foreground">Todavía no tenés direcciones guardadas.</p>
          )}

          {direcciones.map((direccion) => (
            <div key={direccion.id} className="flex items-start gap-2 rounded-xl border border-border p-3">
              <div className="min-w-0 flex-1">
                <DireccionResumen direccion={direccion} />
              </div>
              <button
                type="button"
                aria-label="Editar dirección"
                onClick={() => setFormulario(direccion)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary active:scale-90"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Eliminar dirección"
                onClick={() => eliminarDireccion(direccion.id)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground active:scale-90"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {formulario ? (
          <div className="mt-3 space-y-3">
            {(
              [
                ["calle", "Calle y número"],
                ["piso", "Piso / Depto (opcional)"],
                ["referencia", "Referencia (opcional)"],
              ] as Array<[keyof Omit<Direccion, "id">, string]>
            ).map(([campo, etiqueta]) => (
              <div key={campo} className="space-y-1.5">
                <Label htmlFor={campo} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {etiqueta}
                </Label>
                <Input
                  id={campo}
                  value={formulario[campo]}
                  onChange={(evento) => setFormulario({ ...formulario, [campo]: evento.target.value })}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 rounded-xl"
                disabled={!formulario.calle.trim()}
                onClick={() => {
                  guardarDireccion({ ...formulario, id: formulario.id || crypto.randomUUID() });
                  setFormulario(null);
                  toast("Dirección guardada");
                }}
              >
                Guardar
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setFormulario(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="mt-3 w-full rounded-xl"
            onClick={() => setFormulario({ ...vacia })}
          >
            <Plus className="h-4 w-4" />
            Agregar dirección
          </Button>
        )}
      </section>
    </PantallaSimple>
  );
}
