import { TaskVariableName } from './types';

export type GetTaskPairedVariablesNamesWithValuesParamType = {
  taskAccountPubKey: string;
};
export type GetTaskPairedVariablesNamesWithValuesReturnType = Record<
  TaskVariableName,
  string
>;
