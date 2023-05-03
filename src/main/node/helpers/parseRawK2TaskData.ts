import { PublicKey } from '@_koi/web3.js';
import { TaskData, RawTaskData } from 'models';

export function parseRawK2TaskData({
  rawTaskData,
  hasError = false,
}: {
  rawTaskData: RawTaskData;
  isRunning?: boolean;
  hasError?: boolean;
}): TaskData {
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
    isRunning: rawTaskData.is_running ?? false,
    hasError,
    metadataCID: rawTaskData.task_metadata,
    minimumStakeAmount: rawTaskData.minimum_stake_amount,
    roundTime: rawTaskData.round_time,
    submissions: rawTaskData.submissions,
    distributionsAuditTrigger: rawTaskData.distributions_audit_trigger,
    submissionsAuditTrigger: rawTaskData.submissions_audit_trigger,
  };
}
