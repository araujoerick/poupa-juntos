"use client";

import { useState } from "react";

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
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
      <code className="flex-1 truncate text-xs text-muted-foreground">
        {inviteHash}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 text-xs font-medium text-primary hover:underline"
      >
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
