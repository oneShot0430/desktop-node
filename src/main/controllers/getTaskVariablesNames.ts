import { Event } from 'electron';

import { uniq } from 'lodash';

import { GetTaskVariablesNamesParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

import getTaskSource from './getTaskSource';

const getTaskVariablesNames = async (
  _: Event,
  { taskPublicKey }: GetTaskVariablesNamesParam
): Promise<string[]> => {
  const taskSourceCode = await getTaskSource(taskPublicKey);
  const taskVariablesRegex = /process.env\.[A-Za-z0-9_]+/g;
  const taskVariablesMatches: string[] =
    taskSourceCode.match(taskVariablesRegex);

  const taskVariablesnames = taskVariablesMatches.map((match) => {
    const taskVariablesname = match.substring(12);
    return taskVariablesname;
  });

  return uniq(taskVariablesnames);
};

export default mainErrorHandler(getTaskVariablesNames);
