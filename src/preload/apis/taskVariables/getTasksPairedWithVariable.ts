import config from 'config';
import {
  GetTasksPairedWithVariableParamType,
  GetTasksPairedWithVariableReturnType,
} from 'models/api/taskVariables/getTasksUsingVariable';
import sendMessage from 'preload/sendMessage';

export const getTasksPairedWithVariable = (
  payload: GetTasksPairedWithVariableParamType
): Promise<GetTasksPairedWithVariableReturnType> =>
  sendMessage(config.endpoints.GET_TASKS_PAIRED_WITH_VARIABLE, payload);
