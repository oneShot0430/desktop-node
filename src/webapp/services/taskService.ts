import { isNil, max, min, sum, isString } from 'lodash';

import { Task as TaskRaw } from 'main/type/TaskData';
import arweave from 'services/arweave';
import { Task, TaskStatus } from 'webapp/types';

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

  static getTaskSourceCode(task: Task): Promise<string> {
    return arweave.transactions
      .getData(task.taskAuditProgram, { decode: true })
      .then((dataBuffer) => {
        return isString(dataBuffer)
          ? dataBuffer
          : new TextDecoder().decode(dataBuffer);
      });
  }

  static getTopStake(task: Task): number {
    return max(Object.values(task.stakeList));
  }

  static formatStake = (stake: number) =>
    (Math.round(stake * 100) / 100).toFixed(2);

  static getMinStake(task: Task): number {
    return min(Object.values(task.stakeList));
  }

  static getNodesCount(task: Task): number {
    return Object.values(task.stakeList).length;
  }

  static getStatus(task: Task): TaskStatus {
    if (!isNil(task.status['AcceptingSubmissions']))
      return TaskStatus.ACCEPTING_SUBMISSIONS;
    if (!isNil(task.status['Voting'])) return TaskStatus.VOTING;
    if (!isNil(task.status['Completed'])) return TaskStatus.COMPLETED;
  }

  static parseTask({ data, publicKey }: TaskRaw): Task {
    return { publicKey, ...data };
  }
}

export const TaskStatusToLabeMap: Record<TaskStatus, string> = {
  [TaskStatus.VOTING]: 'Voting',
  [TaskStatus.ACCEPTING_SUBMISSIONS]: 'Accepting Submissions',
  [TaskStatus.COMPLETED]: 'Completed',
};
