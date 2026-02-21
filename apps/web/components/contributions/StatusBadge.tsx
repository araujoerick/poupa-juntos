import { ContributionStatus } from "@poupa-juntos/shared-types";

const statusMap: Record<
  ContributionStatus,
  { label: string; className: string }
> = {
  [ContributionStatus.PENDING]: {
    label: "Pendente",
    className:
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-yellow-300 bg-yellow-50 text-yellow-800",
  },
  [ContributionStatus.VALIDATED]: {
    label: "Validado",
    className:
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-green-300 bg-green-50 text-green-800",
  },
  [ContributionStatus.REJECTED]: {
    label: "Rejeitado",
    className:
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-red-300 bg-red-50 text-red-800",
  },
};

interface StatusBadgeProps {
  status: ContributionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusMap[status];
  return <span className={className}>{label}</span>;
}
