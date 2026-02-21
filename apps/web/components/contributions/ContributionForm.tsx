"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  submitContribution,
  type ContributionActionState,
} from "@/actions/contributions";
import { DropzoneArea } from "./DropzoneArea";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface ContributionFormProps {
  groupId: string;
}

const initialState: ContributionActionState = { success: false };

export function ContributionForm({ groupId }: ContributionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitContribution,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [state.success]);

  function handleFileAccepted(file: File) {
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Comprovante</label>
        <DropzoneArea onFileAccepted={handleFileAccepted} />
        {/* input file oculto — preenchido pelo DropzoneArea via DataTransfer */}
        <input
          ref={fileInputRef}
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          className="hidden"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="amount" className="text-sm font-medium">
          Valor do Aporte (R$)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          required
        />
        {state.fieldErrors?.["amount"] && (
          <p className="text-xs text-destructive">
            {state.fieldErrors["amount"][0]}
          </p>
        )}
      </div>

      {state.success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          Comprovante enviado! Aguardando validação pela IA.
        </p>
      )}

      {state.error && !state.success && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Enviando...">Enviar Comprovante</SubmitButton>
    </form>
  );
}
