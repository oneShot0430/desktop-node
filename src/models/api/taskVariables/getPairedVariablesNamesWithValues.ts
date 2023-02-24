import { TaskVariableName } from './types';

export type GetPairedVariablesNamesWithValuesParamType = {
  taskAccountPubKey: string;
};
export type GetPairedVariablesNamesWithValuesReturnType = Record<
  TaskVariableName,
  string
>;
