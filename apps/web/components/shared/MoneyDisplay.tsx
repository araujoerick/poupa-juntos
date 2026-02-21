interface MoneyDisplayProps {
  amount: number;
  className?: string;
}

export function MoneyDisplay({ amount, className }: MoneyDisplayProps) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}
