import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { EditTaskVariableParamType, ErrorType, TaskVariables } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';

export const editTaskVariable = async (
  _event: Event,
  payload: EditTaskVariableParamType
): Promise<void> => {
  const taskVariables = await getStoredTaskVariables();
  // throw error if payload is not valid
  if (
    !payload?.variableId ||
    !payload?.variableData?.value ||
    !payload?.variableData?.label
  ) {
    throw throwDetailedError({
      detailed: 'Edit Task Variable payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const idExistingVariableId = Object.keys(taskVariables).includes(
    payload.variableId
  );

  if (!idExistingVariableId) {
    throw throwDetailedError({
      detailed: `task variable with ID "${payload.variableId}" was not found`,
      type: ErrorType.GENERIC,
    });
  }

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
    [payload.variableId]: payload.variableData,
  };

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
