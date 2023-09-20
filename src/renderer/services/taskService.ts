import { max, sum } from 'lodash';
import { Task, TaskStatus } from 'renderer/types';

import { getStakingAccountPublicKey, getCurrentSlot } from './api';

export class TaskService {
  static getTotalStaked(task: Task): number {
    return sum(Object.values(task.stakeList));
  }

  static getMyStake(task: Task): Promise<number> {
    return getStakingAccountPublicKey().then(
      (pubKey) => task.stakeList[pubKey] || 0
    );
  }

  static getTaskSourceCode(
    taskAuditProgram: Task['taskAuditProgram']
  ): Promise<string> {
    return window.main.getTaskSource({ taskAuditProgram });
  }

  static getTopStake(task: Task): number {
    return max(Object.values(task?.stakeList || {})) || 0;
  }

  static getNodesCount(task: Task): number {
    return Object.values(task?.stakeList || {})?.length;
  }

  static getPendingRewardsByTask(
    task: Task,
    stakingAccountPublicKey: string
  ): number {
    return task.availableBalances[stakingAccountPublicKey];
  }

  static async getStatus(
    task: Task,
    stakingAccountPublicKey: string,
    isPrivate = false
  ): Promise<TaskStatus> {
    /**
     * @dev: allow to run the task if it's "private"
     */
    const isBlackListed = (!task.isWhitelisted || !task.isActive) && !isPrivate;
    const allSubmissions = Object.values(task.submissions);
    const submissionsFromCurrentAccount = allSubmissions.filter((submission) =>
      Object.keys(submission).some((key) => key === stakingAccountPublicKey)
    );
    const last3Submissions = allSubmissions.slice(-3);
    const lastRoundWithSubmissions = Object.values(
      allSubmissions?.slice(-1)?.flat()?.[0] || {}
    )[0]?.round;
    const currentSlot = await getCurrentSlot();
    const currentRound = Math.floor(
      (currentSlot - task.startingSlot) / task.roundTime
    );
    const numberOfLatestConsecutiveRoundsWithoutSubmissions =
      currentRound - lastRoundWithSubmissions;

    const hasSubmissionsOnlyInLast1Or2Rounds =
      numberOfLatestConsecutiveRoundsWithoutSubmissions < 2 &&
      last3Submissions[last3Submissions.length - 1] &&
      stakingAccountPublicKey in
        last3Submissions[last3Submissions.length - 1] &&
      (last3Submissions.length < 3 ||
        (last3Submissions[last3Submissions.length - 3] &&
          !(
            stakingAccountPublicKey in
            last3Submissions[last3Submissions.length - 3]
          )));
    const hasSubmissionsInAllLast3Rounds =
      numberOfLatestConsecutiveRoundsWithoutSubmissions < 2 &&
      last3Submissions.every((round) => stakingAccountPublicKey in round);
    const hasSubmissionsInSomeOfLast3Rounds =
      (numberOfLatestConsecutiveRoundsWithoutSubmissions < 2 &&
        last3Submissions.some((round) => stakingAccountPublicKey in round)) ||
      (numberOfLatestConsecutiveRoundsWithoutSubmissions === 2 &&
        last3Submissions
          .slice(-2)
          .some((round) => stakingAccountPublicKey in round)) ||
      (numberOfLatestConsecutiveRoundsWithoutSubmissions === 3 &&
        last3Submissions
          .slice(-1)
          .some((round) => stakingAccountPublicKey in round));
    const nodeHasBeenFlaggedAsMalicious =
      stakingAccountPublicKey in task.distributionsAuditTrigger ||
      stakingAccountPublicKey in task.submissionsAuditTrigger;
    const taskIsComplete = task.totalBountyAmount < task.bountyAmountPerRound;
    const { hasError } = task;

    if (isBlackListed) return TaskStatus.BLACKLISTED;
    if (nodeHasBeenFlaggedAsMalicious) return TaskStatus.FLAGGED;
    if (hasError) return TaskStatus.ERROR;
    if (taskIsComplete) return TaskStatus.COMPLETE;
    if (!task.isRunning && hasSubmissionsInSomeOfLast3Rounds)
      return TaskStatus.COOLING_DOWN;
    if (!task.isRunning) return TaskStatus.STOPPED;
    if (!submissionsFromCurrentAccount?.length)
      return TaskStatus.PRE_SUBMISSION;
    if (hasSubmissionsOnlyInLast1Or2Rounds) return TaskStatus.WARMING_UP;
    else if (hasSubmissionsInAllLast3Rounds) return TaskStatus.ACTIVE;

    return TaskStatus.PRE_SUBMISSION;
  }

  static async getUnstakingAvailability(
    task: Task,
    stakingAccountPublicKey: string
  ): Promise<boolean> {
    const allSubmissions = Object.values(task.submissions);
    const last3Submissions = allSubmissions.slice(-3);
    const lastRoundWithSubmissions = Object.values(
      allSubmissions?.slice(-1)?.flat()?.[0] || {}
    )[0]?.round;
    const currentSlot = await getCurrentSlot();
    const currentRound = Math.floor(
      (currentSlot - task.startingSlot) / task.roundTime
    );
    const numberOfLatestConsecutiveRoundsWithoutSubmissions =
      currentRound - lastRoundWithSubmissions;
    const hasSubmissionsInSomeOfLast3Rounds =
      (numberOfLatestConsecutiveRoundsWithoutSubmissions < 2 &&
        last3Submissions.some((round) => stakingAccountPublicKey in round)) ||
      (numberOfLatestConsecutiveRoundsWithoutSubmissions === 2 &&
        last3Submissions
          .slice(-2)
          .some((round) => stakingAccountPublicKey in round)) ||
      (numberOfLatestConsecutiveRoundsWithoutSubmissions === 3 &&
        last3Submissions
          .slice(-1)
          .some((round) => stakingAccountPublicKey in round));
    const taskStake = task.stakeList[stakingAccountPublicKey] || 0;
    const unstakeIsAvailable =
      !task.isRunning && !hasSubmissionsInSomeOfLast3Rounds && !!taskStake;

    return unstakeIsAvailable;
  }
}
