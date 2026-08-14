import { createFileRoute } from "@tanstack/react-router";
import { EnviarA } from "@/components/enviar-a";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { Carrusel } from "@/components/carrusel";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { coincideConFiltro, productosDeSeccion, secciones } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sabor Local — Viandas caseras del barrio" },
      {
        name: "description",
        content:
          "Descubrí el menú del día, destacados y novedades de los cocineros de tu barrio. Delivery o retiro.",
      },
      { property: "og:title", content: "Sabor Local — Viandas caseras del barrio" },
      {
        property: "og:description",
        content: "Menú del día, destacados y novedades de los cocineros de tu barrio.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { filtro, setFiltro } = useAppState();

  const listados = secciones.map((seccion) => ({
    seccion,
    productos: productosDeSeccion(seccion.clave).filter((producto) =>
      coincideConFiltro(producto, filtro),
    ),
  }));
  const vacio = listados.every((listado) => listado.productos.length === 0);

  return (
    <div className="pb-6">
      <div className="mx-auto max-w-lg px-4">
         <EnviarA />
      </div>
      <div className="space-y-3 px-4 pt-4">
        <SearchBar />
      </div>

      {vacio ? (
        <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No encontramos publicaciones que coincidan con ese filtro
          </p>
          <Button className="rounded-xl" onClick={() => setFiltro(null)}>
            Quitar filtro
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {listados
            .filter((listado) => listado.productos.length > 0)
            .map(({ seccion, productos }) => (
              <Carrusel key={seccion.clave} titulo={seccion.titulo}>
                {productos.map((producto) => (
                  <ProductCard
                    key={`${seccion.clave}-${producto.id}`}
                    producto={producto}
                    className="w-44 shrink-0 snap-start"
                  />
                ))}
              </Carrusel>
            ))}
        </div>
      )}
    </div>
  );
}
