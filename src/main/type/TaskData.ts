export interface TaskData {
  taskName: string;
  taskManager: string;
  isWhitelisted: boolean;
  isActive: boolean;
  taskAuditProgram: string;
  stakePotAccount: string;
  totalBountyAmount: number;
  bountyAmountPerRound: number;
  status: unknown;
  currentRound: number;
  availableBalances: number;
  stakeList: unknown;
  isRunning:boolean;
}

export interface Task {
  publicKey: string;
  data: TaskData;
}
