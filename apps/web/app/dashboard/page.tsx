import Link from "next/link";
import { getGroups } from "@/lib/api";
import { GroupCard } from "@/components/groups/GroupCard";

export default async function DashboardPage() {
  const groups = await getGroups();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Grupos</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/groups/join"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Entrar com convite
          </Link>
          <Link
            href="/dashboard/groups/new"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            + Novo grupo
          </Link>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            Você ainda não participa de nenhum grupo.
          </p>
          <Link
            href="/dashboard/groups/new"
            className="text-sm font-medium text-primary hover:underline"
          >
            Criar meu primeiro grupo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
