import type { GoalDTO } from "@poupa-juntos/shared-types";
import { GoalStatus } from "@poupa-juntos/shared-types";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";

interface GoalCardProps {
  goal: GoalDTO;
  confirmedBalance: number;
}

const statusLabel: Record<GoalStatus, string> = {
  [GoalStatus.ACTIVE]: "Ativa",
  [GoalStatus.COMPLETED]: "Concluída",
  [GoalStatus.CANCELLED]: "Cancelada",
};

export function GoalCard({ goal, confirmedBalance }: GoalCardProps) {
  const progress = Math.min((confirmedBalance / goal.targetAmount) * 100, 100);
  const deadline = new Date(goal.deadline).toLocaleDateString("pt-BR");

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-xs text-muted-foreground">Prazo: {deadline}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {statusLabel[goal.status]}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <MoneyDisplay amount={confirmedBalance} className="font-medium" />
          <MoneyDisplay
            amount={goal.targetAmount}
            className="text-muted-foreground"
          />
        </div>
        {/* Barra de progresso manual para evitar dependência de Shadcn aqui */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
