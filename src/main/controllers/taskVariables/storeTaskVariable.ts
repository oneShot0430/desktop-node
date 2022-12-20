import { randomUUID } from 'crypto';
import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, TaskVariableData, TaskVariables } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getTaskVariables } from './getTaskVariables';

export const storeTaskVariable = async (
  _event: Event,
  payload: TaskVariableData
): Promise<void> => {
  const taskVariables = await getTaskVariables();
  // throw error if payload is not valid
  if (!payload || !payload.label || !payload.value) {
    throw throwDetailedError({
      detailed: 'taskVariables payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const labelExists = Object.values(taskVariables).some(
    (taskVariable) => taskVariable.label === payload.label
  );

  if (labelExists) {
    throw throwDetailedError({
      detailed: 'taskVariables label already exists',
      type: ErrorType.GENERIC,
    });
  }
  const id = randomUUID();

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
    [id]: payload,
  };

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
