export type PairTaskVariableParamType = {
  taskAccountPubKey: string;
  variableInTaskName: string;
  desktopVariableId: string; // OMITTED_VARIABLE_IDENTIFIER if variableInTaskName suppose to be unpaired on purpose
};

export const OMITTED_VARIABLE_IDENTIFIER = 'OMITTED';
