import type { Article, ArticleCategory } from "@/lib/learn-data";

const CATEGORY_STYLES: Record<ArticleCategory, string> = {
  Todos: "bg-muted text-muted-foreground",
  Poupança: "bg-coral/10 text-coral",
  Investimentos: "bg-teal/10 text-teal",
  Mentalidade: "bg-lavender/10 text-lavender",
  Dívidas: "bg-red-100 text-red-500",
};

interface Props {
  article: Article;
}

export function ArticleCard({ article }: Props) {
  const categoryStyle =
    CATEGORY_STYLES[article.category] ?? CATEGORY_STYLES["Todos"];

  return (
    <div className="bg-card rounded-2xl p-4 card-shadow flex flex-col gap-2 cursor-pointer transition-opacity hover:opacity-90 active:opacity-80">
      <span className="text-3xl" aria-hidden>
        {article.emoji}
      </span>

      <span
        className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryStyle}`}
      >
        {article.category}
      </span>

      <p className="text-sm font-semibold leading-snug">{article.title}</p>

      <p className="text-xs text-muted-foreground leading-snug line-clamp-2 flex-1">
        {article.description}
      </p>

      <p className="text-[10px] text-muted-foreground mt-auto">
        {article.readMinutes} min de leitura
      </p>
    </div>
  );
}
