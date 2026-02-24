import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ContributionForm } from "@/components/contributions/ContributionForm";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function ContributePage({ params }: Props) {
  const { groupId } = await params;

  return (
    // Negative margins compensate for the dashboard layout's padding
    <div className="-mx-4 -mt-6 min-h-[calc(100dvh-5rem)] bg-dark-bg">
      <div className="mx-auto max-w-md px-4 pt-6 pb-8 space-y-6">
        {/* Back link */}
        <Link
          href={`/dashboard/groups/${groupId}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao grupo
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-dark-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-dark-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">Validando com IA!</h1>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Envie o comprovante e nossa IA extrai e valida o valor
            automaticamente.
          </p>
        </div>

        {/* Form */}
        <ContributionForm groupId={groupId} />
      </div>
    </div>
  );
}
