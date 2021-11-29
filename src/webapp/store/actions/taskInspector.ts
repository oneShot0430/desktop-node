import {
  TaskInfo,
  TaskInspectorAction,
  TaskInspectorType,
} from '../types/taskInspector';

import { HIDE_TASK_INSPECTOR, SHOW_TASK_INSPECTOR } from './types';

export const showTaskInspector = (
  type: TaskInspectorType,
  taskInfo: TaskInfo
): TaskInspectorAction => ({
  type: SHOW_TASK_INSPECTOR,
  taskInspectorPayload: {
    type,
    taskInfo,
  },
});

export const closeTaskInspector = (): TaskInspectorAction => ({
  type: HIDE_TASK_INSPECTOR,
});
