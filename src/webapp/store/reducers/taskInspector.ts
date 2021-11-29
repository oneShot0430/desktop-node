import { HIDE_TASK_INSPECTOR, SHOW_TASK_INSPECTOR } from '../actions/types';
import {
  ITaskInspectorState,
  TaskInspectorAction,
} from '../types/taskInspector';

const initialState: ITaskInspectorState = {
  isShown: false,
  taskInspectorData: {
    type: null,
    taskInfo: null,
  },
};

export default function taskInspectorReducer(
  state = initialState,
  action: TaskInspectorAction
): ITaskInspectorState {
  const { type, taskInspectorPayload } = action;

  switch (type) {
    case SHOW_TASK_INSPECTOR:
      return {
        ...state,
        isShown: true,
        taskInspectorData: taskInspectorPayload,
      };
    case HIDE_TASK_INSPECTOR:
      return initialState;
    default:
      return state;
  }
}
