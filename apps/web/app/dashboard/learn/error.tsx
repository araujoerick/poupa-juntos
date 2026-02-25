"use client";

import { BookOpen } from "lucide-react";

export default function LearnError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <BookOpen className="w-10 h-10 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-semibold">Não conseguimos carregar os artigos</p>
        <p className="text-sm text-muted-foreground">
          Tente novamente em instantes.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="bg-coral text-white font-semibold rounded-xl py-2.5 px-6 text-sm transition-opacity hover:opacity-90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
