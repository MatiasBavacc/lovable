import { createFileRoute } from "@tanstack/react-router";
import { PantallaSimple, SeccionTexto } from "@/components/pantalla-simple";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Sabor Local" },
      { name: "description", content: "Términos y condiciones de uso de la plataforma Sabor Local." },
      { property: "og:title", content: "Términos y Condiciones — Sabor Local" },
      { property: "og:description", content: "Términos y condiciones de uso de la plataforma Sabor Local." },
    ],
  }),
  component: Terminos,
});

function Terminos() {
  return (
    <PantallaSimple titulo="Términos y Condiciones">
      <SeccionTexto titulo="1. Uso de la plataforma" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="2. Pedidos y pagos" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="3. Cancelaciones" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="4. Responsabilidades" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
    </PantallaSimple>
  );
}
