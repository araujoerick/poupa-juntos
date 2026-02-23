"use client";

import { useTransition } from "react";
import type { ContributionDTO } from "@poupa-juntos/shared-types";
import { ContributionStatus } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { StatusBadge } from "./StatusBadge";
import { cancelContribution } from "@/actions/contributions";

interface ContributionItemProps {
  contribution: ContributionDTO;
  isOwner: boolean;
  onOptimisticRemove: (id: string) => void;
}

export function ContributionItem({
  contribution,
  isOwner,
  onOptimisticRemove,
}: ContributionItemProps) {
  const [isPending, startTransition] = useTransition();
  const date = new Date(contribution.createdAt).toLocaleDateString("pt-BR");
  const canCancel = isOwner && contribution.status === ContributionStatus.PENDING;

  function handleCancel() {
    onOptimisticRemove(contribution.id);
    startTransition(async () => {
      await cancelContribution(contribution.id, contribution.groupId);
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
      <div className="space-y-0.5">
        <MoneyDisplay amount={contribution.amount} className="font-semibold" />
        <p className="text-muted-foreground text-xs">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={contribution.status} />
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-xs text-destructive hover:underline disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
