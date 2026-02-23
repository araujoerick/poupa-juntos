import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getGroup, getContributions } from "@/lib/api";
import { ContributionFeed } from "@/components/contributions/ContributionFeed";
import { InviteLink } from "@/components/groups/InviteLink";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailPage({ params }: Props) {
  const { groupId } = await params;
  const { userId: clerkId } = await auth();

  let group, contributions;
  try {
    [group, contributions] = await Promise.all([
      getGroup(groupId),
      getContributions(groupId),
    ]);
  } catch {
    notFound();
  }

  const currentMember = group.members.find((m) => m.clerkId === clerkId);
  const currentUserId = currentMember?.id ?? "";

  const progressPercent =
    group.targetAmount && group.targetAmount > 0
      ? Math.min(100, Math.round((group.balance / group.targetAmount) * 100))
      : null;

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

      {/* Progresso da meta */}
      {group.targetAmount && (
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent ?? 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <MoneyDisplay amount={group.balance} />
            <MoneyDisplay amount={group.targetAmount} />
          </div>
          {group.deadline && (
            <p className="text-xs text-muted-foreground">
              Prazo:{" "}
              {new Date(group.deadline).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}

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

      {/* Feed de aportes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Aportes</h2>
        <ContributionFeed
          groupId={groupId}
          initialContributions={contributions}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
