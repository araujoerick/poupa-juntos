import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getGroup, getContributions } from "@/lib/api";
import { ContributionFeed } from "@/components/contributions/ContributionFeed";
import { InviteLink } from "@/components/groups/InviteLink";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { TrustScoreBadge } from "@/components/groups/TrustScoreBadge";
import { MemberCard } from "@/components/groups/MemberCard";
import {
  calcTrustScore,
  calcDaysLeft,
  getMemberStatus,
  getMemberScore,
  getServerNow,
} from "@/lib/utils";

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

  const now = getServerNow();
  const currentMember = group.members.find((m) => m.clerkId === clerkId);
  const currentUserId = currentMember?.id ?? "";

  const trustScore = calcTrustScore(contributions);
  const pct =
    group.targetAmount && group.targetAmount > 0
      ? Math.min(100, Math.round((group.balance / group.targetAmount) * 100))
      : null;
  const daysLeft = group.deadline ? calcDaysLeft(group.deadline) : null;

  const memberData = group.members.map((member) => ({
    member,
    status: getMemberStatus(member, contributions, now),
    score: getMemberScore(member.id, contributions),
    isCurrentUser: member.id === currentUserId,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/groups"
            aria-label="Voltar"
            className="w-9 h-9 rounded-full bg-card card-shadow flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Grupo</p>
            <h1 className="text-lg font-bold leading-tight">Group Hub</h1>
          </div>
        </div>
        <TrustScoreBadge score={trustScore} />
      </div>

      {/* Group Info Card */}
      <div className="gradient-coral rounded-2xl p-5 card-shadow text-white space-y-4">
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          {daysLeft !== null && (
            <p className="text-white/70 text-sm mt-0.5">
              {daysLeft === 0
                ? "Prazo encerrado hoje"
                : `${daysLeft} dias restantes`}
            </p>
          )}
        </div>

        {/* Balance + Progress */}
        {group.targetAmount ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <MoneyDisplay amount={group.balance} className="font-semibold" />
              <MoneyDisplay
                amount={group.targetAmount}
                className="text-white/60"
              />
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${pct ?? 0}%` }}
              />
            </div>
            <p className="text-white/70 text-xs text-right">{pct}% da meta</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-white/70">Saldo atual</p>
            <MoneyDisplay
              amount={group.balance}
              className="text-2xl font-bold"
            />
          </div>
        )}

        {group.pendingBalance > 0 && (
          <p className="text-white/60 text-xs">
            +<MoneyDisplay amount={group.pendingBalance} className="inline" />{" "}
            aguardando validação
          </p>
        )}

        {/* Contribute CTA */}
        <Link
          href={`/dashboard/groups/${groupId}/contribute`}
          className="flex items-center justify-center gap-2 w-full bg-white text-coral font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90 active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Adicionar Aporte
        </Link>
      </div>

      {/* Invite Link */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Convite
        </p>
        <InviteLink inviteHash={group.inviteHash} />
      </div>

      {/* Members */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Membros · {group.members.length}
        </h2>
        {memberData.map(({ member, status, score, isCurrentUser }) => (
          <MemberCard
            key={member.id}
            name={member.name}
            status={status}
            score={score}
            isCurrentUser={isCurrentUser}
          />
        ))}
      </div>

      {/* Contribution Feed */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Histórico de Aportes
        </h2>
        <ContributionFeed
          groupId={groupId}
          initialContributions={contributions}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
