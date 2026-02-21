import type { ContributionDTO } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { StatusBadge } from "./StatusBadge";

interface ContributionItemProps {
  contribution: ContributionDTO;
}

export function ContributionItem({ contribution }: ContributionItemProps) {
  const date = new Date(contribution.createdAt).toLocaleDateString("pt-BR");

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
      <div className="space-y-0.5">
        <MoneyDisplay amount={contribution.amount} className="font-semibold" />
        <p className="text-muted-foreground text-xs">{date}</p>
      </div>
      <StatusBadge status={contribution.status} />
    </div>
  );
}
