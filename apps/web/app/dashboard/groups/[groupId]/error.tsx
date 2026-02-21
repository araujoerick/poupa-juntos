"use client";

export default function GroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-destructive font-medium">Erro ao carregar o grupo.</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="text-sm font-medium text-primary hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  );
}
