import { PublicKey } from '@_koi/web3.js';

interface AuditTriggerState {
  trigger_by: PublicKey;
  slot: number;
  votes: Array<{ is_valid: boolean; voter: PublicKey; slot: number }>;
}

export interface RawTaskData {
  task_id: string;
  is_running?: boolean;

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
  currentRound: number;
  availableBalances: Record<string, ROE>;
  stakeList: Record<string, ROE>;
  isRunning: boolean;
  hasError: boolean;
  metadataCID: string;
  minimumStakeAmount: ROE;
  roundTime: number;
  startingSlot: number;
  submissions: Record<
    string,
    Record<string, { submission_value: string; slot: number; round: number }>
  >;
  distributionsAuditTrigger: Record<string, Record<string, AuditTriggerState>>;
  submissionsAuditTrigger: Record<string, Record<string, AuditTriggerState>>;
}
