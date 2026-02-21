"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createGoalSchema } from "@/lib/validations";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export type GoalActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function getAuthToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) throw new Error("Não autenticado");
  return token;
}

export async function createGoal(
  groupId: string,
  _prevState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  let token: string;
  try {
    token = await getAuthToken();
  } catch {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = createGoalSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    deadline: formData.get("deadline"),
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

  const res = await fetch(`${API_BASE}/groups/${groupId}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const body = await res
      .json()
      .catch(() => ({ message: "Erro ao criar meta" }));
    return {
      success: false,
      error: (body as { message?: string }).message ?? "Erro ao criar meta",
    };
  }

  revalidatePath(`/dashboard/groups/${groupId}`);
  redirect(`/dashboard/groups/${groupId}`);
}

export async function deleteGoal(
  groupId: string,
  goalId: string,
): Promise<void> {
  let token: string;
  try {
    token = await getAuthToken();
  } catch {
    return;
  }

  await fetch(`${API_BASE}/groups/${groupId}/goals/${goalId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath(`/dashboard/groups/${groupId}`);
}
