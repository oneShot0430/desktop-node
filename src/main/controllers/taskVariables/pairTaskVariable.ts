import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';

import {
  ErrorType,
  PairedTaskVariables,
  PairTaskVariableParamType,
} from 'models';
import sdk from 'services/sdk';
import { throwDetailedError } from 'utils';

import { namespaceInstance } from '../../node/helpers/Namespace';
import { PersistentStoreKeys } from '../types';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getStoredTaskVariables } from './getStoredTaskVariables';
import { getTaskVariablesNames } from './getTaskVariablesNames';

export const pairTaskVariable = async (
  _: Event,
  payload: PairTaskVariableParamType
): Promise<void> => {
  // payload validation
  if (
    !payload?.taskAccountPubKey ||
    !payload?.variableInTaskName ||
    !payload?.desktopVariableId
  ) {
    throw throwDetailedError({
      detailed: 'Variable Pairing error: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  // task validation

  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(payload.taskAccountPubKey)
  );

  if (!accountInfo || !accountInfo.data)
    return throwDetailedError({
      detailed: 'Variable Pairing error: Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });

  let taskData;
  try {
    taskData = JSON.parse(accountInfo.data.toString());
  } catch {
    //
  }

  if (!taskData) {
    return throwDetailedError({
      detailed: 'Variable Pairing error: Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  // variableInTaskName validation

  const taskVariablesNames = await getTaskVariablesNames({} as Event, {
    taskPublicKey: payload.taskAccountPubKey,
  });

  const doesTaskUseProvidedVariableName = taskVariablesNames.includes(
    payload.variableInTaskName
  );

  if (!doesTaskUseProvidedVariableName) {
    return throwDetailedError({
      detailed: 'Variable Pairing error: Variable Name in the Task not found',
      type: ErrorType.GENERIC,
    });
  }

  // desktopVariableId validation

  const taskVariables = await getStoredTaskVariables();

  if (!taskVariables[payload.desktopVariableId]) {
    return throwDetailedError({
      detailed:
        'Variable Pairing error: Desktop Variable ID in the Task not found',
      type: ErrorType.GENERIC,
    });
  }

  // pairing

  const pairedTaskVariables = await getStoredPairedTaskVariables();

  const newPairedTaskVariables: PairedTaskVariables = {
    ...pairedTaskVariables,
    [payload.taskAccountPubKey]: {
      ...pairedTaskVariables[payload.taskAccountPubKey],
      [payload.variableInTaskName]: payload.desktopVariableId,
    },
  };

  const strigifiedPairsValue = JSON.stringify(newPairedTaskVariables);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.TaskToVariablesPairs,
    strigifiedPairsValue
  );
};
