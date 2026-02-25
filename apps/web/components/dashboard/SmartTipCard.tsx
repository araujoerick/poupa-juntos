import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  tip: string;
}

export function SmartTipCard({ tip }: Props) {
  return (
    <Link href="/dashboard/learn" className="block h-full">
      <div className="bg-card rounded-2xl p-3 card-shadow flex flex-col gap-1.5 h-full transition-opacity hover:opacity-90 active:opacity-80">
        <div className="flex items-center justify-between">
          <span className="text-base" aria-hidden>
            💡
          </span>
          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
        </div>
        <p className="text-[10px] font-semibold text-foreground leading-none">
          Dica do dia
        </p>
        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-3 flex-1">
          {tip}
        </p>
      </div>
    </Link>
  );
}
