// getPairedVariablesNamesWithValues

import config from 'config';
import {
  GetPairedVariablesNamesWithValuesParamType,
  GetPairedVariablesNamesWithValuesReturnType,
} from 'models';
import sendMessage from 'preload/sendMessage';

export const getPairedVariablesNamesWithValues = (
  payload: GetPairedVariablesNamesWithValuesParamType
): Promise<GetPairedVariablesNamesWithValuesReturnType> =>
  sendMessage(config.endpoints.GET_TASK_STORED_PAIRED_TASK_VARIABLES, payload);
