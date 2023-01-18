import { namespaceInstance } from '../../../main/node/helpers/Namespace';
import { TaskVariablesReturnType } from '../../../models/api/taskVariables/getStoredTaskVariables';

import { PersistentStoreKeys } from '../types';

export const getStoredTaskVariables =
  async (): Promise<TaskVariablesReturnType> => {
    const taskVariables = await namespaceInstance.storeGet(
      PersistentStoreKeys.TaskVariables
    );

    try {
      const parsedData = JSON.parse(taskVariables) as TaskVariablesReturnType;

      return parsedData || {};
    } catch (error) {
      return {};
    }
  };
