export interface TaskData {
  taskName: string;
  taskManager: string;
  isWhitelisted: boolean;
  isActive: boolean;
  taskAuditProgram: string;
  stakePotAccount: string;
  totalBountyAmount: number;
  bountyAmountPerRound: number;
  status: any;
  currentRound: number;
  availableBalances: any;
  stakeList: unknown;
  isRunning: boolean;
  cronArray: any;
}

export interface Task {
  publicKey: string;
  data: TaskData;
}
