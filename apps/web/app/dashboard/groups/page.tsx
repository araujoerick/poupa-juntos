import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { getGroups } from "@/lib/api";
import { GroupCard } from "@/components/groups/GroupCard";

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Seus grupos
          </p>
          <h1 className="text-xl font-bold">Grupos Ativos</h1>
        </div>
        <Link
          href="/dashboard/groups/new"
          aria-label="Novo grupo"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-coral text-white card-shadow transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </Link>
      </div>

      {/* List */}
      {groups.length === 0 ? (
        <div className="gradient-coral rounded-2xl p-6 card-shadow text-white space-y-4">
          <p className="font-semibold text-lg">Nenhum grupo ainda</p>
          <p className="text-white/70 text-sm">
            Crie um grupo ou entre em um existente para começar a economizar
            junto.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard/groups/new"
              className="flex-1 text-center bg-white text-coral font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90"
            >
              Criar grupo
            </Link>
            <Link
              href="/dashboard/groups/join"
              className="flex-1 text-center bg-white/20 text-white font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90"
            >
              Entrar com convite
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {groups.map((group, index) => (
              <GroupCard key={group.id} group={group} gradientIndex={index} />
            ))}
          </div>

          {/* Join link */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <UserPlus className="w-4 h-4 text-muted-foreground" />
            <Link
              href="/dashboard/groups/join"
              className="text-sm text-muted-foreground hover:text-coral transition-colors"
            >
              Entrar com código de convite
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
