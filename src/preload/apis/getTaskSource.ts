import config from 'config';
import sendMessage from 'preload/sendMessage';

type GetTaskSourcePayload = {
  transactionId: string
}

export default (payload: GetTaskSourcePayload): Promise<string> => 
  sendMessage(config.endpoints.GET_TASK_SOURCE, payload);
