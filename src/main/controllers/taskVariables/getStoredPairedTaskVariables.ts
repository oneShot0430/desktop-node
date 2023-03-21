import { namespaceInstance } from 'main/node/helpers/Namespace';
import {
  PairedTaskVariables,
  GetStoredPairedTaskVariablesReturnType,
} from 'models';

import { PersistentStoreKeys } from '../types';

export const getStoredPairedTaskVariables =
  async (): Promise<GetStoredPairedTaskVariablesReturnType> => {
    const pairedTaskVariablesStringified: string =
      await namespaceInstance.storeGet(
        PersistentStoreKeys.TaskToVariablesPairs
      );

    try {
      const pairedTaskVariables: PairedTaskVariables = {
        ...(JSON.parse(pairedTaskVariablesStringified) as PairedTaskVariables),
      };

      return pairedTaskVariables;
    } catch (error) {
      console.log('Get Stored Paired Task Variables: JSON parse error', error);
      return {};
    }
  };
