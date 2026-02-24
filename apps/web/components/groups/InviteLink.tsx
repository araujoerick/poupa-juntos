"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface InviteLinkProps {
  inviteHash: string;
}

export function InviteLink({ inviteHash }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/groups/join/${inviteHash}`
        : inviteHash;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 card-shadow">
      <code className="flex-1 truncate text-xs text-muted-foreground font-mono">
        {inviteHash}
      </code>
      <button
        onClick={handleCopy}
        aria-label="Copiar link de convite"
        className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
          copied
            ? "bg-teal/10 text-teal"
            : "bg-coral/10 text-coral hover:bg-coral/20"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copiar
          </>
        )}
      </button>
    </div>
  );
}
