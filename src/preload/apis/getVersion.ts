import config from 'config';
import sendMessage from 'preload/sendMessage';

export default (): Promise<string> =>
  sendMessage(config.endpoints.GET_VERSION, undefined);
