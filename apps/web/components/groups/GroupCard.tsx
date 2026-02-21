import Link from "next/link";
import type { GroupDTO } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

interface GroupCardProps {
  group: GroupDTO;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/dashboard/groups/${group.id}`} className="block">
      <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{group.name}</h3>
          <span className="text-xs text-muted-foreground">
            {group.members.length} membro
            {group.members.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Saldo confirmado</p>
            <MoneyDisplay amount={group.balance} className="font-medium" />
          </div>
          {group.pendingBalance > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Pendente</p>
              <MoneyDisplay
                amount={group.pendingBalance}
                className="font-medium text-yellow-700"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
