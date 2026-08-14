import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";
import { PantallaSimple, SeccionTexto } from "@/components/pantalla-simple";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Sabor Local" },
      { name: "description", content: "Escribinos por WhatsApp o email por consultas, sugerencias o para sumarte como cocinero." },
      { property: "og:title", content: "Contacto — Sabor Local" },
      { property: "og:description", content: "Escribinos por WhatsApp o email por consultas, sugerencias o para sumarte como cocinero." },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <PantallaSimple titulo="Contacto" descripcion="Escribinos y te respondemos dentro de las 48hs.">
      <div className="space-y-2">
        <Button asChild className="h-12 w-full rounded-xl text-sm font-semibold">
          <a href="https://wa.me/5491155551234" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Escribinos por WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" className="h-12 w-full rounded-xl text-sm font-semibold">
          <a href="mailto:hola@saborlocal.com.ar">
            <Mail className="h-4 w-4" />
            Enviarnos un email
          </a>
        </Button>
        <Link
          to="/ayuda"
          className="flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-primary"
        >
          <HelpCircle className="h-4 w-4" />
          Ver preguntas frecuentes
        </Link>
      </div>

      <SeccionTexto titulo="Soporte" parrafos={["hola@saborlocal.com.ar", "Lunes a viernes de 9 a 18hs."]} />
      <SeccionTexto titulo="Quiero cocinar" parrafos={["Si querés sumarte como cocinero, escribinos a cocinas@saborlocal.com.ar."]} />
    </PantallaSimple>
  );
}
