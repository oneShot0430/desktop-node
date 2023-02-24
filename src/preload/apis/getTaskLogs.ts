import config from 'config';
import { GetTaskLogsParam, GetTaskLogsResponse } from 'models';

import sendMessage from '../sendMessage';

export default (payload: GetTaskLogsParam): Promise<GetTaskLogsResponse> =>
  sendMessage(config.endpoints.GET_TASK_LOGS, payload);
