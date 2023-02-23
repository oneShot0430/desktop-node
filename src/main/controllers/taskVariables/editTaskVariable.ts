import { Event } from 'electron';

import {
  EditTaskVariableParamType,
  ErrorType,
  TaskVariables,
} from '../../../models';
import { throwDetailedError } from '../../../utils';
import { namespaceInstance } from '../../node/helpers/Namespace';
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
    (!payload?.variableData?.value && !payload?.variableData?.label)
  ) {
    throw throwDetailedError({
      detailed: 'Edit Task Variable payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  let isExistingVariableId = false;
  let isLabelDuplicated = false;
  Object.entries(taskVariables).forEach(([id, { label }]) => {
    if (id === payload.variableId) {
      isExistingVariableId = true;
    }
    if (label === payload.variableData.label) {
      isLabelDuplicated = true;
    }
  });

  if (!isExistingVariableId) {
    throw throwDetailedError({
      detailed: `task variable with ID "${payload.variableId}" was not found`,
      type: ErrorType.GENERIC,
    });
  }

  if (isLabelDuplicated) {
    throw throwDetailedError({
      detailed: `task variable with label "${payload.variableId}" already exist`,
      type: ErrorType.GENERIC,
    });
  }

  const newTaskVariables: TaskVariables = {
    ...taskVariables,
    [payload.variableId]: {
      ...taskVariables[payload.variableId],
      ...payload.variableData,
    },
  };

  const strigifiedTaskVariableValue = JSON.stringify(newTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskVariables,
    strigifiedTaskVariableValue
  );
};
