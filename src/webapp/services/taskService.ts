import { isNil, max, min, sum } from 'lodash';

import { Task, TaskStatus } from '../@type/task';

export class TaskService {
  static getTotalStaked(task: Task): number {
    return sum(Object.values(task.stakeList));
  }

  static getMyStake(task: Task): number {
    return task.stakeList[task.publicKey] || 0;
  }

  static getTopStake(task: Task): number {
    return max(Object.values(task.stakeList));
  }

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
}

export const TaskStatusToLabeMap: Record<TaskStatus, string> = {
  [TaskStatus.VOTING]: 'Voting',
  [TaskStatus.ACCEPTING_SUBMISSIONS]: 'Accepting Submissions',
  [TaskStatus.COMPLETED]: 'Completed',
};
