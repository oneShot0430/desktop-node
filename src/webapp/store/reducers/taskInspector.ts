import {
  HIDE_TASK_INSPECTOR,
  SHOW_TASK_INSPECTOR,
} from 'webapp/store/actions/types';
import {
  ITaskInspectorState,
  TaskInspectorAction,
} from 'webapp/store/types/taskInspector';

const initialState: ITaskInspectorState = {
  isShown: false,
  task: null,
};

export default function taskInspectorReducer(
  state = initialState,
  action: TaskInspectorAction
): ITaskInspectorState {
  const { type, payload } = action;

  switch (type) {
    case SHOW_TASK_INSPECTOR:
      return {
        isShown: true,
        task: payload,
      };
    case HIDE_TASK_INSPECTOR:
      return initialState;
    default:
      return state;
  }
}
