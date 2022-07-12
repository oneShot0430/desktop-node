import { Task } from '../task';

export interface GetTaskInfoParam {
  taskAccountPubKey: string;
}

export type GetTaskInfoResponse = Task;
