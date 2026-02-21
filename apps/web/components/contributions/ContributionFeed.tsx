"use client";

import { useEffect, useOptimistic, useTransition } from "react";
import { io, type Socket } from "socket.io-client";
import type { ContributionDTO } from "@poupa-juntos/shared-types";
import { ContributionItem } from "./ContributionItem";

interface ContributionFeedProps {
  groupId: string;
  initialContributions: ContributionDTO[];
}

// Singleton de socket — evita múltiplas conexões entre re-renders
let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001");
  }
  return socket;
}

export function ContributionFeed({
  groupId,
  initialContributions,
}: ContributionFeedProps) {
  const [, startTransition] = useTransition();

  const [contributions, updateContribution] = useOptimistic(
    initialContributions,
    (current: ContributionDTO[], updated: ContributionDTO) =>
      current.map((c) => (c.id === updated.id ? updated : c)),
  );

  useEffect(() => {
    const s = getSocket();

    s.emit("join-group", groupId);

    s.on("contribution:updated", (payload: ContributionDTO) => {
      startTransition(() => {
        updateContribution(payload);
      });
    });

    return () => {
      s.off("contribution:updated");
    };
  }, [groupId, updateContribution]);

  if (contributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum aporte registrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {contributions.map((c) => (
        <ContributionItem key={c.id} contribution={c} />
      ))}
    </div>
  );
}
