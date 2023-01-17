import { namespaceInstance } from 'main/node/helpers/Namespace';
import { TaskVariablesReturnType } from 'models/api/taskVariables/getStoredTaskVariables';

import { PersistentStoreKeys } from '../types';

export const getStoredTaskVariables =
  async (): Promise<TaskVariablesReturnType> => {
    const taskVariables = await namespaceInstance.storeGet(
      PersistentStoreKeys.TaskVariables
    );

    try {
      const parsedData: TaskVariablesReturnType = JSON.parse(taskVariables);

      return parsedData || {};
    } catch (error) {
      console.log('Get Stored Task Variables: JSON parse error', error);
      return {};
    }
  };
