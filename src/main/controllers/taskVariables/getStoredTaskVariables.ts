import { TaskVariablesReturnType } from '../../../models/api/taskVariables/getStoredTaskVariables';
import { namespaceInstance } from '../../node/helpers/Namespace';
import { PersistentStoreKeys } from '../types';

export const getStoredTaskVariables =
  async (): Promise<TaskVariablesReturnType> => {
    const taskVariables = await namespaceInstance.storeGet(
      PersistentStoreKeys.TaskVariables
    );

    try {
      const parsedData = JSON.parse(
        taskVariables as string
      ) as TaskVariablesReturnType;

      return parsedData || {};
    } catch (error) {
      return {};
    }
  };
