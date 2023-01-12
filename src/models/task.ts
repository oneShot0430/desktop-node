export interface Task {
  publicKey: string;
  data: TaskData;
}

type ROE = number;
type EndTimestamp = number;

export interface TaskMetadata {
  createdAt: number;
  description: string;
  nodeSpec: {
    storage: string;
    cpu: string;
    memory: string;
    os: string;
    network: string;
    other: string;
  };
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
  metadata?: Partial<TaskMetadata>;
}
