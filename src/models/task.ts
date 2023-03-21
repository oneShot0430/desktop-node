export interface Task {
  publicKey: string;
  data: TaskData;
}

type ROE = number;
type EndTimestamp = number;

export interface TaskMetadata {
  author: string;
  description: string;
  repositoryUrl: string;
  createdAt: number;
  imageUrl: string;
  requirementsTags: RequirementTag[];
}

export interface RequirementTag {
  type: RequirementType;
  value?: string;
  description?: string;
}

export enum RequirementType {
  GLOBAL_VARIABLE = 'GLOBAL_VARIABLE',
  TASK_VARIABLE = 'TASK_VARIABLE',
  CPU = 'CPU',
  RAM = 'RAM',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  ARCHITECTURE = 'ARCHITECTURE',
  OS = 'OS',
}

export interface TaskData {
  taskName: string;
  taskManager: string;
  isWhitelisted: boolean;
  isActive: boolean;
  taskAuditProgram: string;
  stakePotAccount: string;
  totalBountyAmount: ROE;
  bountyAmountPerRound: ROE;
  status: Partial<
    Record<'AcceptingSubmissions' | 'Voting' | 'Completed', EndTimestamp>
  >;
  currentRound: number;
  availableBalances: Record<string, ROE>;
  stakeList: Record<string, ROE>;
  isRunning: boolean;
  metadataCID: string;
}
