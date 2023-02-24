import { TaskStartStopParam } from 'models';

import config from '../../config';
import sendMessage from '../sendMessage';

export default (payload: TaskStartStopParam): Promise<void> =>
  sendMessage(config.endpoints.START_TASK, payload);
