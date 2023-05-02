import { Task, TaskStatus } from 'renderer/types';

import { TaskService } from './taskService';

describe('TaskService.getStatus', () => {
  const mainAccountStakingKey = 'stakingKey';
  const baseTask: Task = {
    publicKey: 'publicKey',
    taskName: 'taskName',
    taskManager: 'taskManager',
    isWhitelisted: true,
    isActive: true,
    taskAuditProgram: 'taskAuditProgram',
    stakePotAccount: 'stakePotAccount',
    totalBountyAmount: 1000000000,
    bountyAmountPerRound: 1000000,
    currentRound: 300,
    availableBalances: {},
    stakeList: {},
    isRunning: false,
    hasError: false,
    metadataCID: 'metadataCID',
    minimumStakeAmount: 2000000000,
    roundTime: 600,
    submissions: {},
    distributionsAuditTrigger: {},
    submissionsAuditTrigger: {},
  };

  it('should return TaskStatus.ERROR if task hasError is true', () => {
    const task: Task = {
      ...baseTask,
      hasError: true,
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.ERROR);
  });

  it('should return TaskStatus.FLAGGED if node has been flagged as malicious', () => {
    const task: Task = {
      ...baseTask,
      distributionsAuditTrigger: {
        [mainAccountStakingKey]: {},
      },
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.FLAGGED);
  });

  it('should return TaskStatus.COMPLETE if the task is complete', () => {
    const task: Task = {
      ...baseTask,
      totalBountyAmount: 10,
      bountyAmountPerRound: 20,
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.COMPLETE);
  });

  it('should return TaskStatus.COOLING_DOWN if the task is not running and has submissions in some of the last 3 rounds', () => {
    const task: Task = {
      ...baseTask,
      isRunning: false,
      submissions: {
        '1': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 1,
          },
        },
      },
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.COOLING_DOWN);
  });

  it('should return TaskStatus.STOPPED if the task is not running and has no submissions in any of the last 3 rounds', () => {
    const task: Task = {
      ...baseTask,
      isRunning: false,
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.STOPPED);
  });

  it('should return TaskStatus.PRE_SUBMISSION if there are no submissions from the current account', () => {
    const task: Task = {
      ...baseTask,
      isRunning: true,
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.PRE_SUBMISSION);
  });

  it('should return TaskStatus.WARMING_UP if the task is running and there are 1 or 2 submissions in the last rounds', () => {
    const task: Task = {
      ...baseTask,
      isRunning: true,
      submissions: {
        '1': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 1,
          },
        },
      },
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.WARMING_UP);
  });

  it('should return TaskStatus.ACTIVE if the task is running and there are submissions in all last 3 rounds', () => {
    const task: Task = {
      ...baseTask,
      isRunning: true,
      submissions: {
        '1': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 1,
          },
        },
        '2': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 2,
          },
        },
        '3': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 3,
          },
        },
      },
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.ACTIVE);
  });

  it('should return TaskStatus.COOLING_DOWN if the task is no running and there are submissions in some of the last 3 rounds', () => {
    const task: Task = {
      ...baseTask,
      submissions: {
        '1': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 1,
          },
        },
        '4': {
          [mainAccountStakingKey]: {
            submission_value: '',
            slot: 0,
            round: 4,
          },
        },
      },
    };

    const result = TaskService.getStatus(task, mainAccountStakingKey);
    expect(result).toBe(TaskStatus.COOLING_DOWN);
  });
});
