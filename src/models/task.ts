export interface Task {
  publicKey: string;
  data: TaskData;
}

export interface TaskData {
  taskName: string;
  taskManager: string;
  isWhitelisted: boolean;
  isActive: boolean;
  taskAuditProgram: string;
  stakePotAccount: string;
  totalBountyAmount: number;
  bountyAmountPerRound: number;
  status: Partial<
    Record<'AcceptingSubmissions' | 'Voting' | 'Completed', number>
  >;
  currentRound: number;
  availableBalances: Record<string, number>;
  stakeList: Record<string, number>;
  isRunning: boolean;
}
