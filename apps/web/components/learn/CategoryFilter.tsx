"use client";

import { useState } from "react";
import type { Article, ArticleCategory } from "@/lib/learn-data";
import { ArticleCard } from "./ArticleCard";

interface Props {
  categories: ArticleCategory[];
  articles: Article[];
}

export function CategoryFilter({ categories, articles }: Props) {
  const [active, setActive] = useState<ArticleCategory>("Todos");

  const filtered =
    active === "Todos"
      ? articles
      : articles.filter((a) => a.category === active);

  return (
    <div className="space-y-4">
      {/* Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              active === cat
                ? "bg-coral text-white"
                : "bg-card text-muted-foreground card-shadow"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          Nenhum artigo nesta categoria ainda.
        </p>
      )}
    </div>
  );
}
