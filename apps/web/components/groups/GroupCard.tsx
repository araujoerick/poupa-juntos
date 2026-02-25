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

function MemberAvatars({ members }: { members: GroupDTO["members"] }) {
  const visible = members.slice(0, 3);
  const overflow = members.length - visible.length;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1.5">
        {visible.map((member) => (
          <div
            key={member.id}
            title={member.name}
            className="w-6 h-6 rounded-full bg-white/30 border border-white/50 flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/50 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-xs text-white/60">
        {members.length} membro{members.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
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
        {/* Top row: name + target */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight truncate">{group.name}</h3>
          {group.targetAmount && (
            <MoneyDisplay
              amount={group.targetAmount}
              className="text-xs text-white/70 shrink-0"
            />
          )}
        </div>

        {/* Balance */}
        <div>
          <p className="text-xs text-white/70">Saldo atual</p>
          <MoneyDisplay amount={group.balance} className="font-bold text-lg" />
        </div>

        {/* Progress bar */}
        {pct !== null && (
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-white/60 text-right">{pct}% da meta</p>
          </div>
        )}

        {/* Members */}
        <MemberAvatars members={group.members} />
      </div>
    </Link>
  );
}
