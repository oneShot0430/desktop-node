import { max, sum } from 'lodash';
import { Task, TaskStatus } from 'renderer/types';

import { getStakingAccountPublicKey } from './api';

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
    return max(Object.values(task.stakeList)) || 0;
  }

  static getNodesCount(task: Task): number {
    return Object.values(task.stakeList).length;
  }

  static getStatus(task: Task, mainAccountStakingKey: string): TaskStatus {
    const allSubmissions = Object.values(task.submissions);
    const submissionsFromCurrentAccount = allSubmissions.filter((submission) =>
      Object.keys(submission).some((key) => key === mainAccountStakingKey)
    );
    const last3Submissions = allSubmissions.slice(-3);
    const hasSubmissionsOnlyInLast1Or2Rounds =
      last3Submissions[last3Submissions.length - 1] &&
      mainAccountStakingKey in last3Submissions[last3Submissions.length - 1] &&
      (last3Submissions.length < 3 ||
        (last3Submissions[last3Submissions.length - 3] &&
          !(
            mainAccountStakingKey in
            last3Submissions[last3Submissions.length - 3]
          )));
    const hasSubmissionsInAllLast3Rounds = last3Submissions.every(
      (round) => mainAccountStakingKey in round
    );
    const hasSubmissionsInSomeOfLast3Rounds = last3Submissions.some(
      (round) => mainAccountStakingKey in round
    );
    const nodeHasBeenFlaggedAsMalicious =
      mainAccountStakingKey in task.distributionsAuditTrigger ||
      mainAccountStakingKey in task.submissionsAuditTrigger;
    const taskIsComplete = task.totalBountyAmount < task.bountyAmountPerRound;
    const { hasError } = task;

    if (hasError) return TaskStatus.ERROR;
    if (nodeHasBeenFlaggedAsMalicious) return TaskStatus.FLAGGED;
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
}
