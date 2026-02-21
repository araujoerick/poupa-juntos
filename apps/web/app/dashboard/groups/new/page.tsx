import Link from "next/link";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";

export default function NewGroupPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Criar Grupo</h1>
        <p className="text-muted-foreground text-sm">
          Crie um grupo e convide seus amigos para economizarem juntos.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <CreateGroupForm />
      </div>
    </div>
  );
}
