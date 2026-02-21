import Link from "next/link";
import { ContributionForm } from "@/components/contributions/ContributionForm";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function ContributePage({ params }: Props) {
  const { groupId } = await params;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link
          href={`/dashboard/groups/${groupId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar ao grupo
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Registrar Aporte</h1>
        <p className="text-sm text-muted-foreground">
          Envie o comprovante para validação automática via IA.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <ContributionForm groupId={groupId} />
      </div>
    </div>
  );
}
