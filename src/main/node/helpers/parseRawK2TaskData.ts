import { PublicKey } from '@_koi/web3.js';
import { TaskData } from 'models';

export interface RawTaskData {
  task_name: string;
  task_manager: string;
  is_whitelisted: boolean;
  is_active: boolean;
  task_audit_program: string;
  stake_pot_account: string;
  total_bounty_amount: number;
  bounty_amount_per_round: number;
  status: TaskData['status'];
  current_round: number;
  available_balances: TaskData['availableBalances'];
  stake_list: TaskData['stakeList'];
  task_metadata: string;
}

export function parseRawK2TaskData(rawTaskData: RawTaskData): TaskData {
  return {
    taskName: rawTaskData.task_name,
    taskManager: new PublicKey(rawTaskData.task_manager).toBase58(),
    isWhitelisted: rawTaskData.is_whitelisted,
    isActive: rawTaskData.is_active,
    taskAuditProgram: rawTaskData.task_audit_program,
    stakePotAccount: new PublicKey(rawTaskData.stake_pot_account).toBase58(),
    totalBountyAmount: rawTaskData.total_bounty_amount,
    bountyAmountPerRound: rawTaskData.bounty_amount_per_round,
    status: rawTaskData.status,
    currentRound: rawTaskData.current_round,
    availableBalances: rawTaskData.available_balances,
    stakeList: rawTaskData.stake_list,
    isRunning: false,
    metadataCID: rawTaskData.task_metadata,
  };
}
