import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";

export default async function JoinByLinkPage({
  params,
}: {
  params: Promise<{ inviteHash: string }>;
}) {
  const { inviteHash } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    redirect("/sign-in");
  }

  const res = await fetch(`${API_BASE}/groups/join/${inviteHash}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.ok) {
    redirect("/dashboard");
  }

  const body = await res.json().catch(() => ({ message: "Erro ao entrar no grupo." }));
  const errorMessage = (body as { message?: string }).message ?? "Erro ao entrar no grupo.";

  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <p className="text-destructive">{errorMessage}</p>
      <a href="/dashboard" className="text-sm text-primary hover:underline">
        Voltar ao dashboard
      </a>
    </div>
  );
}
