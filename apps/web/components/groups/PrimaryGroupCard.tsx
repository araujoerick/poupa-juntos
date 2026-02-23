import Link from "next/link";
import type { GroupDTO } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

interface Props {
  group: GroupDTO;
  daysLeft?: number | null;
}

export function PrimaryGroupCard({ group, daysLeft = null }: Props) {
  const pct =
    group.targetAmount && group.targetAmount > 0
      ? Math.min(100, Math.round((group.balance / group.targetAmount) * 100))
      : null;

  return (
    <div className="gradient-coral rounded-2xl p-5 card-shadow text-white space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide">
            Grupo em destaque
          </p>
          <h2 className="text-xl font-bold mt-0.5 truncate">{group.name}</h2>
          {daysLeft !== null && (
            <p className="text-white/60 text-xs mt-0.5">
              {daysLeft === 0 ? "Prazo hoje!" : `${daysLeft} dias restantes`}
            </p>
          )}
        </div>
        <span className="text-3xl ml-3 shrink-0">💰</span>
      </div>

      {/* Balance & Progress */}
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
          <p className="text-white/70 text-xs">Saldo atual</p>
          <MoneyDisplay amount={group.balance} className="text-2xl font-bold" />
        </div>
      )}

      {/* Pending balance */}
      {group.pendingBalance > 0 && (
        <p className="text-white/60 text-xs">
          +
          <MoneyDisplay amount={group.pendingBalance} className="inline" />{" "}
          pendente de validação
        </p>
      )}

      {/* CTA */}
      <Link
        href={`/dashboard/groups/${group.id}/contribute`}
        className="block w-full text-center bg-white text-coral font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90 active:scale-95"
      >
        Adicionar Aporte
      </Link>
    </div>
  );
}
