import { TaskData } from '../task';

export interface GetTaskInfoParam {
  taskAccountPubKey: string;
}

export type GetTaskInfoResponse = Omit<TaskData, 'isRunning'>;
