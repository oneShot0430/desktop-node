import { ChildProcess } from 'child_process';

import { Namespace } from '../../main/node/helpers/Namespace';

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
  stakeList: Record<string, number>;
  isRunning: boolean;
}

export interface Task {
  publicKey: string;
  data: TaskData;
}
export interface IRunningTasks {
  [key: string]: {
    namespace: Namespace;
    child: ChildProcess;
    expressAppPort: number;
    secret: string;
  };
}
