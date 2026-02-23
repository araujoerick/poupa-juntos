import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import type {
  GroupDTO,
  GoalDTO,
  ContributionDTO,
} from "@poupa-juntos/shared-types";

const API_BASE =
  process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      (body as { message?: string }).message ?? res.statusText,
    );
  }

  return res.json() as Promise<T>;
}

export async function upsertMe(): Promise<void> {
  const user = await currentUser();
  if (!user) return;

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;

  await apiFetch("/users/me", {
    method: "POST",
    body: JSON.stringify({ email, name }),
  });
}

export async function getGroups(): Promise<GroupDTO[]> {
  return apiFetch<GroupDTO[]>("/groups");
}

export async function getGroup(id: string): Promise<GroupDTO> {
  return apiFetch<GroupDTO>(`/groups/${id}`);
}

export async function getGoals(groupId: string): Promise<GoalDTO[]> {
  return apiFetch<GoalDTO[]>(`/groups/${groupId}/goals`);
}

export async function getContributions(
  groupId: string,
): Promise<ContributionDTO[]> {
  return apiFetch<ContributionDTO[]>(`/contributions/group/${groupId}`);
}
