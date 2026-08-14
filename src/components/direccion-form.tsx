import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Direccion } from "@/lib/app-state";

export const direccionVacia: Direccion = { id: "", calle: "", piso: "", referencia: "" };

const camposDireccion = [
  ["calle", "Calle y número"],
  ["piso", "Piso / Depto (opcional)"],
  ["referencia", "Referencia (opcional)"],
] as const;

/** Formulario de dirección reutilizable (Mi Perfil, Registro, Login). */
export function DireccionForm({
  inicial,
  onGuardar,
  onCancelar,
  prefijo = "d",
}: {
  inicial?: Direccion | undefined;
  onGuardar: (direccion: Direccion) => void;
  onCancelar?: (() => void) | undefined;
  prefijo?: string | undefined;
}) {
  const [formulario, setFormulario] = useState<Direccion>(inicial ?? { ...direccionVacia });

  return (
    <div className="space-y-3">
      {camposDireccion.map(([campo, etiqueta]) => (
        <div key={campo} className="space-y-1.5">
          <Label
            htmlFor={`${prefijo}-${campo}`}
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {etiqueta}
          </Label>
          <Input
            id={`${prefijo}-${campo}`}
            className="bg-card"
            value={formulario[campo]}
            onChange={(evento) => setFormulario({ ...formulario, [campo]: evento.target.value })}
          />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          className="flex-1 rounded-xl"
          disabled={!formulario.calle.trim()}
          onClick={() => onGuardar({ ...formulario, id: formulario.id || crypto.randomUUID() })}
        >
          Guardar
        </Button>
        {onCancelar && (
          <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}

/** Texto completo de una dirección (calle + piso). */
export function textoDireccion(direccion: Direccion) {
  return [direccion.calle, direccion.piso].filter(Boolean).join(", ");
}

/** Muestra la referencia como título y la dirección completa debajo. */
export function DireccionResumen({ direccion }: { direccion: Direccion }) {
  const completa = textoDireccion(direccion);
  if (!direccion.referencia.trim()) {
    return <span className="block text-sm font-medium">{completa}</span>;
  }
  return (
    <>
      <span className="block text-sm font-medium">{direccion.referencia}</span>
      <span className="block text-xs text-muted-foreground">{completa}</span>
    </>
  );
}
