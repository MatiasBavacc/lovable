import type { ReactNode } from "react";
import { BackHeader } from "@/components/back-header";

export function PantallaSimple({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion?: string;
  children?: ReactNode;
}) {
  return (
    <div className="pb-8">
      <BackHeader titulo={titulo} />
      {descripcion && <p className="px-4 pb-4 text-sm text-muted-foreground">{descripcion}</p>}
      <div className="space-y-4 px-4">{children}</div>
    </div>
  );
}

export function SeccionTexto({ titulo, parrafos }: { titulo: string; parrafos: string[] }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold">{titulo}</h2>
      {parrafos.map((parrafo, indice) => (
        <p key={indice} className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {parrafo}
        </p>
      ))}
    </section>
  );
}
