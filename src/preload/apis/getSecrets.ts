import config from 'config';
import { Task } from 'models';
import { GetSecretsParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (params: GetSecretsParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_SECRETS, params);
