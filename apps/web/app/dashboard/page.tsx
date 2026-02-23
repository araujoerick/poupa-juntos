import Link from "next/link";
import { Bell } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getGroups, getContributions } from "@/lib/api";
import { calcDaysLeft } from "@/lib/utils";
import { PrimaryGroupCard } from "@/components/groups/PrimaryGroupCard";
import { SavingsStreakCard } from "@/components/groups/SavingsStreakCard";
import { GroupCard } from "@/components/groups/GroupCard";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { ContributionStatus } from "@poupa-juntos/shared-types";
import type { ContributionDTO } from "@poupa-juntos/shared-types";

function calcAIPrediction(contributions: ContributionDTO[]): number {
  const validated = contributions
    .filter((c) => c.status === ContributionStatus.VALIDATED)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  if (validated.length === 0) return 0;

  const avg =
    validated.reduce((sum, c) => sum + c.amount, 0) / validated.length;
  return Math.round(avg);
}

export default async function DashboardPage() {
  const [user, groups] = await Promise.all([currentUser(), getGroups()]);

  const firstName = user?.firstName ?? "você";
  const primaryGroup = groups[0] ?? null;
  const otherGroups = groups.slice(1);

  const contributions = primaryGroup
    ? await getContributions(primaryGroup.id)
    : [];

  const aiPrediction = calcAIPrediction(contributions);

  const primaryGroupDaysLeft =
    primaryGroup?.deadline != null ? calcDaysLeft(primaryGroup.deadline) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Bem-vindo de volta</p>
          <h1 className="text-xl font-bold">Olá, {firstName}! 👋</h1>
        </div>
        <button
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center card-shadow"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Primary Group Card */}
      {primaryGroup ? (
        <PrimaryGroupCard
          group={primaryGroup}
          daysLeft={primaryGroupDaysLeft}
        />
      ) : (
        <div className="gradient-coral rounded-2xl p-5 card-shadow text-white space-y-4">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wide font-medium">
              Pronto para começar?
            </p>
            <h2 className="text-xl font-bold mt-1">Crie seu primeiro grupo</h2>
            <p className="text-white/70 text-sm mt-1">
              Economize junto com quem você confia.
            </p>
          </div>
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
      )}

      {/* Stats Grid */}
      {primaryGroup && (
        <div className="grid grid-cols-2 gap-3">
          <SavingsStreakCard contributions={contributions} />

          <div className="bg-card rounded-2xl p-4 card-shadow flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xl" aria-hidden>
                🤖
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Previsão IA
              </span>
            </div>
            {aiPrediction > 0 ? (
              <>
                <MoneyDisplay
                  amount={aiPrediction}
                  className="text-xl font-bold text-teal"
                />
                <p className="text-xs text-muted-foreground">
                  previsto este mês
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground">sem dados ainda</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Other Groups */}
      {otherGroups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Outros grupos
            </h2>
            <Link
              href="/dashboard/groups/new"
              className="text-xs text-coral font-medium"
            >
              + Novo grupo
            </Link>
          </div>
          <div className="space-y-3">
            {otherGroups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                gradientIndex={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state actions (only when no groups at all) */}
      {groups.length === 0 && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Ou{" "}
          <Link
            href="/dashboard/groups/join"
            className="text-coral font-medium underline-offset-2 hover:underline"
          >
            entre em um grupo existente
          </Link>
          .
        </p>
      )}
    </div>
  );
}
