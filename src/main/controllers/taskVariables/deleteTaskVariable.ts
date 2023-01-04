import { Event } from 'electron';

import { isString } from 'lodash';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, TaskVariableData, TaskVariables } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';

export const deleteTaskVariable = async (
  _event: Event,
  labelForDeletion: TaskVariableData['label']
): Promise<void> => {
  const taskVariables = await getStoredTaskVariables();
  // throw error if payload is not valid
  if (!labelForDeletion || !isString(labelForDeletion)) {
    throw throwDetailedError({
      detailed: 'deleteTaskVariable payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const existingVariableId = Object.entries(taskVariables).find(
    ([, taskVariable]) => taskVariable.label === labelForDeletion
  )?.[0];

  if (!existingVariableId) {
    throw throwDetailedError({
      detailed: `task variable with label "${labelForDeletion}" was not found`,
      type: ErrorType.GENERIC,
    });
  }

  console.log(
    `Deleting Task Variable with label "${labelForDeletion}" and ID "${existingVariableId}"`
  );

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
  };
  delete newTaskVariables[existingVariableId];

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
