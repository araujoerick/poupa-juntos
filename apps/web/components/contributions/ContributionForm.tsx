"use client";

import { useActionState, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import {
  submitContribution,
  type ContributionActionState,
} from "@/actions/contributions";
import { DropzoneArea } from "./DropzoneArea";
import { SubmitButton } from "@/components/shared/SubmitButton";

// Deterministic confetti particles (no random — avoids hydration issues)
const CONFETTI_COLORS = [
  "#FF4DB8",
  "#00F5D4",
  "#A78BFA",
  "#FF7E7E",
  "#FBBF24",
  "#60A5FA",
];
const CONFETTI_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i * 3.7) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
  delay: (i % 8) * 0.07,
  size: i % 3 === 0 ? 9 : 6,
  rotation: i * 47,
}));

interface ContributionFormProps {
  groupId: string;
}

const initialState: ContributionActionState = { success: false };

export function ContributionForm({ groupId }: ContributionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState("");
  // `dismissed` = user clicked "Enviar outro" after a success
  const [dismissed, setDismissed] = useState(false);
  // Incrementing key remounts DropzoneArea to reset its internal state
  const [dropzoneKey, setDropzoneKey] = useState(0);

  const [state, formAction, isPending] = useActionState(
    submitContribution,
    initialState,
  );

  // Derived — no useEffect needed
  const showSuccess = state.success && !dismissed && !isPending;

  // Reset `dismissed` in the event handler when a new submission starts
  const wrappedAction = useCallback(
    (payload: FormData) => {
      setDismissed(false);
      formAction(payload);
    },
    [formAction],
  );

  function handleSendAnother() {
    setDismissed(true);
    setAmountValue("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDropzoneKey((k) => k + 1);
  }

  function handleFileAccepted(file: File) {
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
    setSelectedFile(file.name);
  }

  const amountPreview =
    amountValue && !isNaN(parseFloat(amountValue))
      ? parseFloat(amountValue).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—";

  const showStatusCard = selectedFile || isPending || showSuccess;

  return (
    <form action={wrappedAction} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />

      {/* Status / AI Card */}
      <AnimatePresence>
        {showStatusCard && (
          <motion.div
            key="status-card"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Gradient border wrapper */}
            <div className="rounded-2xl p-px bg-linear-to-br from-dark-primary via-lavender to-dark-accent">
              <div className="relative rounded-2xl bg-[#0d0d20] overflow-hidden">
                {/* Scanner line — sweeps top-to-bottom during pending */}
                {isPending && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #FF4DB8 40%, #A78BFA 60%, transparent 100%)",
                      boxShadow: "0 0 16px 4px rgba(255,77,184,0.5)",
                    }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}

                <div className="p-5 space-y-3">
                  {showSuccess ? (
                    /* Success state with confetti */
                    <div className="relative overflow-hidden min-h-18">
                      {/* Confetti particles */}
                      {CONFETTI_PARTICLES.map((p) => (
                        <motion.div
                          key={p.id}
                          className="absolute rounded-sm pointer-events-none"
                          style={{
                            backgroundColor: p.color,
                            width: p.size,
                            height: p.size,
                            left: `${p.x}%`,
                            top: 0,
                          }}
                          initial={{ y: -12, opacity: 1, rotate: p.rotation }}
                          animate={{
                            y: 120,
                            opacity: 0,
                            rotate: p.rotation + 360,
                          }}
                          transition={{
                            duration: 1.6,
                            delay: p.delay,
                            ease: "easeOut",
                          }}
                        />
                      ))}

                      <div className="flex items-center gap-3 py-1 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-dark-accent/15 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-dark-accent" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            Enviado com sucesso!
                          </p>
                          <p className="text-white/50 text-sm">
                            Aguardando validação pela IA
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Scanning / preview state */
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                            Valor Detectado
                          </p>
                          <p className="text-white text-3xl font-bold tracking-tight">
                            R$ {amountPreview}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                            Confiança
                          </p>
                          <p className="text-dark-accent text-xl font-bold">
                            98%
                          </p>
                        </div>
                      </div>

                      {/* Progress bar / scan indicator */}
                      <div className="relative h-1 rounded-full bg-white/5 overflow-hidden">
                        {isPending ? (
                          <motion.div
                            className="absolute inset-y-0 w-20"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, #FF4DB8, #A78BFA, transparent)",
                            }}
                            animate={{ x: ["-100%", "700%"] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <div
                            className="h-full w-full rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #FF4DB8 0%, #A78BFA 50%, #00F5D4 100%)",
                              opacity: 0.4,
                            }}
                          />
                        )}
                      </div>

                      {selectedFile && (
                        <p className="text-white/35 text-xs truncate">
                          {isPending
                            ? "🔍 Analisando comprovante..."
                            : `📎 ${selectedFile}`}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form fields — hidden on success */}
      {!showSuccess && (
        <>
          <div className="space-y-1">
            <p className="text-white/60 text-sm font-medium">Comprovante</p>
            <DropzoneArea
              key={dropzoneKey}
              onFileAccepted={handleFileAccepted}
              dark
            />
            <input
              ref={fileInputRef}
              type="file"
              name="receipt"
              accept="image/*,application/pdf"
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="amount"
              className="text-white/60 text-sm font-medium"
            >
              Valor do Aporte (R$)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              disabled={isPending}
              value={amountValue}
              onChange={(e) => setAmountValue(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-primary disabled:opacity-50"
            />
            {state.fieldErrors?.["amount"] && (
              <p className="text-xs text-dark-primary">
                {state.fieldErrors["amount"][0]}
              </p>
            )}
          </div>
        </>
      )}

      {/* Error message */}
      {state.error && !showSuccess && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      {/* Action buttons */}
      {showSuccess ? (
        <button
          type="button"
          onClick={handleSendAnother}
          className="w-full h-11 rounded-xl border border-white/10 text-sm font-medium text-white/60 hover:text-white/90 hover:border-white/20 transition-colors"
        >
          Enviar outro comprovante
        </button>
      ) : (
        <SubmitButton
          pendingText="Analisando com IA..."
          className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-white bg-[linear-gradient(135deg,#FF4DB8_0%,#A78BFA_100%)] shadow-[0_4px_20px_rgba(255,77,184,0.3)] hover:shadow-[0_4px_28px_rgba(255,77,184,0.45)] transition-shadow disabled:pointer-events-none disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          Validar com IA
        </SubmitButton>
      )}
    </form>
  );
}
