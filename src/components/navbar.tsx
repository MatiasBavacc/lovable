import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChefHat, LogOut, Menu, ShoppingBag, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EnviarA } from "@/components/enviar-a";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const itemsMenu = [
  { titulo: "Mi Perfil", url: "/cuenta" },
  { titulo: "Ayuda", url: "/ayuda" },
  { titulo: "Contacto", url: "/contacto" },
  { titulo: "Términos y Condiciones", url: "/terminos" },
  { titulo: "Política de Privacidad", url: "/privacidad" },
] as const;

export function Navbar() {
  const { itemsCarrito, sesion, cerrarSesion } = useAppState();
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const navigate = useNavigate();

  const conItems = itemsCarrito > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </span>
          </Link>
          <div className="min-w-0">
            <Link to="/" className="block font-display text-lg font-semibold leading-tight tracking-tight">
              Sabor Local
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/mi-plato"
            aria-label="Mi Plato"
            className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            <ShoppingBag
              className={cn("h-5 w-5", conItems ? "text-foreground" : "text-muted-foreground/40")}
            />
            {conItems && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {itemsCarrito}
              </span>
            )}
          </Link>

          <Sheet open={abierto} onOpenChange={setAbierto}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-background p-0">
              <SheetHeader className="border-b border-border p-5">
                <SheetTitle className="sr-only">Menú</SheetTitle>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{sesion ? "Mi cuenta" : "Invitado"}</p>
                    <p className="text-xs text-muted-foreground">
                      {sesion ? sesion.email : "Iniciá sesión para pedir"}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <nav className="flex flex-col p-2">
                {itemsMenu.map((item) => (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={() => setAbierto(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {item.titulo}
                  </Link>
                ))}

                {sesion ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAbierto(false);
                      setConfirmando(true);
                    }}
                    className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-destructive transition-colors hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setAbierto(false)}
                    className="mt-1 rounded-xl px-3 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>


      <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que querés cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a volver a la vidriera como Invitado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                cerrarSesion();
                navigate({ to: "/" });
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
