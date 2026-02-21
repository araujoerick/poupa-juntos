"use client";

import { useActionState } from "react";
import { createGoal, type GoalActionState } from "@/actions/goals";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface CreateGoalFormProps {
  groupId: string;
}

const initialState: GoalActionState = { success: false };

export function CreateGoalForm({ groupId }: CreateGoalFormProps) {
  // bind do groupId no server action
  const createGoalForGroup = createGoal.bind(null, groupId);
  const [state, formAction, isPending] = useActionState(
    createGoalForGroup,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nome da Meta
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Passagens aéreas"
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

      <div className="space-y-1.5">
        <label htmlFor="targetAmount" className="text-sm font-medium">
          Valor Alvo (R$)
        </label>
        <input
          id="targetAmount"
          name="targetAmount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="5000,00"
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          required
        />
        {state.fieldErrors?.["targetAmount"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["targetAmount"][0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="deadline" className="text-sm font-medium">
          Prazo
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          required
        />
        {state.fieldErrors?.["deadline"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["deadline"][0]}
          </p>
        )}
      </div>

      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Criando...">Criar Meta</SubmitButton>
    </form>
  );
}
