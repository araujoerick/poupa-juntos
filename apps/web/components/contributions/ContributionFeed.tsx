"use client";

import { useEffect, useOptimistic, useTransition } from "react";
import { io, type Socket } from "socket.io-client";
import type { ContributionDTO } from "@poupa-juntos/shared-types";
import { ContributionItem } from "./ContributionItem";

interface ContributionFeedProps {
  groupId: string;
  initialContributions: ContributionDTO[];
  currentUserId: string;
}

type OptimisticAction =
  | { type: "update"; contribution: ContributionDTO }
  | { type: "remove"; id: string };

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
  currentUserId,
}: ContributionFeedProps) {
  const [, startTransition] = useTransition();

  const [contributions, dispatch] = useOptimistic(
    initialContributions,
    (current: ContributionDTO[], action: OptimisticAction) => {
      if (action.type === "update") {
        return current.map((c) =>
          c.id === action.contribution.id ? action.contribution : c,
        );
      }
      return current.filter((c) => c.id !== action.id);
    },
  );

  useEffect(() => {
    const s = getSocket();

    s.emit("join-group", groupId);

    s.on("contribution:updated", (payload: ContributionDTO) => {
      startTransition(() => {
        dispatch({ type: "update", contribution: payload });
      });
    });

    return () => {
      s.off("contribution:updated");
    };
  }, [groupId, dispatch]);

  function handleOptimisticRemove(id: string) {
    startTransition(() => {
      dispatch({ type: "remove", id });
    });
  }

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
        <ContributionItem
          key={c.id}
          contribution={c}
          isOwner={c.userId === currentUserId}
          onOptimisticRemove={handleOptimisticRemove}
        />
      ))}
    </div>
  );
}
