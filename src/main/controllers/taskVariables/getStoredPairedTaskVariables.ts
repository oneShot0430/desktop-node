import { namespaceInstance } from 'main/node/helpers/Namespace';
import {
  PairedTaskVariables,
  GetStoredPairedTaskVariablesReturnType,
} from 'models';

import { PersistentStoreKeys } from '../types';

export const getStoredPairedTaskVariables =
  async (): Promise<GetStoredPairedTaskVariablesReturnType> => {
    const taskVariables = await namespaceInstance.storeGet(
      PersistentStoreKeys.TaskToVariablesPairs
    );

    try {
      const parsedData = JSON.parse(taskVariables) as PairedTaskVariables;

      return parsedData || {};
    } catch (error) {
      return {};
    }
  };
