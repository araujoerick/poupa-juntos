"use client";

import { useActionState } from "react";
import { createGroup, type GroupActionState } from "@/actions/groups";
import { SubmitButton } from "@/components/shared/SubmitButton";

const initialState: GroupActionState = { success: false };

const inputClass =
  "flex h-11 w-full rounded-xl border border-input bg-brand-bg px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:border-coral disabled:opacity-50";

export function CreateGroupForm() {
  const [state, formAction, isPending] = useActionState(
    createGroup,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do grupo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Viagem para o Japão 🇯🇵"
          disabled={isPending}
          className={inputClass}
          required
        />
        {state.fieldErrors?.["name"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["name"][0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="targetAmount" className="text-sm font-medium">
          Valor da meta{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          id="targetAmount"
          name="targetAmount"
          type="number"
          step="0.01"
          min="1"
          placeholder="Ex: 6.000,00"
          disabled={isPending}
          className={inputClass}
        />
        {state.fieldErrors?.["targetAmount"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["targetAmount"][0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="deadline" className="text-sm font-medium">
          Prazo{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          disabled={isPending}
          className={inputClass}
        />
        {state.fieldErrors?.["deadline"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["deadline"][0]}
          </p>
        )}
      </div>

      {state.error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton
        pendingText="Criando grupo..."
        className="w-full h-11 rounded-xl bg-coral text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Criar Grupo
      </SubmitButton>
    </form>
  );
}
