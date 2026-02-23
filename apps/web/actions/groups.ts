"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createGroupSchema, joinGroupSchema } from "@/lib/validations";

const API_BASE =
  process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export type GroupActionState = {
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

export async function createGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  let token: string;
  try {
    token = await getAuthToken();
  } catch {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = createGroupSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const res = await fetch(`${API_BASE}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erro ao criar grupo" }));
    return {
      success: false,
      error: (body as { message?: string }).message ?? "Erro ao criar grupo",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function joinGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  let token: string;
  try {
    token = await getAuthToken();
  } catch {
    return { success: false, error: "Não autenticado" };
  }

  const parsed = joinGroupSchema.safeParse({
    inviteHash: formData.get("inviteHash"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Código inválido",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const res = await fetch(
    `${API_BASE}/groups/join/${parsed.data.inviteHash}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erro ao entrar no grupo" }));
    return {
      success: false,
      error: (body as { message?: string }).message ?? "Erro ao entrar no grupo",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
