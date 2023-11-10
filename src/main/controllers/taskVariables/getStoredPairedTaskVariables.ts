import { namespaceInstance } from 'main/node/helpers/Namespace';
import {
  PairedTaskVariables,
  GetStoredPairedTaskVariablesReturnType,
} from 'models';

import { PersistentStoreKeys } from '../types';

import { getStoredTaskVariables } from './getStoredTaskVariables';

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

      const activeStoredTaskVariables = await getStoredTaskVariables();
      const activePairingIds = Object.keys(activeStoredTaskVariables || {});
      const arrayOfPairingsWithActiveIds = Object.entries(
        pairedTaskVariables
      ).filter(([, pairing]) => {
        const desktopVariableId = Object.values(pairing)[0];
        return activePairingIds.includes(desktopVariableId);
      });
      const pairingsWithActiveIds = Object.fromEntries(
        arrayOfPairingsWithActiveIds
      );

      return pairingsWithActiveIds;
    } catch (error) {
      console.log('Get Stored Paired Task Variables: JSON parse error', error);
      return {};
    }
  };
