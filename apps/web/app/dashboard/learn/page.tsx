import { BookOpen } from "lucide-react";
import { ARTICLES, ARTICLE_CATEGORIES, QUIZ_QUESTIONS } from "@/lib/learn-data";
import { getServerNow } from "@/lib/utils";
import { FeaturedInsightCard } from "@/components/learn/FeaturedInsightCard";
import { CategoryFilter } from "@/components/learn/CategoryFilter";
import { QuizCard } from "@/components/learn/QuizCard";

export default function LearnPage() {
  const now = getServerNow();

  const featuredArticle = ARTICLES.find((a) => a.featured) ?? ARTICLES[0]!;
  const nonFeaturedArticles = ARTICLES.filter((a) => !a.featured);

  const quizIndex = Math.floor(now / (1000 * 60 * 60 * 24)) % QUIZ_QUESTIONS.length;
  const todayQuiz = QUIZ_QUESTIONS[quizIndex]!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Expanda seu conhecimento</p>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-coral" />
            Aprenda a Economizar
          </h1>
        </div>
        <span className="bg-lavender/15 text-lavender text-xs font-semibold px-3 py-1.5 rounded-full">
          Nível 5
        </span>
      </div>

      {/* Featured Insight */}
      <FeaturedInsightCard article={featuredArticle} />

      {/* Category Filter + Article Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Biblioteca de artigos
        </h2>
        <CategoryFilter
          categories={ARTICLE_CATEGORIES}
          articles={nonFeaturedArticles}
        />
      </div>

      {/* Daily Quiz */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Desafio do dia
        </h2>
        <QuizCard question={todayQuiz} />
      </div>
    </div>
  );
}
