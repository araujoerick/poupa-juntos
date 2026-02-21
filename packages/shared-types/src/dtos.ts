import type { ContributionStatus, GoalStatus } from "./enums.js";

export interface UserDTO {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface GoalDTO {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string;
  status: GoalStatus;
  groupId: string;
  createdAt: string;
}

export interface GroupDTO {
  id: string;
  name: string;
  inviteHash: string;
  balance: number;
  pendingBalance: number;
  members: UserDTO[];
  goals?: GoalDTO[];
  createdAt: string;
}

export interface ContributionDTO {
  id: string;
  amount: number;
  receiptUrl: string;
  status: ContributionStatus;
  userId: string;
  groupId: string;
  createdAt: string;
}

export interface CreateGroupDTO {
  name: string;
}

export interface CreateGoalDTO {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface CreateContributionDTO {
  amount: number;
  groupId: string;
}

export interface GeminiReceiptResult {
  amount: number;
  date: string;
  type: string;
  recipient: string;
  isValid: boolean;
}
