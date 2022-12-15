import { Event } from 'electron';

import { uniq } from 'lodash';

import { GetSecretsParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

import getTaskSource from './getTaskSource';

const getSecrets = async (
  _: Event,
  { taskPublicKey }: GetSecretsParam
): Promise<string[]> => {
  const taskSourceCode = await getTaskSource(taskPublicKey);
  const secretsRegex = /process.env\.[A-Za-z0-9_]+/g;
  const secretsMatches: string[] = taskSourceCode.match(secretsRegex);

  const secrets = secretsMatches.map((match) => {
    const secretName = match.substring(12);
    return secretName;
  });

  return uniq(secrets);
};

export default mainErrorHandler(getSecrets);
