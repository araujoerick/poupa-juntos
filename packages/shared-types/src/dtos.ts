import type { ContributionStatus } from "./enums";

export interface UserDTO {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface GroupDTO {
  id: string;
  name: string;
  inviteHash: string;
  balance: number;
  pendingBalance: number;
  targetAmount: number | null;
  deadline: string | null;
  members: UserDTO[];
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
  targetAmount?: number;
  deadline?: string;
}

export interface UpdateGroupDTO {
  name?: string;
  targetAmount?: number | null;
  deadline?: string | null;
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
