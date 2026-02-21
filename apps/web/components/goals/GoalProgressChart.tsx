"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ContributionStatus } from "@poupa-juntos/shared-types";
import type { ContributionDTO } from "@poupa-juntos/shared-types";

interface GoalProgressChartProps {
  contributions: ContributionDTO[];
  targetAmount: number;
}

export function GoalProgressChart({
  contributions,
  targetAmount,
}: GoalProgressChartProps) {
  const data = contributions
    .filter((c) => c.status === ContributionStatus.VALIDATED)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .reduce<{ date: string; total: number }[]>((acc, c) => {
      const prev = acc[acc.length - 1]?.total ?? 0;
      acc.push({
        date: new Date(c.createdAt).toLocaleDateString("pt-BR"),
        total: +(prev + c.amount).toFixed(2),
      });
      return acc;
    }, []);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum aporte validado para exibir no gráfico.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
        />
        <YAxis
          tickFormatter={(v: number) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(v)
          }
          tick={{ fontSize: 11 }}
          width={80}
        />
        <Tooltip
          formatter={(v: number | undefined) => [
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(v ?? 0),
            "Acumulado",
          ]}
        />
        {/* Linha de meta */}
        <Area
          type="monotone"
          dataKey={() => targetAmount}
          stroke="hsl(var(--muted-foreground))"
          fill="transparent"
          strokeDasharray="4 4"
          strokeWidth={1}
          dot={false}
          name="Meta"
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary) / 0.1)"
          strokeWidth={2}
          name="Acumulado"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
