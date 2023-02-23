import config from '../../config';
import { TaskStartStopParam } from '../../models/api';
import sendMessage from '../sendMessage';

export default (payload: TaskStartStopParam): Promise<void> =>
  sendMessage(config.endpoints.START_TASK, payload);
