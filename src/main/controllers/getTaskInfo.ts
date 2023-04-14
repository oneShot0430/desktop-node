import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import sdk from 'main/services/sdk';
import {
  ErrorType,
  GetTaskInfoParam,
  GetTaskInfoResponse,
  RawTaskData,
} from 'models';
import { throwDetailedError } from 'utils';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

export const getTaskInfo = async (
  _: Event,
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

  let rawTaskData;

  try {
    rawTaskData = JSON.parse(accountInfo.data.toString()) as RawTaskData;
  } catch (e: any) {
    return throwDetailedError({
      detailed: `Error during Task parsing${
        context ? ` in context of ${context}` : ''
      }: ${e}`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  if (!rawTaskData) {
    return throwDetailedError({
      detailed: `Task data not found${
        context ? ` in context of ${context}` : ''
      }`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  console.log(rawTaskData);
  return parseRawK2TaskData(rawTaskData);
};

export const validateTask = getTaskInfo;
