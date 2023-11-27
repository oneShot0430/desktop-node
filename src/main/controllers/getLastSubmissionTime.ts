/* eslint-disable no-prototype-builtins */
import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { TaskData } from 'models';

import getAvgSlotTime from './getAverageSlotTime';

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

type GetTaskLastSubmissionTimeParams = {
  task: TaskData;
  stakingPublicKey: string;
};

export const getLastSubmissionTime = async (
  _: Event,
  { task, stakingPublicKey }: GetTaskLastSubmissionTimeParams
) => {
  const currentSlot = await namespaceInstance.getCurrentSlot();
  const lastSubmission = findEntryByPublicKey(task, stakingPublicKey);
  const averageSlot = await getAvgSlotTime();

  if (lastSubmission) {
    const lastSubmissionSlot = lastSubmission.slot;
    const timeInMs = (currentSlot - lastSubmissionSlot) * averageSlot;
    return timeInMs;
  }

  return 0;
};
