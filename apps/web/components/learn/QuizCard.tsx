"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/lib/learn-data";

interface Props {
  question: QuizQuestion;
}

type QuizState = "idle" | "answering" | "result";

export function QuizCard({ question }: Props) {
  const [state, setState] = useState<QuizState>("idle");
  const [selected, setSelected] = useState<number | null>(null);

  function handleAnswer(index: number) {
    setSelected(index);
    setState("result");
  }

  function handleReset() {
    setSelected(null);
    setState("idle");
  }

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="gradient-teal rounded-2xl p-5 card-shadow text-white space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                🎯
              </span>
              <div>
                <p className="font-bold text-base leading-none">Quiz Diário</p>
                <p className="text-white/70 text-xs mt-0.5">
                  Teste seu conhecimento e ganhe XP
                </p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-snug line-clamp-2">
              {question.question}
            </p>
            <button
              type="button"
              onClick={() => setState("answering")}
              className="w-full bg-white text-teal font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90 active:scale-95"
            >
              Começar
            </button>
          </motion.div>
        )}

        {state === "answering" && (
          <motion.div
            key="answering"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl p-5 card-shadow space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                🎯
              </span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Quiz Diário
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug">
              {question.question}
            </p>
            <div className="space-y-2">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left rounded-xl border border-border p-3 text-sm transition-colors hover:border-coral hover:bg-coral/5 active:scale-[0.99]"
                >
                  <span className="font-semibold text-muted-foreground mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state === "result" && selected !== null && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl p-5 card-shadow space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                {selected === question.correctIndex ? "🏆" : "💡"}
              </span>
              <span className="text-sm font-bold">
                {selected === question.correctIndex ? "Correto!" : "Quase lá!"}
              </span>
            </div>

            <p className="text-sm font-semibold leading-snug">
              {question.question}
            </p>

            <div className="space-y-2">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correctIndex;
                const isSelected = i === selected;
                const isWrong = isSelected && !isCorrect;

                return (
                  <div
                    key={i}
                    className={`w-full text-left rounded-xl border p-3 text-sm transition-colors ${
                      isCorrect
                        ? "border-teal bg-teal/10 text-teal font-semibold"
                        : isWrong
                          ? "border-red-400 bg-red-50 text-red-500"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {option}
                    {isCorrect && <span className="ml-1">✓</span>}
                    {isWrong && <span className="ml-1">✗</span>}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed bg-muted rounded-xl p-3">
              💬 {question.explanation}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-coral text-white font-semibold rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90 active:scale-95"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
