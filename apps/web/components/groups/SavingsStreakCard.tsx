import type { ContributionDTO } from "@poupa-juntos/shared-types";
import { ContributionStatus } from "@poupa-juntos/shared-types";

interface Props {
  contributions: ContributionDTO[];
}

function calcStreak(contributions: ContributionDTO[]): number {
  const validatedDays = new Set(
    contributions
      .filter((c) => c.status === ContributionStatus.VALIDATED)
      .map((c) => new Date(c.createdAt).toISOString().slice(0, 10)),
  );

  if (validatedDays.size === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // If today has no contribution yet, we can still count from yesterday
  const checkFrom = new Date(today);
  if (!validatedDays.has(todayStr)) {
    checkFrom.setDate(checkFrom.getDate() - 1);
  }

  let streak = 0;
  const cursor = new Date(checkFrom);

  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (validatedDays.has(dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function SavingsStreakCard({ contributions }: Props) {
  const streak = calcStreak(contributions);

  return (
    <div className="bg-card rounded-2xl p-4 card-shadow flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xl" aria-hidden>
          🔥
        </span>
        <span className="text-3xl font-bold text-coral leading-none">
          {streak}
        </span>
      </div>
      <p className="text-sm font-semibold">
        {streak === 1 ? "dia" : "dias"} de streak
      </p>
      <p className="text-xs text-muted-foreground">
        {streak === 0 ? "Faça um aporte hoje!" : "Continue assim!"}
      </p>
    </div>
  );
}
