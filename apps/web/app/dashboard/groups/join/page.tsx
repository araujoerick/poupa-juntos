import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JoinGroupForm } from "@/components/groups/JoinGroupForm";

export const dynamic = "force-dynamic";

export default function JoinGroupPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/groups"
          aria-label="Voltar"
          className="w-9 h-9 rounded-full bg-card card-shadow flex items-center justify-center transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight">Entrar em um Grupo</h1>
          <p className="text-xs text-muted-foreground">
            Use o código compartilhado por um membro
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-card rounded-2xl p-5 card-shadow">
        <JoinGroupForm />
      </div>
    </div>
  );
}
