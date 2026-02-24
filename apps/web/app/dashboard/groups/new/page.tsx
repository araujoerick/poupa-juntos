import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";

export default function NewGroupPage() {
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
          <h1 className="text-xl font-bold leading-tight">Criar Grupo</h1>
          <p className="text-xs text-muted-foreground">
            Economize junto com quem você confia
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-card rounded-2xl p-5 card-shadow">
        <CreateGroupForm />
      </div>
    </div>
  );
}
