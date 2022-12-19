import { namespaceInstance } from 'main/node/helpers/Namespace';
import { TaskVariablesReturnType } from 'models/api/taskVariables/getTaskVariables';

import { PersistentStoreKeys } from '../types';

export const getTaskVariables = async (): Promise<TaskVariablesReturnType> => {
  const taskVariables = await namespaceInstance.storeGet(
    PersistentStoreKeys.TaskVariables
  );

  const parsedData = JSON.parse(taskVariables);

  return parsedData as TaskVariablesReturnType;
};
