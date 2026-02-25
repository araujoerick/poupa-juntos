import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContributionStatus } from "@poupa-juntos/shared-types";
import type { ContributionDTO, UserDTO } from "@poupa-juntos/shared-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcDaysLeft(deadline: string): number {
  return Math.max(
    0,
    Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  );
}

/** Call once per request to get a stable timestamp to pass into pure helpers. */
export function getServerNow(): number {
  return Date.now();
}

const DAILY_TIPS = [
  "A taxa Selic subiu. Considere o Tesouro Direto para parte da poupança do grupo.",
  "Revise assinaturas mensais. Cancelar 2 serviços pode liberar R$80/mês para aportes.",
  "Compras parceladas acima de 3x custam mais com a inflação. Prefira poupar e pagar à vista.",
  "Guardar R$10 por dia equivale a R$3.650 no fim do ano. Pequenos hábitos importam!",
  "Fundos de renda fixa CDI costumam render mais que a poupança tradicional.",
  "Divida a meta do grupo pelo número de meses restantes para saber o aporte mensal ideal.",
  "Aportes automáticos logo após o salário evitam o impulso de gastar antes de poupar.",
] as const;

/** Returns a tip that rotates daily, deterministic from the given timestamp. */
export function getDailyTip(now: number): string {
  const dayIndex = Math.floor(now / (1000 * 60 * 60 * 24));
  return DAILY_TIPS[dayIndex % DAILY_TIPS.length] ?? DAILY_TIPS[0];
}

export type MemberStatus = "em-chamas" | "pendente" | "atrasado" | "novato";

export function getMemberStatus(
  member: UserDTO,
  contributions: ContributionDTO[],
  now: number,
): MemberStatus {
  const memberContribs = contributions.filter((c) => c.userId === member.id);

  if (memberContribs.length === 0) {
    const daysSinceJoin =
      (now - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceJoin < 7 ? "novato" : "atrasado";
  }

  const hasPending = memberContribs.some(
    (c) => c.status === ContributionStatus.PENDING,
  );
  if (hasPending) return "pendente";

  const hasRecentValidated = memberContribs.some(
    (c) =>
      c.status === ContributionStatus.VALIDATED &&
      now - new Date(c.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  );
  if (hasRecentValidated) return "em-chamas";

  const lastContrib = memberContribs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  if (lastContrib) {
    const daysSinceLast =
      (now - new Date(lastContrib.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 30) return "atrasado";
  }

  return "atrasado";
}

export function getMemberScore(
  memberId: string,
  contributions: ContributionDTO[],
): number {
  return contributions.filter(
    (c) => c.userId === memberId && c.status === ContributionStatus.VALIDATED,
  ).length;
}

export function calcTrustScore(contributions: ContributionDTO[]): number {
  if (contributions.length === 0) return 100;
  const validated = contributions.filter(
    (c) => c.status === ContributionStatus.VALIDATED,
  ).length;
  return Math.round((validated / contributions.length) * 100);
}
