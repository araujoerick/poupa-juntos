import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroup, getContributions } from "@/lib/api";
import { GoalCard } from "@/components/goals/GoalCard";
import { ContributionFeed } from "@/components/contributions/ContributionFeed";
import { GoalProgressChart } from "@/components/goals/GoalProgressChart";
import { InviteLink } from "@/components/groups/InviteLink";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailPage({ params }: Props) {
  const { groupId } = await params;

  let group, contributions;
  try {
    [group, contributions] = await Promise.all([
      getGroup(groupId),
      getContributions(groupId),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Grupos
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-muted-foreground">
            {group.members.length} membro
            {group.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/dashboard/groups/${groupId}/contribute`}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + Aporte
        </Link>
      </div>

      {/* Saldo */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Saldo Confirmado</p>
          <MoneyDisplay amount={group.balance} className="text-2xl font-bold" />
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Aguardando Validação</p>
          <MoneyDisplay
            amount={group.pendingBalance}
            className="text-2xl font-bold text-yellow-700"
          />
        </div>
      </div>

      {/* Link de convite */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Convite</p>
        <InviteLink inviteHash={group.inviteHash} />
      </div>

      {/* Metas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Metas</h2>
          <Link
            href={`/dashboard/groups/${groupId}/goals/new`}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Nova meta
          </Link>
        </div>

        {group.goals && group.goals.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  confirmedBalance={group.balance}
                />
              ))}
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">Progresso dos Aportes</p>
              <GoalProgressChart
                contributions={contributions}
                targetAmount={group.goals[0]?.targetAmount ?? 0}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma meta criada ainda.{" "}
            <Link
              href={`/dashboard/groups/${groupId}/goals/new`}
              className="font-medium text-primary hover:underline"
            >
              Criar meta
            </Link>
          </p>
        )}
      </div>

      {/* Feed de aportes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Aportes</h2>
        <ContributionFeed
          groupId={groupId}
          initialContributions={contributions}
        />
      </div>
    </div>
  );
}
