"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MemberStatus } from "@/lib/utils";

const STATUS_CONFIG: Record<
  MemberStatus,
  { label: string; className: string }
> = {
  "em-chamas": {
    label: "Em Chamas 🔥",
    className: "bg-orange-100 text-orange-700",
  },
  pendente: {
    label: "Pendente ⏳",
    className: "bg-yellow-100 text-yellow-700",
  },
  atrasado: {
    label: "Atrasado 🔴",
    className: "bg-red-100 text-red-600",
  },
  novato: {
    label: "Novato ⭐",
    className: "bg-lavender/20 text-lavender",
  },
};

interface Props {
  name: string;
  status: MemberStatus;
  score: number;
  isCurrentUser: boolean;
}

export function MemberCard({ name, status, score, isCurrentUser }: Props) {
  const [nudged, setNudged] = useState(false);
  const config = STATUS_CONFIG[status];

  function handleNudge() {
    if (nudged) return;
    setNudged(true);
    setTimeout(() => setNudged(false), 2500);
  }

  return (
    <div className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full gradient-coral flex items-center justify-center text-white font-bold text-base shrink-0">
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-semibold text-sm truncate">{name}</p>
          {isCurrentUser && (
            <span className="text-[10px] text-muted-foreground">(você)</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.className}`}
          >
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {score} aporte{score !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Nudge button */}
      {!isCurrentUser && (
        <motion.button
          onClick={handleNudge}
          whileTap={{ scale: 0.88 }}
          animate={nudged ? { y: [0, -6, 0, -3, 0] } : { y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
            nudged
              ? "bg-teal/10 text-teal"
              : "bg-lavender/10 text-lavender hover:bg-lavender/20 active:bg-lavender/30"
          }`}
          aria-label={`Nudge ${name}`}
        >
          {nudged ? "Enviado ✓" : "Nudge"}
        </motion.button>
      )}
    </div>
  );
}
