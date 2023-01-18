import { PairedTaskVariables } from 'models';

export const getPairedTaskVariablesForTask = (
  taskPubKey: string,
  pairedVariables?: PairedTaskVariables
) => {
  if (!pairedVariables) return {};

  return pairedVariables[taskPubKey] || {};
};
