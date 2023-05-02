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

  let partialRawTaskData;

  try {
    partialRawTaskData = JSON.parse(accountInfo.data.toString()) as Omit<
      RawTaskData,
      'task_id'
    >;
  } catch (e: any) {
    return throwDetailedError({
      detailed: `Error during Task parsing${
        context ? ` in context of ${context}` : ''
      }: ${e}`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  if (!partialRawTaskData) {
    return throwDetailedError({
      detailed: `Task data not found${
        context ? ` in context of ${context}` : ''
      }`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  console.log('PARTIAL RAW DATA', partialRawTaskData);
  return parseRawK2TaskData({
    ...partialRawTaskData,
    task_id: taskAccountPubKey,
  });
};

export const validateTask = getTaskInfo;
