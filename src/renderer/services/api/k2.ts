import {
  GetAvailableTasksParam,
  GetMyTasksParam,
  PaginatedResponse,
  TaskData,
} from 'models';
import { Task } from 'renderer/types';

import { parseTask } from './utils';

/** K2 Queries */
export const getTasksById = async (tasksIds: string[]) => {
  const tasks = await window.main.getTasksById({ tasksIds });
  return tasks.filter(Boolean).map(parseTask);
};

export const fetchAvailableTasks = async (
  params: GetAvailableTasksParam
): Promise<PaginatedResponse<Task>> => {
  const response = await window.main.getAvailableTasks(params);
  return {
    ...response,
    content: response.content.map(parseTask),
  };
};

export const getAccountBalance = async (pubKey: string) => {
  const balance = await window.main.getAccountBalance(pubKey);
  return balance;
};

export const getAverageSlotTime = async (): Promise<number> => {
  const averageSlotTime = await window.main.getAverageSlotTime();
  return averageSlotTime;
};

export const getAllAccounts = async () => {
  const accounts = await window.main.getAllAccounts();
  return accounts;
};

export const getLastSubmissionTime = async (
  task: TaskData,
  stakingPublicKey: string,
  averageSlotTime: number
): Promise<number> => {
  return window.main.getLastSubmissionTime({
    task,
    stakingPublicKey,
    averageSlotTime,
  });
};

export const getLatestAverageTaskReward = async (
  task: TaskData
): Promise<number> => {
  return window.main.getLatestAverageTaskReward({ task });
};

export const getCurrentSlot = async () => {
  return window.main.getCurrentSlot();
};

export const initializeTasks = async () => {
  return window.main.initializeTasks();
};

export const getTimeToNextReward = async (averageSlotTime: number) => {
  return window.main.getTimeToNextReward(averageSlotTime);
};

export const getTaskInfo = async (taskPublicKey: string) => {
  return window.main.getTaskInfo({ taskAccountPubKey: taskPublicKey });
};

/** indirect K2 queries or using K2 data */
export const fetchMyTasks = async (
  params: GetMyTasksParam
): Promise<PaginatedResponse<Task>> => {
  const response = await window.main.getMyTasks(params);
  return {
    ...response,
    content: response.content.map(parseTask),
  };
};

export const getTaskNodeInfo = async () => {
  const res = await window.main.getTaskNodeInfo();
  return res;
};
