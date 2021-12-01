import { Action } from 'redux';

import { Task } from 'webapp/@type/task';

export type TaskInspectorType = 'TASK_INSPECTOR';

export interface ITaskInspectorState {
  isShown: boolean;
  task: Task;
}

export interface TaskInspectorAction extends Action<string> {
  payload?: Task;
}
