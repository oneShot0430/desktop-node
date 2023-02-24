import { isString } from 'lodash';
import {
  ErrorType,
  GetTasksPairedWithVariableParamType,
  GetTasksPairedWithVariableReturnType,
} from 'models';
import { throwDetailedError } from 'utils';

import getTasksById from '../getTasksById';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';

export const getTasksPairedWithVariable = async (
  _: Event,
  payload: GetTasksPairedWithVariableParamType
): Promise<GetTasksPairedWithVariableReturnType> => {
  // payload validation
  if (!payload?.variableId || !isString(payload?.variableId)) {
    throw throwDetailedError({
      detailed: 'Get Task Using Variable: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const pairedTaskVariables = await getStoredPairedTaskVariables();

  const taskIdsUsingVariable = Object.keys(pairedTaskVariables).filter(
    (taskId) =>
      Object.values(pairedTaskVariables[taskId]).includes(payload.variableId)
  );

  return getTasksById({} as Event, { tasksIds: taskIdsUsingVariable });
};
