"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { submitContributionSchema } from "@/lib/validations";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export type ContributionActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContribution(
  _prevState: ContributionActionState,
  formData: FormData,
): Promise<ContributionActionState> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return { success: false, error: "Não autenticado" };

  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Comprovante é obrigatório" };
  }

  const parsed = submitContributionSchema.safeParse({
    amount: formData.get("amount"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const body = new FormData();
  body.append("receipt", file);
  body.append("amount", String(parsed.data.amount));
  body.append("groupId", parsed.data.groupId);

  const res = await fetch(`${API_BASE}/contributions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Erro ao enviar comprovante" }));
    return {
      success: false,
      error:
        (err as { message?: string }).message ?? "Erro ao enviar comprovante",
    };
  }

  revalidatePath(`/dashboard/groups/${parsed.data.groupId}`);
  return { success: true };
}
