/* eslint-disable no-prototype-builtins */
import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { TaskData } from 'models';

const findEntryByPublicKey = (data: TaskData, publicKey: string) => {
  const keys = Object.keys(data.submissions).sort(
    (a: string, b: string) => Number(b) - Number(a)
  );

  for (const key of keys) {
    if (data.submissions[key] && data.submissions[key][publicKey]) {
      return data.submissions[key][publicKey];
    }
  }
  return null;
};

export type GetTaskLastSubmissionTimeParams = {
  task: TaskData;
  stakingPublicKey: string;
  averageSlotTime: number;
};

export const getLastSubmissionTime = async (
  _: Event,
  { task, stakingPublicKey, averageSlotTime }: GetTaskLastSubmissionTimeParams
) => {
  // FIXME: K2 call, should take it as a param and get it it from cache
  const currentSlot = await namespaceInstance.getCurrentSlot();
  const lastSubmission = findEntryByPublicKey(task, stakingPublicKey);

  if (lastSubmission) {
    const lastSubmissionSlot = lastSubmission.slot;
    const timeInMs = (currentSlot - lastSubmissionSlot) * averageSlotTime;
    return timeInMs;
  }

  return 0;
};
