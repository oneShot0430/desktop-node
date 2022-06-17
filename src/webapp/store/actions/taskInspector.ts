import { Task } from 'webapp/@type/task';
import {
  TaskInspectorAction,
  TaskInspectorType,
} from 'webapp/store/types/taskInspector';

import { HIDE_TASK_INSPECTOR, SHOW_TASK_INSPECTOR } from './types';

export const showTaskInspector = (
  type: TaskInspectorType,
  task: Task
): TaskInspectorAction => ({
  type: SHOW_TASK_INSPECTOR,
  payload: task,
});

export const closeTaskInspector = (): TaskInspectorAction => ({
  type: HIDE_TASK_INSPECTOR,
});