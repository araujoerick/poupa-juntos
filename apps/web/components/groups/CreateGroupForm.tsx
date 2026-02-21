"use client";

import { useActionState } from "react";
import { createGroup, type GroupActionState } from "@/actions/groups";
import { SubmitButton } from "@/components/shared/SubmitButton";

const initialState: GroupActionState = { success: false };

export function CreateGroupForm() {
  const [state, formAction, isPending] = useActionState(
    createGroup,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do Grupo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Viagem para Europa 2026"
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          required
        />
        {state.fieldErrors?.["name"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["name"][0]}
          </p>
        )}
      </div>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Criando...">Criar Grupo</SubmitButton>
    </form>
  );
}
