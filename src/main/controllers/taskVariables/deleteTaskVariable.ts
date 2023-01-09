import { Event } from 'electron';

import { isString } from 'lodash';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { DeleteTaskVariableParamType, ErrorType, TaskVariables } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';

export const deleteTaskVariable = async (
  _event: Event,
  idForDeletion: DeleteTaskVariableParamType
): Promise<void> => {
  const taskVariables = await getStoredTaskVariables();
  // throw error if payload is not valid
  if (!idForDeletion || !isString(idForDeletion)) {
    throw throwDetailedError({
      detailed: 'deleteTaskVariable payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const isExistingVariableId =
    Object.keys(taskVariables).includes(idForDeletion);

  if (!isExistingVariableId) {
    throw throwDetailedError({
      detailed: `task variable with ID "${idForDeletion}" was not found`,
      type: ErrorType.GENERIC,
    });
  }

  console.log(`Deleting Task Variable with ID "${idForDeletion}"`);

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
  };
  delete newTaskVariables[idForDeletion];

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
