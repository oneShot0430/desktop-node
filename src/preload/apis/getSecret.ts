import config from 'config';
import { Task } from 'models';
import { GetSecretParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (params: GetSecretParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_SECRET, params);
