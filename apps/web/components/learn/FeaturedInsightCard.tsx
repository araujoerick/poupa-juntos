import { ChevronRight } from "lucide-react";
import type { Article } from "@/lib/learn-data";

interface Props {
  article: Article;
}

export function FeaturedInsightCard({ article }: Props) {
  return (
    <div className="gradient-coral rounded-2xl p-5 card-shadow text-white space-y-3">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ✨ Em destaque
        </span>
        <span className="text-white/60 text-xs">
          {article.readMinutes} min de leitura
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-white/70 text-xs uppercase tracking-wide font-medium">
          {article.category}
        </p>
        <h2 className="text-xl font-bold leading-snug">{article.title}</h2>
        <p className="text-white/80 text-sm leading-relaxed">
          {article.description}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="flex items-center gap-1.5 bg-white text-coral font-semibold rounded-xl py-2.5 px-4 text-sm transition-opacity hover:opacity-90 active:scale-95"
      >
        Ler artigo
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
