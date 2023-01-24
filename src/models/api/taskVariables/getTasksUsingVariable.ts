import { Task } from 'models';

import { DesktopNodeVariableID } from './types';

export type GetTasksPairedWithVariableParamType = {
  variableId: DesktopNodeVariableID;
};

export type GetTasksPairedWithVariableReturnType = Task[];
