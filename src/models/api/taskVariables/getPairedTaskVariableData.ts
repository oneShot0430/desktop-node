import { TaskPairing, TaskVariables } from './types';

export { GetTaskPairedVariablesNamesWithValuesParamType as GetPairedTaskVariableDataParamType } from './getTaskPairedVariablesNamesWithValues';
export type GetPairedTaskVariableDataReturnType = {
  taskPairings: TaskPairing;
  taskVariables: TaskVariables;
};
