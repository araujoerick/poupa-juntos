import Link from "next/link";
import { CreateGoalForm } from "@/components/goals/CreateGoalForm";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function NewGoalPage({ params }: Props) {
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
        <h1 className="mt-2 text-2xl font-bold">Nova Meta</h1>
        <p className="text-sm text-muted-foreground">
          Defina um objetivo financeiro para o grupo.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <CreateGoalForm groupId={groupId} />
      </div>
    </div>
  );
}
