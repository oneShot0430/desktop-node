import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import { ErrorType, GetTaskInfoParam, GetTaskInfoResponse } from 'models';
import sdk from 'services/sdk';
import { throwDetailedError } from 'utils';

export const getTaskInfo = async (
  event: Event,
  payload: GetTaskInfoParam,
  context?: string
): Promise<GetTaskInfoResponse> => {
  // payload validation
  if (!payload?.taskAccountPubKey) {
    throw throwDetailedError({
      detailed: 'Get Task Info error: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const { taskAccountPubKey } = payload;

  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(taskAccountPubKey)
  );

  if (!accountInfo || !accountInfo.data)
    return throwDetailedError({
      detailed: `Task not found${context ? ` in context of ${context}` : ''}`,
      type: ErrorType.TASK_NOT_FOUND,
    });

  let taskData;
  try {
    taskData = JSON.parse(accountInfo.data.toString());
  } catch (e: any) {
    return throwDetailedError({
      detailed: `Error during Task parsing${
        context ? ` in context of ${context}` : ''
      }: ${e}`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  if (!taskData) {
    return throwDetailedError({
      detailed: `Task data not found${
        context ? ` in context of ${context}` : ''
      }`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  return {
    taskName: taskData.task_name,
    taskManager: new PublicKey(taskData.task_manager).toBase58(),
    isWhitelisted: taskData.is_whitelisted,
    isActive: taskData.is_active,
    taskAuditProgram: taskData.task_audit_program,
    stakePotAccount: new PublicKey(taskData.stake_pot_account).toBase58(),
    totalBountyAmount: taskData.total_bounty_amount,
    bountyAmountPerRound: taskData.bounty_amount_per_round,
    status: taskData.status,
    currentRound: taskData.current_round,
    availableBalances: taskData.available_balances,
    stakeList: taskData.stake_list,
  };
};

export const validateTask = getTaskInfo;
