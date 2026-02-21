import Link from "next/link";
import { JoinGroupForm } from "@/components/groups/JoinGroupForm";

export default function JoinGroupPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Entrar em um Grupo</h1>
        <p className="text-muted-foreground text-sm">
          Cole o código de convite compartilhado por um membro do grupo.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <JoinGroupForm />
      </div>
    </div>
  );
}
