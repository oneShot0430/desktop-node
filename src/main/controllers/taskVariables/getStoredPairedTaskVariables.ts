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
      const parsedData: PairedTaskVariables = JSON.parse(
        taskVariables as string
      );

      return parsedData || {};
    } catch (error) {
      console.log('Get Stored Paired Task Variables: JSON parse error', error);
      return {};
    }
  };
