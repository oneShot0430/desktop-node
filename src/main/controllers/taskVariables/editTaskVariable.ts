import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, TaskVariableData, TaskVariables } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';

export const editTaskVariable = async (
  _event: Event,
  payload: TaskVariableData
): Promise<void> => {
  const taskVariables = await getStoredTaskVariables();
  // throw error if payload is not valid
  if (!payload || !payload.label || !payload.value) {
    throw throwDetailedError({
      detailed: 'taskVariables payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const existingVariableId = Object.entries(taskVariables).find(
    ([, taskVariable]) => taskVariable.label === payload.label
  )?.[0];

  if (!existingVariableId) {
    throw throwDetailedError({
      detailed: `task variable with label "${payload.label}" was not found`,
      type: ErrorType.GENERIC,
    });
  }

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
    [existingVariableId]: payload,
  };

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
