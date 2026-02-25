export type ArticleCategory =
  | "Todos"
  | "Poupança"
  | "Investimentos"
  | "Mentalidade"
  | "Dívidas";

export interface Article {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  emoji: string;
  readMinutes: number;
  featured?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "Todos",
  "Poupança",
  "Investimentos",
  "Mentalidade",
  "Dívidas",
];

export const ARTICLES: Article[] = [
  {
    id: "regra-50-30-20",
    title: "A Regra 50/30/20",
    description:
      "Domine seu orçamento dividindo sua renda entre necessidades, desejos e poupança.",
    category: "Poupança",
    emoji: "📊",
    readMinutes: 4,
    featured: true,
  },
  {
    id: "habitos-dia-a-dia",
    title: "Economizando no Dia a Dia",
    description:
      "Pequenos hábitos que geram grandes economias ao longo do ano.",
    category: "Poupança",
    emoji: "☕",
    readMinutes: 3,
  },
  {
    id: "investimentos-101",
    title: "Investimentos para Iniciantes",
    description: "Comece sua jornada de riqueza com R$50 por mês.",
    category: "Investimentos",
    emoji: "📈",
    readMinutes: 6,
  },
  {
    id: "mentalidade-financeira",
    title: "Mentalidade Financeira",
    description:
      "Mude a sua relação com o dinheiro e construa riqueza de verdade.",
    category: "Mentalidade",
    emoji: "🧠",
    readMinutes: 5,
  },
  {
    id: "vida-sem-dividas",
    title: "Vida Sem Dívidas",
    description:
      "Estratégias práticas para quitar dívidas e nunca mais entrar nelas.",
    category: "Dívidas",
    emoji: "✂️",
    readMinutes: 7,
  },
  {
    id: "tesouro-direto",
    title: "Tesouro Direto na Prática",
    description:
      "Como investir com segurança usando títulos do governo federal.",
    category: "Investimentos",
    emoji: "🏛️",
    readMinutes: 5,
  },
  {
    id: "fundo-emergencia",
    title: "Monte Sua Reserva de Emergência",
    description:
      "Por que ter 6 meses de gastos guardados é a base de toda estratégia financeira.",
    category: "Poupança",
    emoji: "🛡️",
    readMinutes: 4,
  },
  // {
  //   id: "negociar-dividas",
  //   title: "Como Negociar Suas Dívidas",
  //   description:
  //     "Técnicas para renegociar com credores e sair do vermelho mais rápido.",
  //   category: "Dívidas",
  //   emoji: "🤝",
  //   readMinutes: 5,
  // },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Na regra 50/30/20, qual percentual é destinado à poupança?",
    options: ["50%", "30%", "20%", "10%"],
    correctIndex: 2,
    explanation:
      "20% da renda deve ir para poupança e investimentos. 50% para necessidades e 30% para desejos pessoais.",
  },
  {
    id: "q2",
    question: "O que é o Tesouro Selic?",
    options: [
      "Uma ação da Bolsa de Valores",
      "Um título público que acompanha a taxa Selic",
      "Um fundo de investimento imobiliário",
      "Uma criptomoeda regulamentada",
    ],
    correctIndex: 1,
    explanation:
      "O Tesouro Selic é um título público federal que rende conforme a taxa básica de juros (Selic), sendo considerado o investimento mais seguro do Brasil.",
  },
  {
    id: "q3",
    question: "Qual é a principal vantagem de poupar em grupo?",
    options: [
      "Rendimento maior que investindo sozinho",
      "O compromisso social aumenta a consistência",
      "Isenção de imposto de renda",
      "Liquidez imediata a qualquer momento",
    ],
    correctIndex: 1,
    explanation:
      "O compromisso com outras pessoas cria responsabilidade social. Pesquisas mostram que metas compartilhadas têm até 65% mais chance de serem atingidas.",
  },
  {
    id: "q4",
    question: "O que significa 'juros compostos'?",
    options: [
      "Juros cobrados duas vezes por mês",
      "Juros que incidem sobre o valor inicial apenas",
      "Juros que incidem sobre o capital mais os juros acumulados",
      "Juros fixados pelo governo federal",
    ],
    correctIndex: 2,
    explanation:
      "Juros compostos incidem sobre o montante total (principal + juros anteriores), gerando crescimento exponencial — o que Einstein teria chamado de 'a oitava maravilha do mundo'.",
  },
  {
    id: "q5",
    question: "Qual o primeiro passo recomendado antes de investir?",
    options: [
      "Comprar ações de empresas sólidas",
      "Quitar todas as dívidas de uma vez",
      "Montar uma reserva de emergência",
      "Contratar um consultor financeiro",
    ],
    correctIndex: 2,
    explanation:
      "A reserva de emergência (equivalente a 3–6 meses de gastos) protege você de imprevistos sem precisar resgatar investimentos no pior momento.",
  },
];
