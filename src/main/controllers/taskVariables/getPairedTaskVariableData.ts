import { Event } from 'electron';

import {
  GetPairedTaskVariableDataParamType,
  GetPairedTaskVariableDataReturnType,
} from 'models';

import { validateTask } from '../getTaskInfo';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getStoredTaskVariables } from './getStoredTaskVariables';

export const getPairedTaskVariableData = async ({
  shouldValidateTask = true,
  taskAccountPubKey,
}: GetPairedTaskVariableDataParamType): Promise<GetPairedTaskVariableDataReturnType> => {
  // payload validation

  // task validation
  if (shouldValidateTask && taskAccountPubKey) {
    await validateTask(
      {} as Event,
      { taskAccountPubKey },
      'GetTaskPairedVariablesNamesWithValues'
    );
  }

  const pairedTaskVariables = await getStoredPairedTaskVariables();
  const taskPairings = pairedTaskVariables[taskAccountPubKey];
  const taskVariables = await getStoredTaskVariables();

  return { taskPairings, taskVariables };
};
