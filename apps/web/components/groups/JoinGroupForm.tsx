"use client";

import { useActionState } from "react";
import { joinGroup, type GroupActionState } from "@/actions/groups";
import { SubmitButton } from "@/components/shared/SubmitButton";

const initialState: GroupActionState = { success: false };

export function JoinGroupForm() {
  const [state, formAction, isPending] = useActionState(
    joinGroup,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="inviteHash" className="text-sm font-medium">
          Código de convite
        </label>
        <input
          id="inviteHash"
          name="inviteHash"
          type="text"
          placeholder="Cole o código aqui"
          disabled={isPending}
          className="flex h-11 w-full rounded-xl border border-input bg-brand-bg px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:border-coral disabled:opacity-50"
          required
        />
        {state.fieldErrors?.["inviteHash"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["inviteHash"][0]}
          </p>
        )}
      </div>

      {state.error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton
        pendingText="Entrando..."
        className="w-full h-11 rounded-xl bg-coral text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Entrar no Grupo
      </SubmitButton>
    </form>
  );
}
