import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackHeader({ titulo }: { titulo: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 px-4 pb-2 pt-4">
      <button
        type="button"
        aria-label="Volver"
        onClick={() => router.history.back()}
        className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-sm transition-transform active:scale-90"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <h1 className="text-lg font-semibold">{titulo}</h1>
    </div>
  );
}
