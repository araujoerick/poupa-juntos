import Link from "next/link";
import type { GroupDTO } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

const GRADIENTS = [
  "gradient-coral",
  "gradient-purple",
  "gradient-teal",
  "gradient-pink",
] as const;

interface GroupCardProps {
  group: GroupDTO;
  gradientIndex?: number;
}

export function GroupCard({ group, gradientIndex = 0 }: GroupCardProps) {
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length];

  const pct =
    group.targetAmount && group.targetAmount > 0
      ? Math.min(100, Math.round((group.balance / group.targetAmount) * 100))
      : null;

  return (
    <Link href={`/dashboard/groups/${group.id}`} className="block">
      <div
        className={`${gradient} rounded-2xl p-4 card-shadow text-white space-y-3 transition-opacity hover:opacity-90 active:opacity-80`}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-semibold truncate mr-2">{group.name}</h3>
          <span className="text-xs text-white/70 shrink-0">
            {group.members.length} membro
            {group.members.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/70">Saldo</p>
            <MoneyDisplay amount={group.balance} className="font-bold" />
          </div>
          {group.targetAmount && (
            <div className="text-right">
              <p className="text-xs text-white/70">Meta</p>
              <MoneyDisplay
                amount={group.targetAmount}
                className="text-sm font-medium text-white/80"
              />
            </div>
          )}
        </div>

        {pct !== null && (
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-white/60 text-right">{pct}%</p>
          </div>
        )}
      </div>
    </Link>
  );
}
