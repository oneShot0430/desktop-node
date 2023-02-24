import { isNil, max, min, sum } from 'lodash';
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
    return window.main.getTaskSource({ taskAccountPubKey: task.publicKey });
  }

  static getTopStake(task: Task): number {
    return max(Object.values(task.stakeList)) || 0;
  }

  static getMinStake(task: Task): number {
    return min(Object.values(task.stakeList)) || 0;
  }

  static getNodesCount(task: Task): number {
    return Object.values(task.stakeList).length;
  }

  static getStatus(task: Task): TaskStatus {
    if (!isNil(task.status.AcceptingSubmissions))
      return TaskStatus.ACCEPTING_SUBMISSIONS;
    if (!isNil(task.status.Voting)) return TaskStatus.VOTING;
    if (!isNil(task.status.Completed)) return TaskStatus.COMPLETED;
    return TaskStatus.COMPLETED;
  }
}

export const TaskStatusToLabeMap: Record<TaskStatus, string> = {
  [TaskStatus.VOTING]: 'Voting',
  [TaskStatus.ACCEPTING_SUBMISSIONS]: 'Accepting Submissions',
  [TaskStatus.COMPLETED]: 'Completed',
};
