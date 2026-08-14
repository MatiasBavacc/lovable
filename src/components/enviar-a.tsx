import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DireccionForm, DireccionResumen } from "@/components/direccion-form";
import { useAppState, type ModoFiltro } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const modos: ModoFiltro[] = ["Delivery", "Retiro en el local", "Ambas"];

function etiquetaModo(modo: ModoFiltro) {
  if (modo === "Retiro en el local") return "Retiro en el local";
  if (modo === "Ambas") return "Delivery y Retiro";
  return "Enviar a";
}

/** Link "Enviar a" del navbar + panel de filtro de entrega. */
export function EnviarA() {
  const { sesion, filtro, setFiltro, direcciones, guardarDireccion, entrega, setEntrega } = useAppState();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [modo, setModo] = useState<ModoFiltro>(filtro?.modo ?? "Delivery");
  const [momento, setMomento] = useState(filtro?.momento ?? "Hoy");
  const [direccionId, setDireccionId] = useState(filtro?.direccionId ?? direcciones[0]?.id ?? "");
  const [nuevaDireccion, setNuevaDireccion] = useState(false);

  const direccionElegida = direcciones.find((d) => d.id === (filtro?.direccionId ?? "")) ?? direcciones[0];
  const referencia = direccionElegida?.referencia?.trim() || direccionElegida?.calle || "tu dirección";

  let texto = "Enviar a";
  if (sesion && filtro) {
    if (filtro.modo === "Delivery") texto = `Enviar a: ${referencia} · ${filtro.momento}`;
    else texto = `${etiquetaModo(filtro.modo)} · ${filtro.momento}`;
  }

  function abrir() {
    if (!sesion) {
      navigate({ to: "/login", search: { motivo: "direccion" } });
      return;
    }
    setModo(filtro?.modo ?? "Delivery");
    setMomento(filtro?.momento ?? "Hoy");
    setDireccionId(filtro?.direccionId ?? direcciones[0]?.id ?? "");
    setNuevaDireccion(false);
    setAbierto(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="flex w-full items-center gap-1.5 py-2 text-xs text-muted-foreground"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="block truncate whitespace-nowrap">{texto}</span>
      </button>

      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-3xl bg-background">
          <SheetHeader>
            <SheetTitle className="font-display">¿Cómo lo querés recibir?</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 px-4 pb-8">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Modo
              </Label>
              <div className="grid gap-2">
                {modos.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setModo(opcion)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      modo === opcion ? "border-primary bg-primary/5 text-primary" : "border-border",
                    )}
                  >
                    {opcion}
                    {modo === opcion && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {modo !== "Retiro en el local" && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dirección
                </Label>
                {direcciones.map((direccion) => (
                  <button
                    key={direccion.id}
                    type="button"
                    onClick={() => setDireccionId(direccion.id)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                      direccion.id === direccionId ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <DireccionResumen direccion={direccion} />
                    </span>
                  </button>
                ))}
                {nuevaDireccion ? (
                  <DireccionForm
                    prefijo="envio"
                    onGuardar={(direccion) => {
                      guardarDireccion(direccion);
                      setDireccionId(direccion.id);
                      setNuevaDireccion(false);
                    }}
                    onCancelar={() => setNuevaDireccion(false)}
                  />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => setNuevaDireccion(true)}
                  >
                    + Agregar nueva dirección
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Momento
              </Label>
              <Button
                type="button"
                variant={momento === "Hoy" ? "default" : "outline"}
                className="w-full rounded-xl"
                onClick={() => setMomento("Hoy")}
              >
                Hoy (ahora)
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Elegir otro horario</span>
                  <Input
                    type="time"
                    className="bg-card"
                    onChange={(evento) => {
                      if (evento.target.value) setMomento(`Hoy ${evento.target.value}`);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Elegir otro día</span>
                  <Input
                    type="date"
                    className="bg-card"
                    onChange={(evento) => {
                      const valor = evento.target.value;
                      if (!valor) return;
                      const [ano, mes, dia] = valor.split("-");
                      setMomento(`${dia}/${mes}/${ano?.slice(2)}`);
                    }}
                  />
                </div>
              </div>
            </div>

            <Button
              className="h-12 w-full rounded-xl text-sm font-semibold"
              onClick={() => {
                setFiltro({ modo, momento, direccionId });
                const elegida = direcciones.find((d) => d.id === direccionId);
                setEntrega({
                  ...entrega,
                  modo: modo === "Retiro en el local" ? "Retiro en el local" : "Delivery",
                  fecha: momento,
                  direccion: elegida ? [elegida.calle, elegida.piso].filter(Boolean).join(", ") : "",
                });
                setAbierto(false);
              }}
            >
              Aplicar filtro
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
