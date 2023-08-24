import { Event } from 'electron';

import { store } from 'main/node/helpers/k2NetworkUrl';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

import getAverageSlotTime from './getAverageSlotTime';

export const getTimeToNextReward = async (_: Event): Promise<number> => {
  try {
    const averageSlotTime = await getAverageSlotTime();

    const timeToNextReward = await calculateTimeToNextRewardConsideringUpdates(
      averageSlotTime
    );

    return timeToNextReward;
  } catch (error) {
    return throwDetailedError({
      detailed: error as string,
      type: ErrorType.FETCHING_NEXT_REWARD_FAILED,
    });
  }
};

async function calculateTimeToNextRewardConsideringUpdates(
  averageSlotTime: number
): Promise<number> {
  let timeToNextReward = await calculateRewardTime(averageSlotTime);

  if (timeToNextReward <= 0) {
    await koiiTasks.updateRewardsQueue();
    timeToNextReward = await calculateRewardTime(averageSlotTime);
  }

  return timeToNextReward;
}

async function calculateRewardTime(averageSlotTime: number): Promise<number> {
  const tasks = store.get('timeToNextRewardAsSlots') ?? 0;
  const currentSlot = await namespaceInstance.getCurrentSlot();

  return calculateTimeToNextReward(averageSlotTime, tasks, currentSlot);
}

function calculateTimeToNextReward(
  averageSlotTime: number,
  tasks: number,
  currentSlot: number
): number {
  return Math.ceil(averageSlotTime * (tasks - currentSlot));
}
