import { PublicKey } from '@_koi/web3.js';
import { TaskData } from 'models';

interface AuditTriggerState {
  trigger_by: PublicKey;
  slot: number;
  votes: Array<{ is_valid: boolean; voter: PublicKey; slot: number }>;
}

export interface RawTaskData {
  task_name: string;
  task_manager: PublicKey;
  is_whitelisted: boolean;
  is_active: boolean;
  task_audit_program: string;
  stake_pot_account: PublicKey;
  total_bounty_amount: number;
  bounty_amount_per_round: number;
  current_round: number;
  available_balances: TaskData['availableBalances'];
  stake_list: TaskData['stakeList'];
  task_metadata: string;

  task_description: string;
  submissions: Record<
    string,
    Record<string, { submission_value: string; slot: number; round: number }>
  >;
  submissions_audit_trigger: Record<string, Record<string, AuditTriggerState>>;
  total_stake_amount: number;
  minimum_stake_amount: number;
  ip_address_list: Record<string, string>;
  round_time: number;
  starting_slot: number;
  audit_window: number;
  submission_window: number;
  task_executable_network: 'IPFS' | 'ARWEAVE';
  distribution_rewards_submission: Record<
    string,
    Record<string, { submission_value: PublicKey; slot: number; round: number }>
  >;
  distributions_audit_trigger: Record<
    string,
    Record<string, AuditTriggerState>
  >;
  distributions_audit_record: Record<
    string,
    'Uninitialized' | 'PayoutSuccessful' | 'PayoutFailed'
  >;
  task_vars: string;
  koii_vars: string;
  is_migrated: boolean;
  migrated_to: string;
  allowed_failed_distributions: number;
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
    currentRound: rawTaskData.current_round,
    availableBalances: rawTaskData.available_balances,
    stakeList: rawTaskData.stake_list,
    isRunning: false,
    metadataCID: rawTaskData.task_metadata,
    minimumStakeAmount: rawTaskData.minimum_stake_amount,
  };
}
