export interface Task {
  publicKey: string;
  data: TaskData;
}

type ROE = number;
type EndTimestamp = number;

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
}
