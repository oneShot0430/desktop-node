import { Event } from 'electron';

import {
  ErrorType,
  GetTaskPairedVariablesNamesWithValuesParamType,
  GetPairedTaskVariableDataReturnType,
} from 'models';
import { throwDetailedError } from 'utils';

import { validateTask } from '../getTaskInfo';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getStoredTaskVariables } from './getStoredTaskVariables';

export const getPairedTaskVariableData = async (
  payload: GetTaskPairedVariablesNamesWithValuesParamType
): Promise<GetPairedTaskVariableDataReturnType> => {
  // payload validation
  if (!payload?.taskAccountPubKey) {
    throw throwDetailedError({
      detailed:
        'Get Paired Variables Names with Values error: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  // task validation
  await validateTask(
    {} as Event,
    payload,
    'GetTaskPairedVariablesNamesWithValues'
  );

  const pairedTaskVariables = await getStoredPairedTaskVariables();
  const taskPairings = pairedTaskVariables[payload.taskAccountPubKey];
  const taskVariables = await getStoredTaskVariables();

  return { taskPairings, taskVariables };
};
