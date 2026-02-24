interface Props {
  score: number;
}

export function TrustScoreBadge({ score }: Props) {
  const colorClass =
    score > 80
      ? "text-teal bg-teal/10 border-teal/30"
      : score > 60
        ? "text-yellow-600 bg-yellow-50 border-yellow-200"
        : "text-red-500 bg-red-50 border-red-200";

  const label = score > 80 ? "Excelente" : score > 60 ? "Regular" : "Atenção";

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colorClass}`}
    >
      <span className="text-base font-bold">{score}%</span>
      <span className="text-xs font-medium">Trust Score · {label}</span>
    </div>
  );
}
