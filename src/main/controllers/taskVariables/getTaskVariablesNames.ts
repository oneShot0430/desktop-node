import { Event } from 'electron';

import { uniq } from 'lodash';

import { GetTaskVariablesNamesParam } from '../../../models/api';

import { getTaskSource } from '..';

const TASK_VARIABLES_PREFIX = 'process.env.';

export const getTaskVariablesNames = async (
  _: Event,
  { taskPublicKey }: GetTaskVariablesNamesParam
): Promise<string[]> => {
  const taskSourceCode: string = await getTaskSource(taskPublicKey);
  const taskVariablesRegex = /process\.env\.[A-Za-z0-9_]+/g;
  const taskVariablesMatches = taskSourceCode.match(taskVariablesRegex) || [];

  const taskVariablesNames = taskVariablesMatches.map((match) => {
    const taskVariableName = match.substring(TASK_VARIABLES_PREFIX.length);
    return taskVariableName;
  });

  return uniq(taskVariablesNames);
};
