import config from 'config';
import { GetTaskVariablesNamesParam } from 'models';

import sendMessage from '../sendMessage';

export default (params: GetTaskVariablesNamesParam): Promise<string[]> =>
  sendMessage(config.endpoints.GET_TASK_VARIABLES_NAMES, params);
