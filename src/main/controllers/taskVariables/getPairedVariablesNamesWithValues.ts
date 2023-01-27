import { Event } from 'electron';

import {
  ErrorType,
  GetPairedVariablesNamesWithValuesParamType,
  GetPairedVariablesNamesWithValuesReturnType,
  OMITTED_VARIABLE_IDENTIFIER,
} from 'models';
import { throwDetailedError } from 'utils';

import { validateTask } from '../getTaskInfo';

import { getStoredPairedTaskVariables } from './getStoredPairedTaskVariables';
import { getStoredTaskVariables } from './getStoredTaskVariables';

export const getPairedVariablesNamesWithValues = async (
  _: Event,
  payload: GetPairedVariablesNamesWithValuesParamType
): Promise<GetPairedVariablesNamesWithValuesReturnType> => {
  // payload validation
  if (!payload?.taskAccountPubKey) {
    throw throwDetailedError({
      detailed:
        'Get Paired Variables Names with Values error: payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  // task validation
  await validateTask(null, payload, 'GetPairedVariablesNamesWithValues');

  const pairedTaskVariables = await getStoredPairedTaskVariables();

  const taskPairings = pairedTaskVariables[payload.taskAccountPubKey];

  console.log('@@@payload', payload.taskAccountPubKey);

  if (!taskPairings) {
    return throwDetailedError({
      detailed: `Get Paired Variables Names with Values error: No pairings found for Task (${payload.taskAccountPubKey})`,
      type: ErrorType.GENERIC,
    });
  }

  const taskVariables = await getStoredTaskVariables();

  return Object.entries(taskPairings).reduce(
    (res, [taskVariableName, desktopVariableId]) => {
      if (desktopVariableId == OMITTED_VARIABLE_IDENTIFIER) {
        return res;
      }

      if (!taskVariables[desktopVariableId]) {
        return throwDetailedError({
          detailed:
            'Get Paired Variables Names with Values error: No paired Task variable stored',
          type: ErrorType.GENERIC,
        });
      }
      return {
        ...res,
        [taskVariableName]: taskVariables[desktopVariableId].value,
      };
    },
    {}
  );
};
