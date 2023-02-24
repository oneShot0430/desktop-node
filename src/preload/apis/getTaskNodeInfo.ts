import config from 'config';
import { GetTaskNodeInfoResponse } from 'models/api';

import sendMessage from '../sendMessage';

export default (): Promise<GetTaskNodeInfoResponse> =>
  sendMessage(config.endpoints.GET_TASK_NODE_INFO, {});
