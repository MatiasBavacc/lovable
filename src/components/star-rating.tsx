import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  valor,
  tamano = 14,
  className,
}: {
  valor: number;
  tamano?: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label={`${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((indice) => (
        <Star
          key={indice}
          width={tamano}
          height={tamano}
          className={cn(
            indice <= Math.round(valor) ? "fill-star text-star" : "text-border",
          )}
        />
      ))}
    </span>
  );
}
