import { createFileRoute } from "@tanstack/react-router";
import { PantallaSimple, SeccionTexto } from "@/components/pantalla-simple";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — Sabor Local" },
      { name: "description", content: "Cómo tratamos y protegemos tus datos personales en Sabor Local." },
      { property: "og:title", content: "Política de Privacidad — Sabor Local" },
      { property: "og:description", content: "Cómo tratamos y protegemos tus datos personales en Sabor Local." },
    ],
  }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <PantallaSimple titulo="Política de Privacidad">
      <SeccionTexto titulo="1. Datos que recolectamos" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="2. Uso de la información" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="3. Cookies" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
      <SeccionTexto titulo="4. Tus derechos" parrafos={["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]} />
    </PantallaSimple>
  );
}
