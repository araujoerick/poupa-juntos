import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export const joinGroupSchema = z.object({
  inviteHash: z.string().min(1, "Código de convite é obrigatório"),
});

export const createGoalSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  targetAmount: z.coerce
    .number()
    .positive("Valor deve ser positivo")
    .max(999999999999.99),
  deadline: z.string().min(1, "Prazo é obrigatório"),
});

export const submitContributionSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Valor do aporte deve ser positivo")
    .max(999999999999.99),
  groupId: z.string().uuid("ID do grupo inválido"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type SubmitContributionInput = z.infer<typeof submitContributionSchema>;
