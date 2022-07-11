import { Task as TS, TaskData } from 'preload/type/tasks';

export type Task = Omit<TS, 'data'> & TaskData;

export enum TaskStatus {
  ACCEPTING_SUBMISSIONS = 'ACCEPTING_SUBMISSIONS',
  VOTING = 'VOTING',
  COMPLETED = 'COMPLETED',
}
